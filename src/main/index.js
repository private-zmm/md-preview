import { app, BrowserWindow, clipboard, dialog, ipcMain, Menu, nativeImage, safeStorage, shell } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createHash, createHmac } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let mainWindow
let initialFilePath = null
let isForceClosing = false

const markdownExtensions = new Set(['.md', '.markdown', '.mdown', '.mkd'])
const maxFolderFiles = 1000

function isMarkdownFile(filePath) {
  return markdownExtensions.has(path.extname(filePath).toLowerCase())
}

function getFileFromArgv(argv) {
  return argv.find((arg) => {
    if (!arg || arg.startsWith('-')) return false

    const normalized = normalizeFilePathArg(arg)
    return normalized && isMarkdownFile(normalized)
  })
}

function normalizeFilePathArg(arg) {
  const value = String(arg || '').trim().replace(/^"|"$/g, '')
  if (!value || value.startsWith('-')) return null

  try {
    if (value.startsWith('file:')) return fileURLToPath(value)
  } catch {
    return null
  }

  return path.resolve(value)
}

function queueSystemFileOpen(filePath) {
  if (!filePath) return

  const normalized = path.resolve(filePath)
  initialFilePath = normalized

  if (!mainWindow || mainWindow.isDestroyed() || mainWindow.webContents.isLoading()) return
  mainWindow.webContents.send('document:open-from-system', normalized)
}

