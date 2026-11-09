# MdPreview 模块服务技术方案

## 1. 目标

在现有 Electron 桌面版和浏览器版 Markdown 编辑器基础上，增加一个可扩展的后端模块服务，提供：

- 用户、账号和权限管理
- Markdown 文件和图片上传
- 本地文件存储
- PostgreSQL 数据存储
- 在线 Embedding 模型接入
- Embedding 向量检索
- MCP 服务接入和工具管理
- 定时任务
- 本地备份和 S3 备份
- 从 S3 备份一键恢复

系统默认使用本地磁盘保存业务文件，S3 只用于异地备份，不要求日常运行安装或使用 S3 存储。

## 2. 总体架构

```text
┌──────────────────────────────┐
│ 浏览器 Web 前端 / Electron    │
│ Vue + Vite                    │
└──────────────┬───────────────┘
               │ HTTP / WebSocket
┌──────────────▼───────────────┐
│ MdPreview API 服务            │
│ Node.js + Fastify             │
│                              │
│ 认证 │ 文件 │ 文档 │ MCP      │
│ Embedding │ 任务 │ 备份       │
└───────┬──────────────┬───────┘
        │              │
┌───────▼──────┐ ┌─────▼────────────┐
│ PostgreSQL   │ │ 本地文件目录      │
│ + pgvector   │ │ documents/assets  │
└──────────────┘ └──────────────────┘
        │
┌───────▼──────────────────────────┐
│ S3 / MinIO / OSS / COS（备份）    │
└──────────────────────────────────┘
```

前端不直接访问 PostgreSQL、本地文件系统、S3 或模型服务。所有敏感操作由后端完成。

桌面端除了保留本地文件模式，还支持登录后直接连接 Web API 服务。用户可以在桌面端选择“本地模式”或“服务器模式”：

```text
本地模式       Electron → 本机文件系统
服务器模式     Electron → HTTPS API → 服务端 PostgreSQL / 文件目录
浏览器模式     Web 浏览器 → HTTPS API → 服务端 PostgreSQL / 文件目录
```

服务器模式下，桌面端不需要把服务端文件同步到本地。打开、编辑、保存、重命名、删除、文件夹浏览和搜索都通过 API 完成，图片通过受权限保护的文件接口读取。

## 2.1 桌面端远程服务模式

桌面端增加服务器连接设置：

```text
服务地址： https://md.example.com
账号：     user@example.com
密码：     ********
工作区：   Team A
```

登录成功后，后端返回短期访问令牌和刷新令牌。桌面端使用系统安全存储保存刷新令牌，Windows 环境使用 Electron `safeStorage`，不把密码明文写入配置文件。

推荐认证流程：

1. 桌面端请求 `/api/auth/login`
2. 服务端验证账号、密码和工作区权限
3. 返回短期 access token 与 refresh token
4. 桌面端将 refresh token 写入系统安全存储
5. 后续 API 请求带上 `Authorization: Bearer <access-token>`
6. access token 过期时自动刷新
7. 刷新失败时清除会话并要求重新登录

核心远程 API：

```text
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/workspaces
GET    /api/documents
GET    /api/documents/{id}
PUT    /api/documents/{id}
POST   /api/documents/{id}/assets
DELETE /api/documents/{id}
GET    /api/files/{fileId}
GET    /api/search
```

桌面端可以继续使用现有编辑器组件，但将文件操作抽象为统一的数据源接口：

```js
const dataSource = isRemoteMode
  ? createRemoteDataSource(apiClient)
  : createLocalDataSource(electronApi)
```

这样编辑器、预览、目录树和导出逻辑不需要分别维护两套 UI。远程模式下的保存流程为：

```text
编辑器内容
    ↓
PUT /api/documents/{id}
    ↓
服务端写入 PostgreSQL 和本地文件
    ↓
返回版本号、更新时间和 Embedding 任务状态
```

远程模式还需要处理：

- 网络断开时保留本地草稿
- 保存失败时显示重试按钮
- 文档版本冲突时提示比较和合并
- 服务端删除或重命名后刷新目录树
- 大图片使用分片上传或上传进度
- 服务器模式禁止调用本机路径和 Electron 文件对话框

## 2.2 桌面端连接配置

连接配置可以保存在本机，但只保存服务地址、账号标识和工作区，不保存明文密码或 API Key：

```text
serverUrl
accountId
workspaceId
lastConnectedAt
```

桌面端启动时可提供：

- 上次连接服务器
- 只启动本地模式
- 切换服务器
- 退出当前账号
- 查看当前工作区和连接状态

## 2.3 权限模型

服务器端对每一次文件、文档、MCP 和备份操作进行权限检查。建议权限层级为：

```text
系统管理员
工作区管理员
编辑者
只读用户
备份管理员
```

