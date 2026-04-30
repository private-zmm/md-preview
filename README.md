# MdPreview

MdPreview 是一个 Windows 桌面 Markdown 编辑器，使用 Electron + Vue 3 + Vite 构建。首版采用源码/预览分屏，并尽量保持 Typora 风格的安静、低干扰写作界面。

## 开发

```bash
npm install
npm run dev
```

`npm run edv` 也可启动开发模式。

## 打包

```bash
npm run dist
```

打包产物会输出到 `release/`。

## 项目结构

```text
src/main      Electron 主进程，负责窗口、文件读写和系统入口
src/preload   安全暴露给前端的桌面 API
src/renderer  Vue 3 前端应用
```

Renderer 内部按职责拆分：

```text
components/   顶栏、编辑区、预览区、状态栏等 UI 组件
composables/  Markdown 渲染、文档状态等组合逻辑
constants/    主题、默认文档等静态配置
```

## 使用本程序打开 `.md`

v1 不自动注册 `.md` 文件关联。打包后可以在 Windows 中右键 Markdown 文件，选择“打开方式”，再选择 `MdPreview.exe`，并勾选始终使用该应用打开 `.md` 文件。

## 快捷键

- `Ctrl+N`：新建未保存 Markdown 文档
- `Ctrl+O`：打开 Markdown 文件
- `Ctrl+Shift+O`：打开 Markdown 文件夹
- `Ctrl+S`：保存
- `Ctrl+Shift+S`：另存为