function stripMarkdown(value) {
  return value
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[`*_~>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function getMarkdownSummary(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return stripMarkdown(content).slice(0, 50)
  } catch {
    return ''
  }
}

async function createMarkdownFileEntry(filePath, rootPath) {
  const parsed = path.parse(filePath)

  return {
    type: 'file',
    filePath,
    fileName: path.basename(filePath),
    baseName: parsed.name,
    extension: parsed.ext,
    summary: await getMarkdownSummary(filePath),
    relativePath: rootPath ? path.relative(rootPath, filePath) : path.basename(filePath)
  }
}

function createMarkdownDirectoryEntry(folderPath, rootPath) {
  return {
    type: 'directory',
    filePath: folderPath,
    fileName: path.basename(folderPath),
    relativePath: path.relative(rootPath, folderPath)
  }
}

function isPathInside(parentPath, childPath) {
  if (!parentPath || !childPath) return false
  const relativePath = path.relative(path.resolve(parentPath), path.resolve(childPath))
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
}

function getAppIconPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'build/icon.ico')
    : path.join(__dirname, '../../build/icon.ico')
}

function createWindow() {
  isForceClosing = false

  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 860,
    minHeight: 560,
    title: 'MdPreview',
    icon: getAppIconPath(),
    backgroundColor: '#f7f6f3',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
    }
  })

  Menu.setApplicationMenu(null)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (event) => {
    if (isForceClosing) return

    event.preventDefault()
    mainWindow.webContents.send('window:request-close')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

async function readMarkdownFile(filePath) {
  const normalized = path.resolve(filePath)
  const content = await fs.readFile(normalized, 'utf8')

  return {
    canceled: false,
    filePath: normalized,
    fileName: path.basename(normalized),
    content
  }
}

async function openMarkdownFile(filePath) {
  if (filePath) {
    return readMarkdownFile(filePath)
  }

  const result = await dialog.showOpenDialog(mainWindow, {
    title: '打开 Markdown 文件',
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'mkd'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  return readMarkdownFile(result.filePaths[0])
}

async function collectMarkdownFiles(folderPath) {
  const root = path.resolve(folderPath)
  const files = []

  async function walk(currentPath) {
    if (files.length >= maxFolderFiles) return

    let entries = []
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true })
    } catch {
      return
    }

    entries.sort((left, right) => {
      if (left.isDirectory() !== right.isDirectory()) return left.isDirectory() ? -1 : 1
      return left.name.localeCompare(right.name)
    })

    for (const entry of entries) {
      if (files.length >= maxFolderFiles) return
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

      const entryPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        files.push(createMarkdownDirectoryEntry(entryPath, root))
        await walk(entryPath)
      } else if (entry.isFile() && isMarkdownFile(entryPath)) {
        files.push(await createMarkdownFileEntry(entryPath, root))
      }
    }
  }

  await walk(root)
  return files
}

async function openMarkdownFolder() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '打开 Markdown 文件夹',
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  const folderPath = path.resolve(result.filePaths[0])
  const files = await collectMarkdownFiles(folderPath)

  return {
    canceled: false,
    folderPath,
    folderName: path.basename(folderPath),
    files
  }
}

async function refreshMarkdownFolder(folderPath) {
  const root = path.resolve(folderPath)
  const files = await collectMarkdownFiles(root)

  return {
    canceled: false,
    folderPath: root,
    folderName: path.basename(root),
    files
  }
}

function assertInsideFolder(folderPath, targetPath) {
  const root = path.resolve(folderPath)
  const resolved = path.resolve(targetPath)
  if (!isPathInside(root, resolved)) {
    throw new Error('目标路径不在当前文件夹内')
  }

  return resolved
}

function normalizeMarkdownFileName(fileName) {
  const trimmed = String(fileName || '').trim()
  if (!trimmed) throw new Error('文件名不能为空')
  return isMarkdownFile(trimmed) ? trimmed : `${trimmed}.md`
}

async function createMarkdownFileInFolder({ folderPath, targetDirPath, fileName }) {
  const root = path.resolve(folderPath)
  const targetDir = assertInsideFolder(root, targetDirPath || root)
  const finalName = normalizeMarkdownFileName(fileName)
  const filePath = assertInsideFolder(root, path.join(targetDir, finalName))

  try {
    await fs.writeFile(filePath, '', { encoding: 'utf8', flag: 'wx' })
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('文件已存在')
    throw error
  }

  return {
    file: await createMarkdownFileEntry(filePath, root),
    folder: await refreshMarkdownFolder(root)
  }
}

async function createFolderInFolder({ folderPath, targetDirPath, folderName }) {
  const root = path.resolve(folderPath)
  const trimmedName = String(folderName || '').trim()
  if (!trimmedName) throw new Error('文件夹名不能为空')

  const targetDir = assertInsideFolder(root, targetDirPath || root)
  const newFolderPath = assertInsideFolder(root, path.join(targetDir, trimmedName))
  await fs.mkdir(newFolderPath, { recursive: false })

  return refreshMarkdownFolder(root)
}

async function renameFolderItem({ folderPath, itemPath, newName }) {
  const root = path.resolve(folderPath)
  const sourcePath = assertInsideFolder(root, itemPath)
  const trimmedName = String(newName || '').trim()
  if (!trimmedName) throw new Error('名称不能为空')

  const stat = await fs.stat(sourcePath)
  const finalName = stat.isFile() && isMarkdownFile(sourcePath) ? normalizeMarkdownFileName(trimmedName) : trimmedName
  const targetPath = assertInsideFolder(root, path.join(path.dirname(sourcePath), finalName))
  const samePath = sourcePath.toLowerCase() === targetPath.toLowerCase()
  if (!samePath) {
    const exists = await fs
      .access(targetPath)
      .then(() => true)
      .catch(() => false)
    if (exists) throw new Error('目标名称已存在')
  }

  await fs.rename(sourcePath, targetPath)

  return {
    oldPath: sourcePath,
    newPath: targetPath,
    folder: await refreshMarkdownFolder(root),
    file: stat.isFile() && isMarkdownFile(targetPath) ? await readMarkdownFile(targetPath) : null
  }
}

async function moveFolderItem({ folderPath, itemPath, targetDirPath }) {
  const root = path.resolve(folderPath)
  const sourcePath = assertInsideFolder(root, itemPath)
  const targetDir = assertInsideFolder(root, targetDirPath || root)

  if (sourcePath === root) throw new Error('不能移动当前打开的根文件夹')

  const [sourceStat, targetStat] = await Promise.all([fs.stat(sourcePath), fs.stat(targetDir)])
  if (!targetStat.isDirectory()) throw new Error('目标路径不是文件夹')
  if (sourceStat.isDirectory() && isPathInside(sourcePath, targetDir)) {
    throw new Error('不能移动到自身或子文件夹内')
  }

  const targetPath = assertInsideFolder(root, path.join(targetDir, path.basename(sourcePath)))
  if (sourcePath.toLowerCase() === targetPath.toLowerCase()) throw new Error('目标位置与当前相同')

  const exists = await fs
    .access(targetPath)
    .then(() => true)
    .catch(() => false)
  if (exists) throw new Error('目标位置已存在同名文件或文件夹')

  await fs.rename(sourcePath, targetPath)

  return {
    oldPath: sourcePath,
    newPath: targetPath,
    folder: await refreshMarkdownFolder(root),
    file: sourceStat.isFile() && isMarkdownFile(targetPath) ? await readMarkdownFile(targetPath) : null
  }
}

async function duplicateMarkdownFile({ folderPath, filePath }) {
  const root = path.resolve(folderPath)
  const sourcePath = assertInsideFolder(root, filePath)
  if (!isMarkdownFile(sourcePath)) throw new Error('只能复制 Markdown 文件')

  const parsed = path.parse(sourcePath)
  let index = 1
  let targetPath

  do {
    const suffix = index === 1 ? ' copy' : ` copy ${index}`
    targetPath = path.join(parsed.dir, `${parsed.name}${suffix}${parsed.ext}`)
    index += 1
  } while (
    await fs
      .access(targetPath)
      .then(() => true)
      .catch(() => false)
  )

  await fs.copyFile(sourcePath, targetPath)

  return {
    file: await createMarkdownFileEntry(targetPath, root),
    folder: await refreshMarkdownFolder(root)
  }
}

async function deleteFolderItem({ folderPath, itemPath }) {
  const root = path.resolve(folderPath)
  const targetPath = assertInsideFolder(root, itemPath)
  await shell.trashItem(targetPath)

  return {
    deletedPath: targetPath,
    folder: await refreshMarkdownFolder(root)
  }
}

function showFolderItem(itemPath) {
  shell.showItemInFolder(path.resolve(itemPath))
  return { ok: true }
}

async function createMarkdownFile(folderPath) {
  const baseFolder = folderPath ? path.resolve(folderPath) : null
  const defaultPath = baseFolder ? path.join(baseFolder, 'Untitled.md') : 'Untitled.md'

  const result = await dialog.showSaveDialog(mainWindow, {
    title: '新建 Markdown 文件',
    defaultPath,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }

  let filePath = path.resolve(result.filePath)
  if (!isMarkdownFile(filePath)) {
    filePath = `${filePath}.md`
  }

  await fs.writeFile(filePath, '', 'utf8')

  return {
    canceled: false,
    filePath,
    fileName: path.basename(filePath),
    content: '',
    file: await createMarkdownFileEntry(filePath, baseFolder)
  }
}

async function saveMarkdownFile(filePath, content, defaultFolderPath = null) {
  if (!filePath) {
    return saveMarkdownFileAs(content, defaultFolderPath)
  }

  const normalized = path.resolve(filePath)
  await fs.writeFile(normalized, content, 'utf8')
  const rootPath =
    defaultFolderPath && isPathInside(defaultFolderPath, normalized)
      ? path.resolve(defaultFolderPath)
      : null

  return {
    canceled: false,
    filePath: normalized,
    fileName: path.basename(normalized),
    file: rootPath ? await createMarkdownFileEntry(normalized, rootPath) : null
  }
}

async function saveMarkdownFileAs(content, defaultFolderPath = null) {
  const defaultPath = defaultFolderPath
    ? path.join(path.resolve(defaultFolderPath), 'Untitled.md')
    : 'Untitled.md'

  const result = await dialog.showSaveDialog(mainWindow, {
    title: '另存为 Markdown 文件',
    defaultPath,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }

  let filePath = path.resolve(result.filePath)
  if (!isMarkdownFile(filePath)) {
    filePath = `${filePath}.md`
  }

  return saveMarkdownFile(filePath, content, defaultFolderPath)
}

function getExportConfig(format) {
  const configs = {
    pdf: {
      title: '导出为 PDF',
      extension: 'pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    },
    html: {
      title: '导出为 HTML',
      extension: 'html',
      filters: [{ name: 'HTML', extensions: ['html', 'htm'] }]
    },
    png: {
      title: '导出为图像',
      extension: 'png',
      filters: [{ name: 'PNG Image', extensions: ['png'] }]
    }
  }

  return configs[format]
}

function replaceFileExtension(fileName, extension) {
  const parsed = path.parse(fileName || 'Untitled')
  return `${parsed.name || 'Untitled'}.${extension}`
}

async function chooseExportPath(format, fileName) {
  const config = getExportConfig(format)
  if (!config) throw new Error('不支持的导出格式')

  const result = await dialog.showSaveDialog(mainWindow, {
    title: config.title,
    defaultPath: replaceFileExtension(fileName, config.extension),
    filters: [...config.filters, { name: 'All Files', extensions: ['*'] }]
  })

  if (result.canceled || !result.filePath) return null

  const hasExtension = path.extname(result.filePath)
  return hasExtension ? result.filePath : `${result.filePath}.${config.extension}`
}

function waitForWebContentsLoad(webContents) {
  return new Promise((resolve, reject) => {
    webContents.once('did-finish-load', resolve)
    webContents.once('did-fail-load', (_event, _code, description) => reject(new Error(description)))
  })
}

async function createExportWindow(html) {
  const exportWindow = new BrowserWindow({
    show: false,
    width: 960,
    height: 1200,
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
    }
  })

  const loadPromise = waitForWebContentsLoad(exportWindow.webContents)
  await exportWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  await loadPromise

  return exportWindow
}

async function exportPdf(html, filePath) {
  const exportWindow = await createExportWindow(html)

  try {
    const data = await exportWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: {
        marginType: 'default'
      }
    })

    await fs.writeFile(filePath, data)
  } finally {
    exportWindow.destroy()
  }
}

async function exportPng(html, filePath) {
  const exportWindow = await createExportWindow(html)

  try {
    const dimensions = await exportWindow.webContents.executeJavaScript(`(() => {
      const body = document.body
      const documentElement = document.documentElement
      return {
        width: Math.ceil(Math.max(body.scrollWidth, documentElement.scrollWidth, 960)),
        height: Math.ceil(Math.max(body.scrollHeight, documentElement.scrollHeight, 600))
      }
    })()`)

    const width = Math.min(Math.max(dimensions.width, 960), 1600)
    const height = Math.min(Math.max(dimensions.height, 600), 12000)

    exportWindow.setSize(width, height)
    await new Promise((resolve) => setTimeout(resolve, 120))

    const image = await exportWindow.webContents.capturePage({ x: 0, y: 0, width, height })
    await fs.writeFile(filePath, image.toPNG())
  } finally {
    exportWindow.destroy()
  }
}

async function exportMarkdownDocument({ format, html, fileName }) {
  if (!html) throw new Error('没有可导出的内容')

  const filePath = await chooseExportPath(format, fileName)
  if (!filePath) return { canceled: true }

  if (format === 'html') {
    await fs.writeFile(filePath, html, 'utf8')
  } else if (format === 'pdf') {
    await exportPdf(html, filePath)
  } else if (format === 'png') {
    await exportPng(html, filePath)
  } else {
    throw new Error('不支持的导出格式')
  }

  return {
    canceled: false,
    filePath,
    fileName: path.basename(filePath)
  }
}

function getTimestamp() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')

  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours()
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}

function toMarkdownPath(filePath) {
  return filePath.split(path.sep).join('/')
}

function trimSlashes(value = '') {
  return String(value).replace(/^\/+|\/+$/g, '')
}

function joinUrl(baseUrl, ...parts) {
  const base = String(baseUrl || '').replace(/\/+$/g, '')
  const pathParts = parts.map(trimSlashes).filter(Boolean)

  return pathParts.length > 0 ? `${base}/${pathParts.join('/')}` : base
}

function joinKey(...parts) {
  return parts
    .map((part) => trimSlashes(String(part || '').replace(/\\/g, '/')))
    .filter(Boolean)
    .join('/')
}

function normalizeRemoteImagePath(imageSavePath = 'images') {
  const raw = String(imageSavePath || '').trim()
  if (path.win32.isAbsolute(raw) && !raw.startsWith('/')) {
    return path.win32.basename(path.win32.normalize(raw)) || 'images'
  }
  const value = raw.replace(/\\/g, '/')
  return value.replace(/^\/+|\/+$/g, '') || 'images'
}

function encodePathSegments(value) {
  return String(value)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function hasS3Config(settings) {
  return Boolean(
    settings?.s3?.endpoint &&
      settings?.s3?.bucket &&
      settings?.s3?.accessKeyId &&
      settings?.s3?.secretAccessKey
  )
}

async function resolveImageAssetUrl(markdownBasePath, source) {
  if (!source || /^(https?:|data:|mailto:|#)/i.test(source)) return source

  let resolved
  if (/^file:/i.test(source)) {
    resolved = fileURLToPath(source)
  } else if (path.isAbsolute(source)) {
    resolved = source
  } else {
    if (!markdownBasePath) return source
    const resolvedBasePath = path.resolve(markdownBasePath)
    const baseDir = isMarkdownFile(resolvedBasePath)
      ? path.dirname(resolvedBasePath)
      : resolvedBasePath
    resolved = path.resolve(baseDir, source)
  }

  return pathToFileURL(resolved).toString()
}

function createMarkdownImagePath(imageFilePath, baseDir, preferredRelativePath, imageName) {
  if (preferredRelativePath && !path.isAbsolute(preferredRelativePath)) {
    return toMarkdownPath(path.join(preferredRelativePath, imageName))
  }

  if (baseDir && isPathInside(baseDir, imageFilePath)) {
    return toMarkdownPath(path.relative(baseDir, imageFilePath))
  }

  return toMarkdownPath(imageFilePath)
}

async function chooseImagePath(
  markdownFilePath,
  defaultFolderPath,
  imageSavePath = 'images',
  imageName = `pasted-${getTimestamp()}.png`,
  dialogTitle = '保存图片'
) {
  const markdownDir = markdownFilePath ? path.dirname(path.resolve(markdownFilePath)) : null
  const baseDir = markdownDir || (defaultFolderPath ? path.resolve(defaultFolderPath) : null)
  const preferredPath = imageSavePath?.trim() || 'images'

  if (path.isAbsolute(preferredPath)) {
    const imageDir = path.resolve(preferredPath)
    await fs.mkdir(imageDir, { recursive: true })
    const filePath = path.join(imageDir, imageName)

    return {
      filePath,
      markdownPath: createMarkdownImagePath(filePath, baseDir, preferredPath, imageName)
    }
  }

  if (baseDir) {
    const imageDir = path.resolve(baseDir, preferredPath)
    await fs.mkdir(imageDir, { recursive: true })
    const filePath = path.join(imageDir, imageName)

    return {
      filePath,
      markdownPath: createMarkdownImagePath(filePath, baseDir, preferredPath, imageName)
    }
  }

  const result = await dialog.showSaveDialog(mainWindow, {
    title: dialogTitle,
    defaultPath: imageName,
    filters: [
      { name: 'Image', extensions: [path.extname(imageName).slice(1) || 'png'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || !result.filePath) return null

  const extension = path.extname(imageName) || '.png'
  const filePath = path.extname(result.filePath) ? result.filePath : `${result.filePath}${extension}`

  return {
    filePath,
    markdownPath: toMarkdownPath(filePath)
  }
}

function hmac(key, value, encoding) {
  return createHmac('sha256', key).update(value, 'utf8').digest(encoding)
}

function sha256(value, encoding = 'hex') {
  return createHash('sha256').update(value).digest(encoding)
}

function getAmzDate() {
  const now = new Date()
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, '')

  return {
    amzDate: iso,
    dateStamp: iso.slice(0, 8)
  }
}

function createS3Url(settings, key, query = '') {
  const s3 = settings.s3 || {}
  const endpoint = String(s3.endpoint || '').replace(/\/+$/g, '')
  const encodedKey = encodePathSegments(key)

  if (s3.forcePathStyle) {
    return `${endpoint}/${encodeURIComponent(s3.bucket)}/${encodedKey}${query}`
  }

  const endpointUrl = new URL(endpoint)
  return `${endpointUrl.protocol}//${s3.bucket}.${endpointUrl.host}/${encodedKey}${query}`
}

function signS3Request(settings, method, url, body = Buffer.alloc(0), extraHeaders = {}) {
  const s3 = settings.s3 || {}
  const region = s3.region || 'auto'
  const service = 's3'
  const parsedUrl = new URL(url)
  const { amzDate, dateStamp } = getAmzDate()
  const payloadHash = sha256(body)
  const headers = {
    host: parsedUrl.host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    ...extraHeaders
  }
  const signedHeaders = Object.keys(headers)
    .map((header) => header.toLowerCase())
    .sort()
    .join(';')
  const canonicalHeaders = Object.keys(headers)
    .map((header) => header.toLowerCase())
    .sort()
    .map((header) => `${header}:${headers[header]}`)
    .join('\n')
  const canonicalRequest = [
    method,
    parsedUrl.pathname,
    parsedUrl.search.slice(1),
    `${canonicalHeaders}\n`,
    signedHeaders,
    payloadHash
  ].join('\n')
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256(canonicalRequest)
  ].join('\n')
  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${s3.secretAccessKey}`, dateStamp), region), service),
    'aws4_request'
  )
  const signature = hmac(signingKey, stringToSign, 'hex')

  headers.Authorization = `AWS4-HMAC-SHA256 Credential=${s3.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return headers
}

async function s3Request(settings, method, url, body = Buffer.alloc(0), extraHeaders = {}) {
  const headers = signS3Request(settings, method, url, body, extraHeaders)
  const response = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : body
  })

  if (!response.ok) {
    throw new Error(`S3 ${method} 失败：HTTP ${response.status}`)
  }

  return response
}