桌面端和浏览器端使用相同的 API 和权限模型，避免桌面端通过本地接口绕过服务端权限。

## 3. 推荐目录结构

```text
md-preview/
├─ src/                         # 现有 Electron 和 Web 前端
├─ apps/
│  └─ server/                   # 后端 API 服务
├─ packages/
│  ├─ db/                       # PostgreSQL schema、迁移、查询
│  ├─ plugin-sdk/               # 模块扩展接口
│  ├─ storage/                  # 本地文件存储抽象
│  ├─ embeddings/               # 在线 Embedding 提供商抽象
│  ├─ mcp/                      # MCP 客户端和服务管理
│  ├─ scheduler/                # 定时任务
│  └─ backup/                   # 备份和恢复
├─ doc/
│  └─ TECHNICAL_PLAN.md
├─ docker-compose.yml           # PostgreSQL 开发环境
└─ .env.example
```

如果暂时不拆成 monorepo，也可以先在项目中增加 `server/`，后续再移动到 `apps/server/`。

## 4. 本地文件存储

业务文件默认保存在项目外部目录，避免上传内容使代码目录不断膨胀：

```text
D:\MdPreviewData\
├─ documents\                 # Markdown 正文
│  └─ {userId}\{documentId}.md
├─ assets\                    # Markdown 中的图片和附件
│  └─ {userId}\{documentId}\{sha256}.{ext}
├─ temp\                      # 上传和备份临时文件
└─ logs\                      # 文件操作日志（可选）
```

Linux 部署时可以使用：

```text
/var/lib/mdpreview/
```

文件名使用文档 ID 和内容哈希，避免用户原始文件名造成路径穿越、覆盖或特殊字符问题。数据库保存文件元数据和相对路径，Markdown 内容中的图片引用通过 API 地址或受控相对地址访问。

建议的数据表包括：

```text
documents
document_files
document_assets
document_versions
```

## 5. PostgreSQL 数据库

PostgreSQL 保存业务数据、文档内容、权限、任务和向量。图片二进制文件保存在本地磁盘，数据库只保存路径、大小、类型和哈希。

建议启用：

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

核心表：

```text
users
sessions
workspaces
workspace_members
documents
document_versions
document_assets
document_chunks
embedding_jobs
embedding_configs
mcp_servers
mcp_tools
scheduled_jobs
backup_records
audit_logs
```

文档内容可以直接保存到 `documents.content`。对于大型附件和图片，只保存本地存储路径。

## 6. 在线 Embedding

Embedding 使用在线模型，服务器不运行本地模型。文档上传或保存后，后端异步拆分文本并调用在线 Embedding API。

```text
保存 Markdown
    ↓
创建 embedding_jobs 任务
    ↓
按标题、段落和代码块拆分
    ↓
调用在线模型 API
    ↓
写入 document_chunks 和 pgvector
```

提供商采用统一接口，支持：

- OpenAI Embeddings
- 阿里云百炼 / 通义
- 智谱
- Cohere
- Gemini
- 其他兼容 OpenAI API 的服务

后端配置示例：

```env
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_API_KEY=change-me
EMBEDDING_BASE_URL=https://api.openai.com/v1
```

需要记录模型名和向量维度。更换模型时不能直接混用旧向量，应创建新的 Embedding 版本并批量重建。

由于正文会发送给在线模型服务，系统应支持：

- 指定文档是否允许建立向量
- API Key 只保存在后端
- 调用失败重试和并发限制
- 任务进度、错误记录和手动重建
- 敏感内容过滤或脱敏策略

## 7. MCP 模块

MCP 模块提供外部 MCP 服务的配置、连接、工具发现和调用能力。MCP 凭据只存储在后端，前端只看到工具名称、描述和授权状态。

建议拆分为：

```text
mcp_servers       # 服务地址、传输协议、启用状态
mcp_tools         # 服务发现的工具
mcp_permissions   # 用户、工作区和工具权限
mcp_call_logs     # 调用记录和错误
```

工具调用前检查：

1. 当前用户是否有权限
2. 当前工作区是否允许使用
3. 参数是否符合工具 schema
4. 是否需要人工确认

## 8. 模块扩展机制

每个模块通过统一生命周期注册：

```js
export default {
  name: 'example-module',
  version: '1.0.0',
  async register(context) {
    context.router.get('/example', handler)
    context.jobs.register('example-job', handler)
    context.events.on('document.saved', handler)
  }
}
```

模块可以注册：

- API 路由
- 数据库迁移
- 定时任务
- 文档事件监听器
- 前端菜单和设置页
- 权限声明

模块权限采用显式 capability，避免插件默认访问全部文件、账号数据或密钥。

## 9. 定时任务

定时任务使用 PostgreSQL-backed 的任务队列，例如 `pg-boss`，不额外引入 Redis。

初始任务包括：

