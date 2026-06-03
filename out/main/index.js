import { ipcMain, dialog, app, BrowserWindow, shell, clipboard, nativeImage, Menu } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash, createHmac } from "node:crypto";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;
let initialFilePath = null;
let isForceClosing = false;
const markdownExtensions = /* @__PURE__ */ new Set([".md", ".markdown", ".mdown", ".mkd"]);
const maxFolderFiles = 1e3;
function isMarkdownFile(filePath) {
  return markdownExtensions.has(path.extname(filePath).toLowerCase());
}
function getFileFromArgv(argv) {
  return argv.find((arg) => {
    if (!arg || arg.startsWith("-")) return false;
    const normalized = normalizeFilePathArg(arg);
    return normalized && isMarkdownFile(normalized);
  });
}
function normalizeFilePathArg(arg) {
  const value = String(arg || "").trim().replace(/^"|"$/g, "");
  if (!value || value.startsWith("-")) return null;
  try {
    if (value.startsWith("file:")) return fileURLToPath(value);
  } catch {
    return null;
  }
  return path.resolve(value);
}
function queueSystemFileOpen(filePath) {
  if (!filePath) return;
  const normalized = path.resolve(filePath);
  initialFilePath = normalized;
  if (!mainWindow || mainWindow.isDestroyed() || mainWindow.webContents.isLoading()) return;
  mainWindow.webContents.send("document:open-from-system", normalized);
}
function stripMarkdown(value) {
  return value.replace(/^#{1,6}\s+/gm, "").replace(/!\[[^\]]*]\([^)]+\)/g, "").replace(/\[([^\]]+)]\([^)]+\)/g, "$1").replace(/[`*_~>#-]/g, "").replace(/\s+/g, " ").trim();
}
async function getMarkdownSummary(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return stripMarkdown(content).slice(0, 50);
  } catch {
    return "";
  }
}
async function createMarkdownFileEntry(filePath, rootPath) {
  const parsed = path.parse(filePath);
  return {
    filePath,
    fileName: path.basename(filePath),
    baseName: parsed.name,
    extension: parsed.ext,
    summary: await getMarkdownSummary(filePath),
    relativePath: rootPath ? path.relative(rootPath, filePath) : path.basename(filePath)
  };
}
function isPathInside(parentPath, childPath) {
  if (!parentPath || !childPath) return false;
  const relativePath = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relativePath === "" || !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}