async function uploadImageToS3(settings, imageBuffer, imageSavePath, imageName, contentType) {
  const s3 = settings.s3 || {}
  const remoteImagePath = normalizeRemoteImagePath(imageSavePath)
  const key = joinKey(s3.prefix || '', remoteImagePath, imageName)
  const url = createS3Url(settings, key)

  await s3Request(settings, 'PUT', url, imageBuffer, {
    'content-type': contentType
  })

  return {
    markdownPath: s3.publicBaseUrl ? joinUrl(s3.publicBaseUrl, encodePathSegments(key)) : url,
    cleanup: {
      type: 's3',
      key
    }
  }
}

async function uploadImageToRemote(settings, imageBuffer, imageSavePath, imageName, contentType) {
  if (settings?.syncProvider === 's3' && hasS3Config(settings)) {
    return uploadImageToS3(settings, imageBuffer, imageSavePath, imageName, contentType)
  }

  return null
}

function createImageFileName(fileName = 'image.png') {
  const parsed = path.parse(path.basename(String(fileName).replace(/[\\/]+/g, path.sep)))
  const name = (parsed.name || 'image').replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').trim() || 'image'
  return `${name}-${getTimestamp()}${parsed.ext || '.png'}`
}

function toImageBuffer(imageData) {
  if (imageData instanceof ArrayBuffer) return Buffer.from(imageData)
  if (ArrayBuffer.isView(imageData)) {
    return Buffer.from(imageData.buffer, imageData.byteOffset, imageData.byteLength)
  }
  return null
}