```text
embedding.generate       # 生成或重建向量
backup.create             # 创建备份
backup.upload             # 上传 S3
backup.cleanup            # 清理过期备份
document.cleanup          # 清理临时文件
```

任务记录包括：

```text
任务名称、计划表达式、开始时间、结束时间、状态、重试次数、错误信息
```

## 10. 备份到 S3

S3 只用于备份，不参与日常文件读取。每次备份生成一个独立目录或对象前缀：

```text
s3://{bucket}/mdpreview/backups/2026-11-05-030000/
├─ manifest.json
├─ database.dump
├─ files.tar.zst
└─ checksums.sha256
```

备份步骤：

1. 暂停写入或进入短暂维护状态
2. 执行 PostgreSQL `pg_dump`
3. 打包 `documents/` 和 `assets/`
4. 生成文件清单和 SHA256 校验
5. 上传到 S3
6. 写入 `backup_records`
7. 按保留策略清理过期备份

配置示例：

```env
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 3 * * *
BACKUP_DIR=D:/MdPreviewBackups
BACKUP_S3_ENABLED=true
BACKUP_S3_ENDPOINT=https://s3.example.com
BACKUP_S3_BUCKET=mdpreview-backups
BACKUP_S3_REGION=auto
BACKUP_S3_ACCESS_KEY=change-me
BACKUP_S3_SECRET_KEY=change-me
BACKUP_RETENTION_DAYS=30
```

S3 可以替换为 MinIO、阿里云 OSS、腾讯云 COS 等兼容服务。建议启用服务端加密、版本控制和最小权限访问策略。

## 11. 一键恢复

恢复入口位于后台管理页面。恢复前必须自动生成当前数据的本地安全快照。

恢复步骤：

1. 列出 S3 中的备份记录
2. 选择备份并下载到临时目录
3. 校验 `checksums.sha256`
4. 检查备份版本和数据库迁移版本
5. 自动创建当前数据快照
6. 应用进入只读模式
7. 恢复 `database.dump`
8. 恢复 Markdown 和图片目录
9. 重建文件索引和 Embedding 任务
10. 运行健康检查
11. 恢复正常读写

恢复失败时使用恢复前快照回滚。恢复操作写入 `audit_logs`，记录操作人、备份 ID、开始时间、结果和错误原因。

恢复 API 可以设计为：

```text
GET  /api/backups
POST /api/backups/create
POST /api/backups/{id}/restore
GET  /api/backups/{id}/status
```

## 12. API 模块

```text
/api/auth/*              # 登录、会话、用户
/api/documents/*         # 文档、版本、目录
/api/files/*             # 图片和附件上传下载
/api/search/*            # 关键词和向量搜索
/api/embeddings/*        # 模型配置和重建任务
/api/mcp/*               # MCP 服务和工具
/api/jobs/*              # 定时任务和执行记录
/api/backups/*           # 备份、S3、恢复
/api/admin/*             # 系统设置和审计日志
```

## 13. 安全要求

- PostgreSQL、S3 和模型 API 密钥只存在后端环境变量或密钥管理系统
- 所有文件路径转换为受控的内部 ID，禁止直接拼接用户输入
- 上传文件限制大小、MIME 类型和扩展名
- Markdown 图片和下载接口检查用户、工作区权限
- MCP 工具默认关闭，按用户或工作区授权
- 备份文件启用加密和校验
- 恢复操作必须记录审计日志
- 生产环境通过 HTTPS 访问
- 定期清理临时文件和失效会话

## 14. 分阶段实施

### 阶段一：服务基础

- 新增 Node.js API 服务
- Docker Compose 启动 PostgreSQL
- 数据库迁移和健康检查
- 用户、会话和基础权限
- 本地文件存储

### 阶段二：文档和图片

- Markdown 上传、读取、保存和版本
- 图片上传和访问
- Web 前端从本地模式切换到 API 模式
- Electron 继续支持本地桌面 API

### 阶段三：Embedding 和搜索

- 在线 Embedding 提供商抽象
- `pgvector` 存储
- 异步任务和失败重试
- 关键词 + 向量混合搜索

### 阶段四：备份和恢复

- 本地备份
- S3 备份上传
- 保留策略和校验
- 后台一键恢复
- 恢复前快照和回滚

### 阶段五：MCP 和插件

- MCP 服务配置
- 工具发现和权限
- 插件 SDK
- 前端模块菜单和设置页

## 15. 推荐默认方案

```text
前端：Vue + Vite
后端：Node.js + Fastify
数据库：PostgreSQL + pgvector
任务：pg-boss
文件：本地磁盘
Embedding：在线 API
备份：本地备份 + 可选 S3
认证：HttpOnly Session Cookie
部署：Docker Compose 或 Windows 服务
```

该方案不要求日常安装 S3，适合单机或单服务器部署；S3 只在启用异地备份时配置。