function getAppIconPath() {
  return app.isPackaged ? path.join(process.resourcesPath, "build/icon.ico") : path.join(__dirname$1, "../../build/icon.ico");
}
function createWindow() {
  isForceClosing = false;
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 860,
    minHeight: 560,
    title: "MdPreview",
    icon: getAppIconPath(),
    backgroundColor: "#f7f6f3",
    show: false,
    webPreferences: {
      preload: path.join(__dirname$1, "../preload/index.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
    }
  });
  Menu.setApplicationMenu(null);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.on("close", (event) => {
    if (isForceClosing) return;
    event.preventDefault();
    mainWindow.webContents.send("window:request-close");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../renderer/index.html"));
  }
}
async function readMarkdownFile(filePath) {
  const normalized = path.resolve(filePath);
  const content = await fs.readFile(normalized, "utf8");
  return {
    canceled: false,
    filePath: normalized,
    fileName: path.basename(normalized),
    content
  };
}
async function openMarkdownFile(filePath) {
  if (filePath) {
    return readMarkdownFile(filePath);
  }
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "打开 Markdown 文件",
    properties: ["openFile"],
    filters: [
      { name: "Markdown", extensions: ["md", "markdown", "mdown", "mkd"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }
  return readMarkdownFile(result.filePaths[0]);
}
async function collectMarkdownFiles(folderPath) {
  const root = path.resolve(folderPath);
  const files = [];
  async function walk(currentPath) {
    if (files.length >= maxFolderFiles) return;
    let entries = [];
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch {
      return;
    }
    entries.sort((left, right) => {
      if (left.isDirectory() !== right.isDirectory()) return left.isDirectory() ? -1 : 1;
      return left.name.localeCompare(right.name);
    });
    for (const entry of entries) {
      if (files.length >= maxFolderFiles) return;
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile() && isMarkdownFile(entryPath)) {
        files.push(await createMarkdownFileEntry(entryPath, root));
      }
    }
  }
  await walk(root);
  return files;
}
async function openMarkdownFolder() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "打开 Markdown 文件夹",
    properties: ["openDirectory"]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }
  const folderPath = path.resolve(result.filePaths[0]);
  const files = await collectMarkdownFiles(folderPath);
  return {
    canceled: false,
    folderPath,
    folderName: path.basename(folderPath),
    files
  };
}
async function refreshMarkdownFolder(folderPath) {
  const root = path.resolve(folderPath);
  const files = await collectMarkdownFiles(root);
  return {
    canceled: false,
    folderPath: root,
    folderName: path.basename(root),
    files
  };
}
function assertInsideFolder(folderPath, targetPath) {
  const root = path.resolve(folderPath);
  const resolved = path.resolve(targetPath);
  if (!isPathInside(root, resolved)) {
    throw new Error("目标路径不在当前文件夹内");
  }
  return resolved;
}
function normalizeMarkdownFileName(fileName) {
  const trimmed = String(fileName || "").trim();
  if (!trimmed) throw new Error("文件名不能为空");
  return isMarkdownFile(trimmed) ? trimmed : `${trimmed}.md`;
}
async function createMarkdownFileInFolder({ folderPath, targetDirPath, fileName }) {
  const root = path.resolve(folderPath);
  const targetDir = assertInsideFolder(root, targetDirPath || root);
  const finalName = normalizeMarkdownFileName(fileName);
  const filePath = assertInsideFolder(root, path.join(targetDir, finalName));
  try {
    await fs.writeFile(filePath, "", { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error.code === "EEXIST") throw new Error("文件已存在");
    throw error;
  }
  return {
    file: await createMarkdownFileEntry(filePath, root),
    folder: await refreshMarkdownFolder(root)
  };
}
async function createFolderInFolder({ folderPath, targetDirPath, folderName }) {
  const root = path.resolve(folderPath);
  const trimmedName = String(folderName || "").trim();
  if (!trimmedName) throw new Error("文件夹名不能为空");
  const targetDir = assertInsideFolder(root, targetDirPath || root);
  const newFolderPath = assertInsideFolder(root, path.join(targetDir, trimmedName));
  await fs.mkdir(newFolderPath, { recursive: false });
  return refreshMarkdownFolder(root);
}
async function renameFolderItem({ folderPath, itemPath, newName }) {
  const root = path.resolve(folderPath);
  const sourcePath = assertInsideFolder(root, itemPath);
  const trimmedName = String(newName || "").trim();
  if (!trimmedName) throw new Error("名称不能为空");
  const stat = await fs.stat(sourcePath);
  const finalName = stat.isFile() && isMarkdownFile(sourcePath) ? normalizeMarkdownFileName(trimmedName) : trimmedName;
  const targetPath = assertInsideFolder(root, path.join(path.dirname(sourcePath), finalName));
  const samePath = sourcePath.toLowerCase() === targetPath.toLowerCase();
  if (!samePath) {
    const exists = await fs.access(targetPath).then(() => true).catch(() => false);
    if (exists) throw new Error("目标名称已存在");
  }
  await fs.rename(sourcePath, targetPath);
  return {
    oldPath: sourcePath,
    newPath: targetPath,
    folder: await refreshMarkdownFolder(root),
    file: stat.isFile() && isMarkdownFile(targetPath) ? await readMarkdownFile(targetPath) : null
  };
}
async function duplicateMarkdownFile({ folderPath, filePath }) {
  const root = path.resolve(folderPath);
  const sourcePath = assertInsideFolder(root, filePath);
  if (!isMarkdownFile(sourcePath)) throw new Error("只能复制 Markdown 文件");
  const parsed = path.parse(sourcePath);
  let index = 1;
  let targetPath;
  do {
    const suffix = index === 1 ? " copy" : ` copy ${index}`;
    targetPath = path.join(parsed.dir, `${parsed.name}${suffix}${parsed.ext}`);
    index += 1;
  } while (await fs.access(targetPath).then(() => true).catch(() => false));
  await fs.copyFile(sourcePath, targetPath);
  return {
    file: await createMarkdownFileEntry(targetPath, root),
    folder: await refreshMarkdownFolder(root)
  };
}
async function deleteFolderItem({ folderPath, itemPath }) {
  const root = path.resolve(folderPath);
  const targetPath = assertInsideFolder(root, itemPath);
  await shell.trashItem(targetPath);
  return {
    deletedPath: targetPath,
    folder: await refreshMarkdownFolder(root)
  };
}
function showFolderItem(itemPath) {
  shell.showItemInFolder(path.resolve(itemPath));
  return { ok: true };
}
async function createMarkdownFile(folderPath) {
  const baseFolder = folderPath ? path.resolve(folderPath) : null;
  const defaultPath = baseFolder ? path.join(baseFolder, "Untitled.md") : "Untitled.md";
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "新建 Markdown 文件",
    defaultPath,
    filters: [
      { name: "Markdown", extensions: ["md"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }
  let filePath = path.resolve(result.filePath);
  if (!isMarkdownFile(filePath)) {
    filePath = `${filePath}.md`;
  }
  await fs.writeFile(filePath, "", "utf8");
  return {
    canceled: false,
    filePath,
    fileName: path.basename(filePath),
    content: "",
    file: await createMarkdownFileEntry(filePath, baseFolder)
  };
}
async function saveMarkdownFile(filePath, content, defaultFolderPath = null) {
  if (!filePath) {
    return saveMarkdownFileAs(content, defaultFolderPath);
  }
  const normalized = path.resolve(filePath);
  await fs.writeFile(normalized, content, "utf8");
  const rootPath = defaultFolderPath && isPathInside(defaultFolderPath, normalized) ? path.resolve(defaultFolderPath) : null;
  return {
    canceled: false,
    filePath: normalized,
    fileName: path.basename(normalized),
    file: rootPath ? await createMarkdownFileEntry(normalized, rootPath) : null
  };
}
async function saveMarkdownFileAs(content, defaultFolderPath = null) {
  const defaultPath = defaultFolderPath ? path.join(path.resolve(defaultFolderPath), "Untitled.md") : "Untitled.md";
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "另存为 Markdown 文件",
    defaultPath,
    filters: [
      { name: "Markdown", extensions: ["md"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }
  let filePath = path.resolve(result.filePath);
  if (!isMarkdownFile(filePath)) {
    filePath = `${filePath}.md`;
  }
  return saveMarkdownFile(filePath, content, defaultFolderPath);
}
function getExportConfig(format) {
  const configs = {
    pdf: {
      title: "导出为 PDF",
      extension: "pdf",
      filters: [{ name: "PDF", extensions: ["pdf"] }]
    },
    html: {
      title: "导出为 HTML",
      extension: "html",
      filters: [{ name: "HTML", extensions: ["html", "htm"] }]
    },
    png: {
      title: "导出为图像",
      extension: "png",
      filters: [{ name: "PNG Image", extensions: ["png"] }]
    }
  };
  return configs[format];
}
function replaceFileExtension(fileName, extension) {
  const parsed = path.parse(fileName || "Untitled");
  return `${parsed.name || "Untitled"}.${extension}`;
}
async function chooseExportPath(format, fileName) {
  const config = getExportConfig(format);
  if (!config) throw new Error("不支持的导出格式");
  const result = await dialog.showSaveDialog(mainWindow, {
    title: config.title,
    defaultPath: replaceFileExtension(fileName, config.extension),
    filters: [...config.filters, { name: "All Files", extensions: ["*"] }]
  });
  if (result.canceled || !result.filePath) return null;
  const hasExtension = path.extname(result.filePath);
  return hasExtension ? result.filePath : `${result.filePath}.${config.extension}`;
}
function waitForWebContentsLoad(webContents) {
  return new Promise((resolve, reject) => {
    webContents.once("did-finish-load", resolve);
    webContents.once("did-fail-load", (_event, _code, description) => reject(new Error(description)));
  });
}
async function createExportWindow(html) {
  const exportWindow = new BrowserWindow({
    show: false,
    width: 960,
    height: 1200,
    backgroundColor: "#ffffff",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
    }
  });
  const loadPromise = waitForWebContentsLoad(exportWindow.webContents);
  await exportWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  await loadPromise;
  return exportWindow;
}
async function exportPdf(html, filePath) {
  const exportWindow = await createExportWindow(html);
  try {
    const data = await exportWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
      margins: {
        marginType: "default"
      }
    });
    await fs.writeFile(filePath, data);
  } finally {
    exportWindow.destroy();
  }
}
async function exportPng(html, filePath) {
  const exportWindow = await createExportWindow(html);
  try {
    const dimensions = await exportWindow.webContents.executeJavaScript(`(() => {
      const body = document.body
      const documentElement = document.documentElement
      return {
        width: Math.ceil(Math.max(body.scrollWidth, documentElement.scrollWidth, 960)),
        height: Math.ceil(Math.max(body.scrollHeight, documentElement.scrollHeight, 600))
      }
    })()`);
    const width = Math.min(Math.max(dimensions.width, 960), 1600);
    const height = Math.min(Math.max(dimensions.height, 600), 12e3);
    exportWindow.setSize(width, height);
    await new Promise((resolve) => setTimeout(resolve, 120));
    const image = await exportWindow.webContents.capturePage({ x: 0, y: 0, width, height });
    await fs.writeFile(filePath, image.toPNG());
  } finally {
    exportWindow.destroy();
  }
}
async function exportMarkdownDocument({ format, html, fileName }) {
  if (!html) throw new Error("没有可导出的内容");
  const filePath = await chooseExportPath(format, fileName);
  if (!filePath) return { canceled: true };
  if (format === "html") {
    await fs.writeFile(filePath, html, "utf8");
  } else if (format === "pdf") {
    await exportPdf(html, filePath);
  } else if (format === "png") {
    await exportPng(html, filePath);
  } else {
    throw new Error("不支持的导出格式");
  }
  return {
    canceled: false,
    filePath,
    fileName: path.basename(filePath)
  };
}
function getTimestamp() {
  const now = /* @__PURE__ */ new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours()
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}
function toMarkdownPath(filePath) {
  return filePath.split(path.sep).join("/");
}
function trimSlashes(value = "") {
  return String(value).replace(/^\/+|\/+$/g, "");
}
function joinUrl(baseUrl, ...parts) {
  const base = String(baseUrl || "").replace(/\/+$/g, "");
  const pathParts = parts.map(trimSlashes).filter(Boolean);
  return pathParts.length > 0 ? `${base}/${pathParts.join("/")}` : base;
}
function joinKey(...parts) {
  return parts.map((part) => trimSlashes(String(part || "").replace(/\\/g, "/"))).filter(Boolean).join("/");
}
function tryDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function getUrlPathname(value) {
  try {
    return tryDecodeURIComponent(new URL(value).pathname);
  } catch {
    return "";
  }
}
function stripRemotePathPrefix(targetPath, prefixPath) {
  const target = `/${trimSlashes(tryDecodeURIComponent(targetPath).replace(/\\/g, "/"))}`;
  const prefix = `/${trimSlashes(tryDecodeURIComponent(prefixPath).replace(/\\/g, "/"))}`;
  if (prefix === "/") return trimSlashes(target);
  if (target === prefix) return "";
  if (target.startsWith(`${prefix}/`)) return trimSlashes(target.slice(prefix.length));
  return trimSlashes(target);
}
function normalizeRemoteImagePath(imageSavePath = "images", webdav = {}) {
  const rawPath = String(imageSavePath || "").trim();
  if (!rawPath) return "images";
  if (path.win32.isAbsolute(rawPath) && !rawPath.startsWith("/")) {
    return path.win32.basename(path.win32.normalize(rawPath)) || "images";
  }
  let remotePath = rawPath;
  if (/^https?:\/\//i.test(remotePath)) {
    remotePath = getUrlPathname(remotePath);
  } else if (/^webdav:\/\//i.test(remotePath)) {
    remotePath = remotePath.slice("webdav://".length);
  }
  remotePath = tryDecodeURIComponent(remotePath).replace(/[?#].*$/g, "").replace(/\\/g, "/").replace(/^[A-Za-z]:\/?/g, "");
  const knownPrefixes = [
    getUrlPathname(webdav.publicBaseUrl),
    getUrlPathname(webdav.url),
    webdav.remotePath
  ].filter(Boolean);
  for (const prefix of knownPrefixes) {
    const nextPath = stripRemotePathPrefix(remotePath, prefix);
    if (nextPath !== trimSlashes(remotePath)) {
      remotePath = nextPath;
    }
  }
  remotePath = trimSlashes(remotePath);
  return remotePath || "images";
}
function createWebDavPublicUrl(settings, remotePath) {
  const webdav = settings.webdav || {};
  const baseUrl = webdav.publicBaseUrl || webdav.url;
  const basePath = getUrlPathname(baseUrl);
  const markdownRemotePath = stripRemotePathPrefix(remotePath, basePath);
  return joinUrl(baseUrl, encodePathSegments(markdownRemotePath));
}
function encodePathSegments(value) {
  return String(value).split("/").map((segment) => encodeURIComponent(segment)).join("/");
}
function hasWebDavConfig(settings) {
  return Boolean(settings?.webdav?.url);
}
function hasS3Config(settings) {
  return Boolean(
    settings?.s3?.endpoint && settings?.s3?.bucket && settings?.s3?.accessKeyId && settings?.s3?.secretAccessKey
  );
}
function getImageMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".apng": "image/apng",
    ".avif": "image/avif",
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
  };
  return mimeTypes[extension] || "application/octet-stream";
}
function getWebDavAuthHeaders(settings) {
  const webdav = settings?.webdav || {};
  if (!webdav.username && !webdav.password) return {};
  return {
    Authorization: `Basic ${Buffer.from(`${webdav.username || ""}:${webdav.password || ""}`).toString(
      "base64"
    )}`
  };
}
function isUrlInsideBase(url, baseUrl) {
  if (!url || !baseUrl) return false;
  try {
    const parsedUrl = new URL(url);
    const parsedBase = new URL(baseUrl);
    const basePath = parsedBase.pathname.replace(/\/+$/g, "");
    return parsedUrl.origin === parsedBase.origin && (!basePath || parsedUrl.pathname === basePath || parsedUrl.pathname.startsWith(`${basePath}/`));
  } catch {
    return false;
  }
}
function isWebDavImageUrl(source, settings) {
  const webdav = settings?.webdav || {};
  return isUrlInsideBase(source, webdav.publicBaseUrl) || isUrlInsideBase(source, webdav.url);
}
function responseToDataUrl(response, source, buffer) {
  const contentType = response.headers.get("content-type") || getImageMimeType(getUrlPathname(source));
  return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
}
async function resolveRemoteImageAssetUrl(markdownBasePath, source, settings) {
  if (settings?.syncProvider !== "webdav" || !hasWebDavConfig(settings)) return null;
  if (/^https?:\/\//i.test(source)) {
    if (!isWebDavImageUrl(source, settings)) return null;
    const response2 = await fetch(source, {
      headers: getWebDavAuthHeaders(settings)
    });
    if (!response2.ok) throw new Error(`WebDAV 图片读取失败：HTTP ${response2.status}`);
    return responseToDataUrl(response2, source, await response2.arrayBuffer());
  }
  if (!markdownBasePath?.startsWith("webdav://")) return null;
  const markdownRemotePath = parseWebDavVirtualPath(markdownBasePath);
  const baseDir = isMarkdownFile(markdownRemotePath) ? path.posix.dirname(markdownRemotePath) : markdownRemotePath;
  const remotePath = source.startsWith("/") ? `/${trimSlashes(source)}` : path.posix.resolve(baseDir, source);
  const response = await webDavRequest(settings, "GET", remotePath);
  return responseToDataUrl(response, source, await response.arrayBuffer());
}
async function resolveImageAssetUrl(markdownBasePath, source, syncSettings = null) {
  const remoteAssetUrl = await resolveRemoteImageAssetUrl(markdownBasePath, source, syncSettings);
  if (remoteAssetUrl) return remoteAssetUrl;
  if (!source || /^(https?:|data:|mailto:|#)/i.test(source)) return source;
  let resolved;
  if (/^file:/i.test(source)) {
    resolved = fileURLToPath(source);
  } else if (path.isAbsolute(source)) {
    resolved = source;
  } else {
    if (!markdownBasePath) return source;
    const resolvedBasePath = path.resolve(markdownBasePath);
    const baseDir = isMarkdownFile(resolvedBasePath) ? path.dirname(resolvedBasePath) : resolvedBasePath;
    resolved = path.resolve(baseDir, source);
  }
  return pathToFileURL(resolved).toString();
}
function createMarkdownImagePath(imageFilePath, baseDir, preferredRelativePath, imageName) {
  if (!path.isAbsolute(preferredRelativePath)) {
    return toMarkdownPath(path.join(preferredRelativePath, imageName));
  }
  if (baseDir && isPathInside(baseDir, imageFilePath)) {
    return toMarkdownPath(path.relative(baseDir, imageFilePath));
  }
  return toMarkdownPath(imageFilePath);
}
async function chooseClipboardImagePath(markdownFilePath, defaultFolderPath, imageSavePath = "images") {
  const markdownDir = markdownFilePath ? path.dirname(path.resolve(markdownFilePath)) : null;
  const baseDir = markdownDir || (defaultFolderPath ? path.resolve(defaultFolderPath) : null);
  const imageName = `pasted-${getTimestamp()}.png`;
  const preferredPath = imageSavePath?.trim() || "images";
  if (path.isAbsolute(preferredPath)) {
    const imageDir = path.resolve(preferredPath);
    await fs.mkdir(imageDir, { recursive: true });
    const filePath2 = path.join(imageDir, imageName);
    return {
      filePath: filePath2,
      markdownPath: createMarkdownImagePath(filePath2, baseDir, preferredPath, imageName)
    };
  }
  if (baseDir) {
    const imageDir = path.resolve(baseDir, preferredPath);
    await fs.mkdir(imageDir, { recursive: true });
    const filePath2 = path.join(imageDir, imageName);
    return {
      filePath: filePath2,
      markdownPath: createMarkdownImagePath(filePath2, baseDir, preferredPath, imageName)
    };
  }
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "保存剪贴板图片",
    defaultPath: imageName,
    filters: [
      { name: "PNG Image", extensions: ["png"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (result.canceled || !result.filePath) return null;
  const filePath = path.extname(result.filePath) ? result.filePath : `${result.filePath}.png`;
  return {
    filePath,
    markdownPath: toMarkdownPath(filePath)
  };
}
async function webDavRequest(settings, method, remotePath, body = null, headers = {}) {
  const webdav = settings.webdav || {};
  const requestHeaders = { ...headers };
  if (webdav.username || webdav.password) {
    requestHeaders.Authorization = `Basic ${Buffer.from(
      `${webdav.username || ""}:${webdav.password || ""}`
    ).toString("base64")}`;
  }
  const response = await fetch(joinUrl(webdav.url, remotePath), {
    method,
    headers: requestHeaders,
    body
  });
  if (!response.ok && response.status !== 207 && !(method === "MKCOL" && response.status === 405)) {
    throw new Error(`WebDAV ${method} 失败：HTTP ${response.status}`);
  }
  return response;
}
function createWebDavVirtualPath(remotePath) {
  return `webdav://${encodePathSegments(trimSlashes(remotePath))}`;
}
function parseWebDavVirtualPath(filePath) {
  const value = String(filePath || "");
  if (!value.startsWith("webdav://")) return value;
  return `/${decodeURIComponent(value.slice("webdav://".length))}`;
}
function isRemotePathInside(parentPath, childPath) {
  const parent = `/${trimSlashes(parentPath)}`;
  const child = `/${trimSlashes(childPath)}`;
  const relativePath = path.posix.relative(parent, child);
  return relativePath === "" || !relativePath.startsWith("..") && !path.posix.isAbsolute(relativePath);
}
function assertInsideRemoteFolder(rootRemotePath, targetRemotePath) {
  const root = `/${trimSlashes(rootRemotePath)}`;
  const target = `/${trimSlashes(targetRemotePath)}`;
  if (!isRemotePathInside(root, target)) {
    throw new Error("目标路径不在当前远程文件夹内");
  }
  return target;
}
function createWebDavResourceUrl(settings, remotePath) {
  return joinUrl(settings.webdav?.url, encodePathSegments(remotePath));
}
function parseWebDavResponses(xml) {
  return [...String(xml).matchAll(/<[^:>]*(?::)?response\b[\s\S]*?<\/[^:>]*(?::)?response>/gi)].map(
    (match) => {
      const block = match[0];
      const href = /<[^:>]*(?::)?href\b[^>]*>([\s\S]*?)<\/[^:>]*(?::)?href>/i.exec(block)?.[1] || "";
      const isDirectory = /<[^:>]*(?::)?collection\b/i.test(block);
      return {
        href: href.trim(),
        isDirectory
      };
    }
  );
}
function hrefToRemotePath(settings, href) {
  const webdav = settings.webdav || {};
  const baseUrl = new URL(webdav.url);
  const itemUrl = new URL(href, webdav.url);
  const basePath = decodeURIComponent(baseUrl.pathname.replace(/\/+$/g, ""));
  const itemPath = decodeURIComponent(itemUrl.pathname);
  const remotePath = basePath && itemPath.startsWith(basePath) ? itemPath.slice(basePath.length) : itemPath;
  return `/${trimSlashes(remotePath)}`;
}
async function listWebDavDirectory(settings, remotePath) {
  const response = await webDavRequest(settings, "PROPFIND", remotePath || "/", null, {
    Depth: "1"
  });
  const xml = await response.text();
  const currentPath = `/${trimSlashes(remotePath)}`;
  return parseWebDavResponses(xml).map((item) => ({
    ...item,
    remotePath: hrefToRemotePath(settings, item.href)
  })).filter((item) => trimSlashes(item.remotePath) !== trimSlashes(currentPath));
}
async function remoteResourceExists(settings, remotePath) {
  try {
    await webDavRequest(settings, "PROPFIND", remotePath, null, {
      Depth: "0"
    });
    return true;
  } catch (error) {
    if (String(error.message).includes("HTTP 404")) return false;
    throw error;
  }
}
async function readRemoteMarkdownFile(settings, filePath) {
  const remotePath = parseWebDavVirtualPath(filePath);
  const response = await webDavRequest(settings, "GET", remotePath);
  const content = await response.text();
  return {
    canceled: false,
    filePath: createWebDavVirtualPath(remotePath),
    fileName: path.basename(remotePath),
    content
  };
}
async function getRemoteMarkdownSummary(settings, remotePath) {
  try {
    const document = await readRemoteMarkdownFile(settings, createWebDavVirtualPath(remotePath));
    return stripMarkdown(document.content).slice(0, 50);
  } catch {
    return "";
  }
}
async function collectRemoteMarkdownFiles(settings, rootRemotePath) {
  const root = `/${trimSlashes(rootRemotePath)}`;
  const files = [];
  async function walk(currentPath) {
    if (files.length >= maxFolderFiles) return;
    const entries = await listWebDavDirectory(settings, currentPath);
    for (const entry of entries) {
      if (files.length >= maxFolderFiles) return;
      if (path.basename(entry.remotePath).startsWith(".")) continue;
      if (entry.isDirectory) {
        await walk(entry.remotePath);
      } else if (isMarkdownFile(entry.remotePath)) {
        const parsed = path.parse(entry.remotePath);
        files.push({
          filePath: createWebDavVirtualPath(entry.remotePath),
          fileName: path.basename(entry.remotePath),
          baseName: parsed.name,
          extension: parsed.ext,
          summary: await getRemoteMarkdownSummary(settings, entry.remotePath),
          relativePath: trimSlashes(path.posix.relative(root, entry.remotePath))
        });
      }
    }
  }
  await walk(root);
  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}
async function openRemoteMarkdownFolder(settings) {
  if (!hasWebDavConfig(settings)) throw new Error("请先配置 WebDAV 服务器地址");
  const remotePath = settings.webdav.remotePath || "/";
  await ensureWebDavDirectory(settings, remotePath);
  const files = await collectRemoteMarkdownFiles(settings, remotePath);
  return {
    canceled: false,
    folderPath: createWebDavVirtualPath(remotePath),
    folderName: path.posix.basename(trimSlashes(remotePath)) || "WebDAV",
    files
  };
}
async function refreshRemoteMarkdownFolder(settings, folderPath) {
  const remotePath = parseWebDavVirtualPath(folderPath);
  const files = await collectRemoteMarkdownFiles(settings, remotePath);
  return {
    canceled: false,
    folderPath: createWebDavVirtualPath(remotePath),
    folderName: path.posix.basename(trimSlashes(remotePath)) || "WebDAV",
    files
  };
}
async function createRemoteMarkdownFileInFolder({ settings, folderPath, targetDirPath, fileName }) {
  const root = parseWebDavVirtualPath(folderPath);
  const targetDir = assertInsideRemoteFolder(root, parseWebDavVirtualPath(targetDirPath || folderPath));
  const finalName = normalizeMarkdownFileName(fileName);
  const remotePath = assertInsideRemoteFolder(root, `/${joinKey(targetDir, finalName)}`);
  if (await remoteResourceExists(settings, remotePath)) throw new Error("文件已存在");
  await webDavRequest(settings, "PUT", remotePath, "", {
    "Content-Type": "text/markdown; charset=utf-8"
  });
  return {
    file: await readRemoteMarkdownFile(settings, createWebDavVirtualPath(remotePath)),
    folder: await refreshRemoteMarkdownFolder(settings, folderPath)
  };
}
async function createRemoteFolderInFolder({ settings, folderPath, targetDirPath, folderName }) {
  const root = parseWebDavVirtualPath(folderPath);
  const trimmedName = String(folderName || "").trim();
  if (!trimmedName) throw new Error("文件夹名不能为空");
  const targetDir = assertInsideRemoteFolder(root, parseWebDavVirtualPath(targetDirPath || folderPath));
  const remotePath = assertInsideRemoteFolder(root, `/${joinKey(targetDir, trimmedName)}`);
  if (await remoteResourceExists(settings, remotePath)) throw new Error("文件夹已存在");
  await webDavRequest(settings, "MKCOL", remotePath);
  return refreshRemoteMarkdownFolder(settings, folderPath);
}
async function renameRemoteFolderItem({ settings, folderPath, itemPath, newName }) {
  const root = parseWebDavVirtualPath(folderPath);
  const sourcePath = assertInsideRemoteFolder(root, parseWebDavVirtualPath(itemPath));
  const trimmedName = String(newName || "").trim();
  if (!trimmedName) throw new Error("名称不能为空");
  const finalName = isMarkdownFile(sourcePath) ? normalizeMarkdownFileName(trimmedName) : trimmedName;
  const targetPath = assertInsideRemoteFolder(root, `/${joinKey(path.posix.dirname(sourcePath), finalName)}`);
  await webDavRequest(settings, "MOVE", sourcePath, null, {
    Destination: createWebDavResourceUrl(settings, targetPath),
    Overwrite: "F"
  });
  return {
    oldPath: createWebDavVirtualPath(sourcePath),
    newPath: createWebDavVirtualPath(targetPath),
    folder: await refreshRemoteMarkdownFolder(settings, folderPath),
    file: isMarkdownFile(targetPath) ? await readRemoteMarkdownFile(settings, createWebDavVirtualPath(targetPath)) : null
  };
}
async function duplicateRemoteMarkdownFile({ settings, folderPath, filePath }) {
  const root = parseWebDavVirtualPath(folderPath);
  const sourcePath = assertInsideRemoteFolder(root, parseWebDavVirtualPath(filePath));
  if (!isMarkdownFile(sourcePath)) throw new Error("只能复制 Markdown 文件");
  const parsed = path.posix.parse(sourcePath);
  let index = 1;
  let targetPath;
  while (!targetPath) {
    const suffix = index === 1 ? " copy" : ` copy ${index}`;
    const candidate = assertInsideRemoteFolder(root, `/${joinKey(parsed.dir, `${parsed.name}${suffix}${parsed.ext}`)}`);
    try {
      await webDavRequest(settings, "COPY", sourcePath, null, {
        Destination: createWebDavResourceUrl(settings, candidate),
        Overwrite: "F"
      });
      targetPath = candidate;
    } catch (error) {
      if (!String(error.message).includes("HTTP 412")) throw error;
      index += 1;
    }
  }
  return {
    file: await readRemoteMarkdownFile(settings, createWebDavVirtualPath(targetPath)),
    folder: await refreshRemoteMarkdownFolder(settings, folderPath)
  };
}
async function deleteRemoteFolderItem({ settings, folderPath, itemPath }) {
  const root = parseWebDavVirtualPath(folderPath);
  const targetPath = assertInsideRemoteFolder(root, parseWebDavVirtualPath(itemPath));
  await webDavRequest(settings, "DELETE", targetPath);
  return {
    deletedPath: createWebDavVirtualPath(targetPath),
    folder: await refreshRemoteMarkdownFolder(settings, folderPath)
  };
}
function showRemoteFolderItem(settings, itemPath) {
  const remotePath = parseWebDavVirtualPath(itemPath);
  shell.openExternal(createWebDavResourceUrl(settings, remotePath));
  return { ok: true };
}
async function saveRemoteMarkdownFile(settings, filePath, content) {
  const remotePath = parseWebDavVirtualPath(filePath);
  await webDavRequest(settings, "PUT", remotePath, content, {
    "Content-Type": "text/markdown; charset=utf-8"
  });
  return {
    canceled: false,
    filePath: createWebDavVirtualPath(remotePath),
    fileName: path.basename(remotePath),
    file: null
  };
}
async function ensureWebDavDirectory(settings, remoteDir) {
  const parts = trimSlashes(remoteDir).split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    current = joinKey(current, part);
    try {
      await webDavRequest(settings, "MKCOL", current);
    } catch (error) {
      if (!String(error.message).includes("HTTP 405")) throw error;
    }
  }
}
async function uploadClipboardImageToWebDav(settings, imageBuffer, imageSavePath, imageName) {
  const webdav = settings.webdav || {};
  const remoteImagePath = normalizeRemoteImagePath(imageSavePath, webdav);
  const remoteDir = joinKey(webdav.remotePath || "/", remoteImagePath);
  const remotePath = joinKey(remoteDir, imageName);
  await ensureWebDavDirectory(settings, remoteDir);
  await webDavRequest(settings, "PUT", remotePath, imageBuffer, {
    "Content-Type": "image/png"
  });
  return {
    markdownPath: createWebDavPublicUrl(settings, remotePath),
    cleanup: {
      type: "webdav",
      remotePath
    }
  };
}
function hmac(key, value, encoding) {
  return createHmac("sha256", key).update(value, "utf8").digest(encoding);
}
function sha256(value, encoding = "hex") {
  return createHash("sha256").update(value).digest(encoding);
}
function getAmzDate() {
  const now = /* @__PURE__ */ new Date();
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return {
    amzDate: iso,
    dateStamp: iso.slice(0, 8)
  };
}
function createS3Url(settings, key, query = "") {
  const s3 = settings.s3 || {};
  const endpoint = String(s3.endpoint || "").replace(/\/+$/g, "");
  const encodedKey = encodePathSegments(key);
  if (s3.forcePathStyle) {
    return `${endpoint}/${encodeURIComponent(s3.bucket)}/${encodedKey}${query}`;
  }
  const endpointUrl = new URL(endpoint);
  return `${endpointUrl.protocol}//${s3.bucket}.${endpointUrl.host}/${encodedKey}${query}`;
}
function signS3Request(settings, method, url, body = Buffer.alloc(0), extraHeaders = {}) {
  const s3 = settings.s3 || {};
  const region = s3.region || "auto";
  const service = "s3";
  const parsedUrl = new URL(url);
  const { amzDate, dateStamp } = getAmzDate();
  const payloadHash = sha256(body);
  const headers = {
    host: parsedUrl.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    ...extraHeaders
  };
  const signedHeaders = Object.keys(headers).map((header) => header.toLowerCase()).sort().join(";");
  const canonicalHeaders = Object.keys(headers).map((header) => header.toLowerCase()).sort().map((header) => `${header}:${headers[header]}`).join("\n");
  const canonicalRequest = [
    method,
    parsedUrl.pathname,
    parsedUrl.search.slice(1),
    `${canonicalHeaders}
`,
    signedHeaders,
    payloadHash
  ].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest)
  ].join("\n");
  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${s3.secretAccessKey}`, dateStamp), region), service),
    "aws4_request"
  );
  const signature = hmac(signingKey, stringToSign, "hex");
  headers.Authorization = `AWS4-HMAC-SHA256 Credential=${s3.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return headers;
}
async function s3Request(settings, method, url, body = Buffer.alloc(0), extraHeaders = {}) {
  const headers = signS3Request(settings, method, url, body, extraHeaders);
  const response = await fetch(url, {
    method,
    headers,
    body: method === "GET" ? void 0 : body
  });
  if (!response.ok) {
    throw new Error(`S3 ${method} 失败：HTTP ${response.status}`);
  }
  return response;
}
async function uploadClipboardImageToS3(settings, imageBuffer, imageSavePath, imageName) {
  const s3 = settings.s3 || {};
  const remoteImagePath = normalizeRemoteImagePath(imageSavePath);
  const key = joinKey(s3.prefix || "", remoteImagePath, imageName);
  const url = createS3Url(settings, key);
  await s3Request(settings, "PUT", url, imageBuffer, {
    "content-type": "image/png"
  });
  return {
    markdownPath: s3.publicBaseUrl ? joinUrl(s3.publicBaseUrl, encodePathSegments(key)) : url,
    cleanup: {
      type: "s3",
      key
    }
  };
}
async function uploadClipboardImageToRemote(settings, imageBuffer, imageSavePath, imageName) {
  if (settings?.syncProvider === "webdav" && hasWebDavConfig(settings)) {
    return uploadClipboardImageToWebDav(settings, imageBuffer, imageSavePath, imageName);
  }
  if (settings?.syncProvider === "s3" && hasS3Config(settings)) {
    return uploadClipboardImageToS3(settings, imageBuffer, imageSavePath, imageName);
  }
  return null;
}
async function saveClipboardImage({
  markdownFilePath = null,
  defaultFolderPath = null,
  imageSavePath = "images",
  syncSettings = null
}) {
  const image = clipboard.readImage();
  if (image.isEmpty()) {
    return { canceled: true, reason: "empty" };
  }
  const imageBuffer = image.toPNG();
  const imageName = `pasted-${getTimestamp()}.png`;
  const remoteImage = await uploadClipboardImageToRemote(syncSettings, imageBuffer, imageSavePath, imageName);
  if (remoteImage) {
    return {
      canceled: false,
      filePath: remoteImage.markdownPath,
      markdownPath: remoteImage.markdownPath,
      cleanup: remoteImage.cleanup
    };
  }
  const target = await chooseClipboardImagePath(markdownFilePath, defaultFolderPath, imageSavePath);
  if (!target) return { canceled: true };
  await fs.writeFile(target.filePath, imageBuffer);
  return {
    canceled: false,
    filePath: target.filePath,
    markdownPath: target.markdownPath,
    cleanup: {
      type: "local",
      filePath: target.filePath
    }
  };
}
async function deleteInsertedImage(image, syncSettings) {
  if (!image?.type) return;
  const imageSyncSettings = image.syncSettings || syncSettings;
  if (image.type === "local" && image.filePath) {
    await fs.rm(image.filePath, { force: true });
    return;
  }
  if (image.type === "webdav" && image.remotePath) {
    if (!hasWebDavConfig(imageSyncSettings)) throw new Error("缺少 WebDAV 配置");
    await webDavRequest(imageSyncSettings, "DELETE", image.remotePath);
    return;
  }
  if (image.type === "s3" && image.key) {
    if (!hasS3Config(imageSyncSettings)) throw new Error("缺少 S3 配置");
    await s3Request(imageSyncSettings, "DELETE", createS3Url(imageSyncSettings, image.key));
  }
}
async function deleteInsertedImages({ images = [], syncSettings = null }) {
  const results = await Promise.allSettled(
    images.map((image) => deleteInsertedImage(image, syncSettings))
  );
  const failedCount = results.filter((result) => result.status === "rejected").length;
  return {
    deletedCount: images.length - failedCount,
    failedCount
  };
}
async function copyTextToClipboard(text) {
  clipboard.writeText(String(text || ""));
  return { ok: true };
}
async function copyImageToClipboard(source) {
  if (!source) throw new Error("没有可复制的图片地址");
  let image;
  if (/^data:image\//i.test(source)) {
    image = nativeImage.createFromDataURL(source);
  } else if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`图片下载失败：HTTP ${response.status}`);
    image = nativeImage.createFromBuffer(Buffer.from(await response.arrayBuffer()));
  } else {
    const filePath = /^file:/i.test(source) ? fileURLToPath(source) : source;
    image = nativeImage.createFromBuffer(await fs.readFile(filePath));
  }
  if (image.isEmpty()) throw new Error("图片内容为空，无法复制");
  clipboard.writeImage(image);
  return { ok: true };
}
async function testSyncConnection({ provider, settings }) {
  if (provider === "webdav") {
    if (!hasWebDavConfig(settings)) throw new Error("请先填写 WebDAV 服务器地址");
    await webDavRequest(settings, "PROPFIND", "/", null, {
      Depth: "0"
    });
    if (trimSlashes(settings.webdav.remotePath || "")) {
      await ensureWebDavDirectory(settings, settings.webdav.remotePath);
      await webDavRequest(settings, "PROPFIND", settings.webdav.remotePath, null, {
        Depth: "0"
      });
    }
    return { ok: true };
  }
  if (provider === "s3") {
    if (!hasS3Config(settings)) throw new Error("请先填写完整的 S3 连接信息");
    const prefix = settings.s3.prefix ? `&prefix=${encodeURIComponent(settings.s3.prefix)}` : "";
    const url = createS3Url(settings, "", `?list-type=2&max-keys=1${prefix}`);
    await s3Request(settings, "GET", url);
    return { ok: true };
  }
  throw new Error("不支持的同步类型");
}
ipcMain.handle("document:get-initial-file", async () => {
  if (!initialFilePath) return null;
  const filePath = initialFilePath;
  initialFilePath = null;
  return openMarkdownFile(filePath);
});
ipcMain.handle("document:open", (_event, filePath) => openMarkdownFile(filePath));
ipcMain.handle("document:open-folder", () => openMarkdownFolder());
ipcMain.handle(
  "document:open-remote",
  (_event, { filePath, settings }) => readRemoteMarkdownFile(settings, filePath)
);
ipcMain.handle("document:open-remote-folder", (_event, settings) => openRemoteMarkdownFolder(settings));
ipcMain.handle("document:refresh-folder", (_event, folderPath) => refreshMarkdownFolder(folderPath));
ipcMain.handle(
  "document:refresh-remote-folder",
  (_event, { settings, folderPath }) => refreshRemoteMarkdownFolder(settings, folderPath)
);
ipcMain.handle("document:create-in-folder", (_event, options) => createMarkdownFileInFolder(options));
ipcMain.handle("document:create-folder-in-folder", (_event, options) => createFolderInFolder(options));
ipcMain.handle("document:rename-folder-item", (_event, options) => renameFolderItem(options));
ipcMain.handle("document:duplicate-folder-file", (_event, options) => duplicateMarkdownFile(options));
ipcMain.handle("document:delete-folder-item", (_event, options) => deleteFolderItem(options));
ipcMain.handle("document:show-folder-item", (_event, itemPath) => showFolderItem(itemPath));
ipcMain.handle(
  "document:create-remote-in-folder",
  (_event, options) => createRemoteMarkdownFileInFolder(options)
);
ipcMain.handle(
  "document:create-remote-folder-in-folder",
  (_event, options) => createRemoteFolderInFolder(options)
);
ipcMain.handle("document:rename-remote-folder-item", (_event, options) => renameRemoteFolderItem(options));
ipcMain.handle(
  "document:duplicate-remote-folder-file",
  (_event, options) => duplicateRemoteMarkdownFile(options)
);
ipcMain.handle("document:delete-remote-folder-item", (_event, options) => deleteRemoteFolderItem(options));
ipcMain.handle(
  "document:show-remote-folder-item",
  (_event, { settings, itemPath }) => showRemoteFolderItem(settings, itemPath)
);
ipcMain.handle("document:create", (_event, folderPath) => createMarkdownFile(folderPath));
ipcMain.handle(
  "document:save",
  (_event, { filePath, content, defaultFolderPath }) => saveMarkdownFile(filePath, content, defaultFolderPath)
);
ipcMain.handle(
  "document:save-as",
  (_event, { content, defaultFolderPath }) => saveMarkdownFileAs(content, defaultFolderPath)
);
ipcMain.handle(
  "document:save-remote",
  (_event, { settings, filePath, content }) => saveRemoteMarkdownFile(settings, filePath, content)
);
ipcMain.handle("document:export", (_event, options) => exportMarkdownDocument(options));
ipcMain.handle("document:save-clipboard-image", (_event, options) => saveClipboardImage(options));
ipcMain.handle("document:delete-inserted-images", (_event, options) => deleteInsertedImages(options));
ipcMain.handle("clipboard:copy-text", (_event, text) => copyTextToClipboard(text));
ipcMain.handle("clipboard:copy-image", (_event, source) => copyImageToClipboard(source));
ipcMain.handle("sync:test-connection", (_event, options) => testSyncConnection(options));
ipcMain.handle(
  "document:asset-url",
  (_event, { markdownFilePath, source, syncSettings }) => resolveImageAssetUrl(markdownFilePath, source, syncSettings)
);
ipcMain.handle("dialog:choose-folder", async (_event, title = "选择文件夹") => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title,
    properties: ["openDirectory", "createDirectory"]
  });
  if (result.canceled || result.filePaths.length === 0) return { canceled: true };
  return {
    canceled: false,
    folderPath: result.filePaths[0]
  };
});
ipcMain.handle("window:set-title", (_event, title) => {
  if (mainWindow) mainWindow.setTitle(title || "MdPreview");
});
ipcMain.handle("window:set-document-edited", (_event, edited) => {
  if (mainWindow) mainWindow.setDocumentEdited(Boolean(edited));
});
ipcMain.handle("window:force-close", () => {
  if (!mainWindow) return;
  isForceClosing = true;
  mainWindow.setDocumentEdited(false);
  mainWindow.destroy();
});
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    queueSystemFileOpen(getFileFromArgv(argv));
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(() => {
    initialFilePath = getFileFromArgv(process.argv);
    createWindow();
    app.on("open-file", (event, filePath) => {
      event.preventDefault();
      queueSystemFileOpen(filePath);
    });
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