async function saveImageBuffer({
  imageBuffer,
  imageName,
  contentType = 'image/png',
  markdownFilePath = null,
  defaultFolderPath = null,
  imageSavePath = 'images',
  syncSettings = null,
  dialogTitle = '保存图片'
}) {
  const remoteImage = await uploadImageToRemote(
    syncSettings,
    imageBuffer,
    imageSavePath,
    imageName,
    contentType
  )

  if (remoteImage) {
    return {
      canceled: false,
      filePath: remoteImage.markdownPath,
      markdownPath: remoteImage.markdownPath,
      cleanup: remoteImage.cleanup
    }
  }

  const target = await chooseImagePath(
    markdownFilePath,
    defaultFolderPath,
    imageSavePath,
    imageName,
    dialogTitle
  )
  if (!target) return { canceled: true }

  await fs.writeFile(target.filePath, imageBuffer)

  return {
    canceled: false,
    filePath: target.filePath,
    markdownPath: target.markdownPath,
    cleanup: {
      type: 'local',
      filePath: target.filePath
    }
  }
}

async function saveClipboardImage({
  markdownFilePath = null,
  defaultFolderPath = null,
  imageSavePath = 'images',
  syncSettings = null
}) {
  const image = clipboard.readImage()
  if (image.isEmpty()) {
    return { canceled: true, reason: 'empty' }
  }

  const imageBuffer = image.toPNG()
  const imageName = `pasted-${getTimestamp()}.png`
  return saveImageBuffer({
    imageBuffer,
    imageName,
    markdownFilePath,
    defaultFolderPath,
    imageSavePath,
    syncSettings,
    dialogTitle: '保存剪贴板图片'
  })
}

