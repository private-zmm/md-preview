# Contributing to MdPreview

感谢你愿意参与 MdPreview。这个项目关注 Windows 本地 Markdown 写作体验，欢迎围绕稳定性、文档编辑、文件系统、打包发布和安全边界提交改进。

## 适合贡献的方向

- Windows 文件关联、打开方式、启动参数兼容
- Markdown 编辑和渲染兼容
- 文件夹浏览、大纲、长文档体验
- Electron 主进程、preload API 和渲染端安全边界
- 打包、安装、便携版和发布流程
- 自动化测试、回归用例和 CI
- README、截图、使用示例和问题排查文档

## 本地开发

```bash
npm install
npm run dev
```

构建验证：

```bash
npm run build
```

打包验证：

```bash
npm run dist:dir
```

如果 Windows 打包时报 `Access is denied`，通常是旧的 `release/win-unpacked/MdPreview.exe` 仍在运行。关闭应用后重新执行即可。

## 提交 issue

提交 issue 时，请尽量包含：

- 操作系统版本
- MdPreview 版本或 commit
- 复现步骤
- 期望行为
- 实际行为
- 截图、日志或示例 Markdown 文件

涉及文件打开、保存、删除、导出等问题时，请不要上传包含隐私内容的真实文档。可以提供最小复现样例。

## 提交 pull request

建议流程：

1. 先开 issue 描述问题或改进方向。
2. 保持 PR 聚焦，一次只解决一个主题。
3. 本地执行 `npm run build`。
4. 在 PR 描述中写清楚变更范围、验证方式和潜在风险。
5. 涉及 UI 的改动，请附截图或录屏。

## 代码原则

- 保持主进程、preload 和 renderer 的职责边界清晰。
- 不扩大 preload API 暴露面，除非有明确必要。
- 文件路径、文件关联和系统入口要优先考虑 Windows 行为。
- Markdown 渲染内容必须经过安全处理。
- 避免为临时需求增加复杂配置。
- 用户数据和本地文件安全优先于功能便利。

## 文档原则

- 新功能需要同步更新 README 或相关文档。
- 用户可见行为变化需要写清楚迁移影响。
- 常见 Windows 打包/安装问题应沉淀到文档中。

## 行为准则

请保持讨论直接、友好、可复现。对问题本身负责，不对人做评价。维护者可以关闭无法复现、范围过大或与项目目标不符的 issue。