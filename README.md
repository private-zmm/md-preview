# MdPreview

MdPreview 是一个面向 Windows 用户的开源本地 Markdown 编辑器，使用 Electron + Vue 3 + Vite 构建。项目目标是提供一个低干扰、离线优先、隐私友好的写作工具，让技术文档、运维手册、学习笔记和项目说明可以在本地稳定编辑。

MdPreview 不是在线文档平台，也不依赖云端账号。它优先解决一个简单但高频的问题：双击或右键打开本地 Markdown 文件后，能够快速进入一个安静、可预览、可保存的桌面写作环境。

## 特性

- Windows 桌面 Markdown 编辑体验
- 使用 Vditor 提供所见即所得/即时渲染编辑能力
- 支持打开单个 Markdown 文件
- 支持打开 Markdown 文件夹并浏览文件列表
- 支持单文件和文件夹内文档大纲
- 支持 `.md`、`.markdown`、`.mdown`、`.mkd` 文件关联
- 支持本地保存、另存为、文件夹内新建文件
- 支持主题切换，覆盖经典、纸张、现代、夜间等写作场景
- 支持代码块高亮、表格、任务列表等常见 Markdown 内容
- 支持粘贴图片、本地图片路径解析和基础导出能力

## 适用场景

- 编写项目 README、部署说明、运维手册
- 维护离线技术文档和知识库
- 在 Windows 上快速查看和编辑 `.md` 文件
- 替代重型笔记工具，用一个轻量桌面程序处理本地 Markdown
- 为开源项目维护者提供低干扰的文档编辑环境

## 截图

建议在公开仓库中补充应用截图，例如：

```text
docs/screenshots/editor.png
docs/screenshots/folder-outline.png
docs/screenshots/themes.png
```

截图能帮助新用户快速理解 MdPreview 的编辑区、文件夹模式、大纲和主题体验。

## 技术栈

```text
Electron        桌面窗口、文件系统、系统打开入口
Vue 3           渲染端 UI 和状态管理
Vite            前端构建
Vditor          Markdown 编辑体验
markdown-it     Markdown 渲染与扩展
DOMPurify       渲染内容净化
Electron Builder Windows 打包和文件关联
```

## 快速开始

### 环境要求

- Node.js 20 或更高版本
- npm
- Windows 10/11

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 打包

生成一个可安装的 Windows `.exe` 安装包：

```bash
npm run dist
```

等价于：

```bash
npm run dist:installer
```

打包产物会输出到 `release/`，文件名类似：

```text
MdPreview-0.1.0-x64.exe
```

双击这个 `.exe` 就可以进入安装向导，安装后会创建桌面快捷方式、开始菜单快捷方式，并注册 Markdown 文件关联。

如果只想生成未安装目录，便于本地验证：

```bash
npm run dist:dir
```

如果只想生成免安装便携版：

```bash
npm run dist:portable
```

如果只想生成压缩包：

```bash
npm run dist:zip
```

## 使用本程序打开 Markdown 文件

安装版会注册以下 Markdown 文件类型：

- `.md`
- `.markdown`
- `.mdown`
- `.mkd`

打包并安装后，可以在 Windows 中右键 Markdown 文件，选择“打开方式”，再选择 `MdPreview.exe`，并勾选始终使用该应用打开 Markdown 文件。

如果重新打包后文件关联没有立即变化，请重新安装新版，或在 Windows 默认应用设置中重新选择 MdPreview。

## 快捷键

- `Ctrl+N`：新建未保存 Markdown 文档
- `Ctrl+O`：打开 Markdown 文件
- `Ctrl+Shift+O`：打开 Markdown 文件夹
- `Ctrl+S`：保存
- `Ctrl+Shift+S`：另存为

## 项目结构

```text
src/main      Electron 主进程，负责窗口、文件读写、系统入口、导出和本地资源处理
src/preload   安全暴露给前端的桌面 API
src/renderer  Vue 3 前端应用
```

Renderer 内部按职责拆分：

```text
components/   顶栏、菜单、编辑区、文件侧栏、设置页、状态栏等 UI 组件
composables/  Markdown 渲染、文档状态等组合逻辑
constants/    主题、默认文档等静态配置
```

整体模块关系：

```text
Windows 文件/用户操作
        ↓
Electron main
        ↓
preload 安全桥接
        ↓
Vue renderer
        ↓
Vditor 编辑器 + Markdown 渲染
```

## 质量与安全边界

MdPreview 是桌面应用，会接触本地文件，因此项目维护重点包括：

- 文件路径解析和文件关联行为稳定
- Electron preload API 最小暴露
- Markdown 渲染内容净化
- 本地图片、远程图片和导出流程的边界处理
- Windows 打包、安装、升级和文件占用问题
- 编辑器状态、未保存变更和异常关闭保护

当前基础验证命令：

```bash
npm run build
```

后续计划补充自动化测试、格式化检查、端到端打开文件验证和 release checklist。

## 路线图

详见 [ROADMAP.md](./ROADMAP.md)。

近期重点：

- 完善 Windows 文件关联和启动参数兼容
- 优化大纲、文件夹浏览和长文档体验
- 增强 Markdown 渲染兼容性
- 补充自动化测试和发布流程
- 加固 Electron 安全边界
- 改进安装包、便携包和升级体验

## 贡献

欢迎提交 issue 和 pull request。贡献前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。

适合参与的方向：

- Windows 桌面体验问题
- Markdown 渲染兼容
- 编辑器交互优化
- Electron 安全边界审查
- 自动化测试和 CI
- 文档、截图和示例内容

## Codex for OSS 使用计划

MdPreview 希望将 Codex 用于日常开源维护，而不是一次性生成代码。计划使用场景包括：

- 分析用户 issue，复现 Windows 文件打开、打包和安装问题
- 审查 Electron 主进程、preload API 和渲染端之间的安全边界
- 为 Markdown 渲染、文件读写和编辑器状态补充测试
- 辅助维护 release checklist，减少发版遗漏
- 对 pull request 做行为回归检查和代码评审
- 持续整理文档、贡献指南和维护任务

项目的长期目标是成为一个稳定、透明、可维护的本地 Markdown 编辑器，特别服务于 Windows 上需要离线写作和维护技术文档的用户。

## 许可证

本项目基于 [MIT License](./LICENSE) 开源。