async function saveImageFile({
  imageData,
  fileName,
  mimeType,
  markdownFilePath = null,
  defaultFolderPath = null,
  imageSavePath = 'images',
  syncSettings = null
}) {
  const imageBuffer = toImageBuffer(imageData)
  if (!imageBuffer?.length) return { canceled: true, reason: 'empty' }

  return saveImageBuffer({
    imageBuffer,
    imageName: createImageFileName(fileName),
    contentType: /^image\//i.test(mimeType || '') ? mimeType : 'application/octet-stream',
    markdownFilePath,
    defaultFolderPath,
    imageSavePath,
    syncSettings
  })
}

async function deleteInsertedImage(image, syncSettings) {
  if (!image?.type) return
  const imageSyncSettings = image.syncSettings || syncSettings

  if (image.type === 'local' && image.filePath) {
    await fs.rm(image.filePath, { force: true })
    return
  }

  if (image.type === 's3' && image.key) {
    if (!hasS3Config(imageSyncSettings)) throw new Error('缺少 S3 配置')
    await s3Request(imageSyncSettings, 'DELETE', createS3Url(imageSyncSettings, image.key))
  }
}

async function deleteInsertedImages({ images = [], syncSettings = null }) {
  const results = await Promise.allSettled(
    images.map((image) => deleteInsertedImage(image, syncSettings))
  )
  const failedCount = results.filter((result) => result.status === 'rejected').length

  return {
    deletedCount: images.length - failedCount,
    failedCount
  }
}

async function copyTextToClipboard(text) {
  clipboard.writeText(String(text || ''))
  return { ok: true }
}

async function copyImageToClipboard(source) {
  if (!source) throw new Error('没有可复制的图片地址')

  let image

  if (/^data:image\//i.test(source)) {
    image = nativeImage.createFromDataURL(source)
  } else if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source)
    if (!response.ok) throw new Error(`图片下载失败：HTTP ${response.status}`)
    image = nativeImage.createFromBuffer(Buffer.from(await response.arrayBuffer()))
  } else {
    const filePath = /^file:/i.test(source) ? fileURLToPath(source) : source
    image = nativeImage.createFromBuffer(await fs.readFile(filePath))
  }

  if (image.isEmpty()) throw new Error('图片内容为空，无法复制')

  clipboard.writeImage(image)
  return { ok: true }
}

async function testSyncConnection({ provider, settings }) {
  if (provider === 's3') {
    if (!hasS3Config(settings)) throw new Error('请先填写完整的 S3 连接信息')

    const prefix = settings.s3.prefix ? `&prefix=${encodeURIComponent(settings.s3.prefix)}` : ''
    const url = createS3Url(settings, '', `?list-type=2&max-keys=1${prefix}`)
    await s3Request(settings, 'GET', url)

    return { ok: true }
  }

  throw new Error('不支持的同步类型')
}

ipcMain.handle('document:get-initial-file', async () => {
  if (!initialFilePath) return null

  const filePath = initialFilePath
  initialFilePath = null
  return openMarkdownFile(filePath)
})

ipcMain.handle('document:open', (_event, filePath) => openMarkdownFile(filePath))
ipcMain.handle('document:open-folder', () => openMarkdownFolder())
ipcMain.handle('document:refresh-folder', (_event, folderPath) => refreshMarkdownFolder(folderPath))
ipcMain.handle('document:create-in-folder', (_event, options) => createMarkdownFileInFolder(options))
ipcMain.handle('document:create-folder-in-folder', (_event, options) => createFolderInFolder(options))
ipcMain.handle('document:rename-folder-item', (_event, options) => renameFolderItem(options))
ipcMain.handle('document:move-folder-item', (_event, options) => moveFolderItem(options))
ipcMain.handle('document:duplicate-folder-file', (_event, options) => duplicateMarkdownFile(options))
ipcMain.handle('document:delete-folder-item', (_event, options) => deleteFolderItem(options))
ipcMain.handle('document:show-folder-item', (_event, itemPath) => showFolderItem(itemPath))
ipcMain.handle('document:create', (_event, folderPath) => createMarkdownFile(folderPath))
ipcMain.handle('document:save', (_event, { filePath, content, defaultFolderPath }) =>
  saveMarkdownFile(filePath, content, defaultFolderPath)
)
ipcMain.handle('document:save-as', (_event, { content, defaultFolderPath }) =>
  saveMarkdownFileAs(content, defaultFolderPath)
)
ipcMain.handle('document:export', (_event, options) => exportMarkdownDocument(options))
ipcMain.handle('document:save-clipboard-image', (_event, options) => saveClipboardImage(options))
ipcMain.handle('document:save-image-file', (_event, options) => saveImageFile(options))
ipcMain.handle('document:delete-inserted-images', (_event, options) => deleteInsertedImages(options))
ipcMain.handle('clipboard:copy-text', (_event, text) => copyTextToClipboard(text))
ipcMain.handle('clipboard:copy-image', (_event, source) => copyImageToClipboard(source))
ipcMain.handle('sync:test-connection', (_event, options) => testSyncConnection(options))

ipcMain.handle('document:asset-url', (_event, { markdownFilePath, source, syncSettings }) =>
  resolveImageAssetUrl(markdownFilePath, source, syncSettings)
)

ipcMain.handle('dialog:choose-folder', async (_event, title = '选择文件夹') => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title,
    properties: ['openDirectory', 'createDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) return { canceled: true }

  return {
    canceled: false,
    folderPath: result.filePaths[0]
  }
})

ipcMain.handle('window:set-title', (_event, title) => {
  if (mainWindow) mainWindow.setTitle(title || 'MdPreview')
})

ipcMain.handle('window:set-document-edited', (_event, edited) => {
  if (mainWindow) mainWindow.setDocumentEdited(Boolean(edited))
})

ipcMain.handle('window:force-close', () => {
  if (!mainWindow) return
  isForceClosing = true
  mainWindow.setDocumentEdited(false)
  mainWindow.destroy()
})

function getServerSessionPath() {
  return path.join(app.getPath('userData'), 'server-session.bin')
}

ipcMain.handle('server:save-session', async (_event, session) => {
  if (!safeStorage.isEncryptionAvailable()) throw new Error('系统安全存储不可用')
  const encrypted = safeStorage.encryptString(JSON.stringify(session || {}))
  await fs.writeFile(getServerSessionPath(), encrypted)
  return { ok: true }
})

ipcMain.handle('server:load-session', async () => {
  if (!safeStorage.isEncryptionAvailable()) return null
  try {
    const encrypted = await fs.readFile(getServerSessionPath())
    return JSON.parse(safeStorage.decryptString(encrypted))
  } catch {
    return null
  }
})

ipcMain.handle('server:clear-session', async () => {
  await fs.rm(getServerSessionPath(), { force: true })
  return { ok: true }
})

const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv) => {
    queueSystemFileOpen(getFileFromArgv(argv))

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    initialFilePath = getFileFromArgv(process.argv)
    createWindow()

    app.on('open-file', (event, filePath) => {
      event.preventDefault()
      queueSystemFileOpen(filePath)
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
