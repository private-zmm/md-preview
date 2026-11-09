import { createRemoteApi } from './remoteApi'

const markdownExtensions = new Set(['.md', '.markdown', '.mdown', '.mkd'])

let nextId = 1
let activeFolder = null
const fileRecords = new Map()
const objectUrls = new Map()

function isMarkdownFile(name) {
  const dot = String(name || '').lastIndexOf('.')
  return dot >= 0 && markdownExtensions.has(String(name).slice(dot).toLowerCase())
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${nextId++}`
}

function makeFilePath(folderId, relativePath) {
  return `web://${folderId}/${relativePath.split('\\').join('/')}`
}

function fileNameFromPath(filePath) {
  return String(filePath || '').split('/').pop() || 'Untitled.md'
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName || 'Untitled.md'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function downloadText(content, fileName, type = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([content], { type }), fileName)
}

function pickFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.mdown,.mkd,text/markdown,text/plain'
    input.onchange = () => resolve(input.files?.[0] || null)
    input.click()
  })
}

function pickFolderFiles() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.webkitdirectory = true
    input.onchange = () => resolve([...input.files])
    input.click()
  })
}

function makeFileEntry(filePath, file, rootPath = '') {
  return file.text().then((content) => ({
    type: 'file',
    filePath,
    fileName: file.name,
    baseName: file.name.replace(/\.[^.]+$/, ''),
    extension: file.name.slice(file.name.lastIndexOf('.')),
    summary: content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/!\[[^\]]*]\([^)]+\)/g, '')
      .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
      .replace(/[`*_~>#-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 50),
    relativePath: rootPath || file.name
  }))
}

async function openMarkdownFile(filePath) {
  let record = fileRecords.get(filePath)
  if (!record) {
    const file = await pickFile()
    if (!file) return { canceled: true }
    const folderId = makeId('file')
    filePath = makeFilePath(folderId, file.name)
    record = { file, folderId, relativePath: file.name }
    fileRecords.set(filePath, record)
  }

  return {
    canceled: false,
    filePath,
    fileName: record.file.name,
    content: await record.file.text()
  }
}

async function readDirectoryHandle(handle, folderId, relativePath = '', entries = []) {
  for await (const [name, entry] of handle.entries()) {
    const nextRelativePath = relativePath ? `${relativePath}/${name}` : name
    const nextPath = makeFilePath(folderId, nextRelativePath)
    if (entry.kind === 'directory') {
      entries.push({
        type: 'directory',
        filePath: nextPath,
        fileName: name,
        relativePath: nextRelativePath
      })
      await readDirectoryHandle(entry, folderId, nextRelativePath, entries)
      continue
    }

    const file = await entry.getFile()
    fileRecords.set(nextPath, { file, fileHandle: entry, folderId, relativePath: nextRelativePath })
    if (!isMarkdownFile(name)) continue
    entries.push(await makeFileEntry(nextPath, file, nextRelativePath))
  }
  return entries
}

async function openMarkdownFolder() {
  const folderId = makeId('folder')
  let entries = []

  if (window.showDirectoryPicker) {
    let handle
    try {
      handle = await window.showDirectoryPicker({ mode: 'readwrite' })
    } catch (error) {
      if (error?.name === 'AbortError') return { canceled: true }
      throw error
    }
    activeFolder = { id: folderId, handle, name: handle.name }
    entries = await readDirectoryHandle(handle, folderId)
  } else {
    const files = await pickFolderFiles()
    if (files.length === 0) return { canceled: true }
    const folderName = files[0].webkitRelativePath?.split('/')[0] || 'Markdown folder'
    activeFolder = { id: folderId, name: folderName }
    for (const file of files) {
      const relativePath = file.webkitRelativePath || file.name
      const pathWithoutRoot = relativePath.split('/').slice(1).join('/') || file.name
      const nextPath = makeFilePath(folderId, pathWithoutRoot)
      fileRecords.set(nextPath, { file, folderId, relativePath: pathWithoutRoot })
      if (!isMarkdownFile(file.name)) continue
      entries.push(await makeFileEntry(nextPath, file, pathWithoutRoot))
    }
  }

  entries.sort((left, right) => left.relativePath.localeCompare(right.relativePath))
  return {
    canceled: false,
    folderPath: `web-folder://${folderId}`,
    folderName: activeFolder.name,
    files: entries
  }
}

async function saveMarkdownFile(filePath, content, defaultFolderPath = null) {
  const record = fileRecords.get(filePath)
  const fileName = fileNameFromPath(filePath) || 'Untitled.md'

  if (record?.fileHandle?.createWritable) {
    const writable = await record.fileHandle.createWritable()
    await writable.write(content)
    await writable.close()
    record.file = new File([content], record.file.name, { type: 'text/markdown' })
  } else {
    downloadText(content, fileName, 'text/markdown;charset=utf-8')
    if (record) record.file = new File([content], record.file.name, { type: 'text/markdown' })
  }

  return { canceled: false, filePath, fileName, file: null }
}

async function saveMarkdownFileAs(content) {
  const fileName = window.prompt('保存文件名', 'Untitled.md')
  if (!fileName) return { canceled: true }
  const normalizedName = /\.(md|markdown|mdown|mkd)$/i.test(fileName) ? fileName : `${fileName}.md`
  const folderId = makeId('saved')
  const filePath = makeFilePath(folderId, normalizedName)
  downloadText(content, normalizedName, 'text/markdown;charset=utf-8')
  fileRecords.set(filePath, { file: new File([content], normalizedName, { type: 'text/markdown' }) })
  return { canceled: false, filePath, fileName: normalizedName, file: null }
}

async function createMarkdownFile() {
  return saveMarkdownFileAs('')
}

async function saveImageFile({ imageData, fileName = 'image.png', mimeType = 'image/png' }) {
  if (!imageData) return { canceled: true, reason: 'empty' }
  const blob = new Blob([imageData], { type: mimeType })
  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
  return { canceled: false, markdownPath: dataUrl, cleanup: null, fileName }
}

async function saveClipboardImage() {
  if (!navigator.clipboard?.read) return { canceled: true, reason: 'empty' }
  const items = await navigator.clipboard.read()
  for (const item of items) {
    const type = item.types.find((value) => value.startsWith('image/'))
    if (type) return saveImageFile({ imageData: await (await item.getType(type)).arrayBuffer(), mimeType: type })
  }
  return { canceled: true, reason: 'empty' }
}

async function resolveAssetUrl(markdownFilePath, source) {
  if (!source || /^(?:[a-z]+:|\/\/)/i.test(source)) return source
  const record = fileRecords.get(markdownFilePath)
  if (!record?.folderId) return source
  const base = record.relativePath.split('/').slice(0, -1)
  const relative = [...base, ...source.split('/')].join('/').replace(/\/+/g, '/')
  const targetPath = makeFilePath(record.folderId, relative)
  const target = fileRecords.get(targetPath)
  if (!target?.file) return source
  if (!objectUrls.has(targetPath)) objectUrls.set(targetPath, URL.createObjectURL(target.file))
  return objectUrls.get(targetPath)
}

async function exportMarkdownDocument({ format, fileName, html }) {
  const baseName = String(fileName || 'Untitled').replace(/\.[^.]+$/, '')
  if (format !== 'html') throw new Error('浏览器版目前只支持导出 HTML')
  downloadText(html, `${baseName}.html`, 'text/html;charset=utf-8')
  return { canceled: false, fileName: `${baseName}.html` }
}

function createWebApi() {
  return {
    getInitialFile: async () => ({ canceled: true }),
    createMarkdownFile,
    openMarkdownFile,
    openMarkdownFolder,
    saveMarkdownFile,
    saveMarkdownFileAs,
    saveImageFile,
    saveClipboardImage,
    deleteInsertedImages: async () => ({ ok: true }),
    resolveAssetUrl,
    exportMarkdownDocument,
    copyTextToClipboard: async (text) => navigator.clipboard?.writeText(String(text)),
    copyImageToClipboard: async (source) => {
      if (!navigator.clipboard?.write || !window.ClipboardItem) throw new Error('浏览器不支持复制图片')
      const response = await fetch(source)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    },
    chooseFolder: async () => ({ canceled: true }),
    setWindowTitle: (title) => { document.title = title },
    setDocumentEdited: () => {},
    forceClose: () => {},
    onOpenFromSystem: () => () => {},
    onRequestClose: () => () => {},
    refreshMarkdownFolder: async () => ({ canceled: true }),
    openRemoteMarkdownFile: async () => { throw new Error('浏览器版暂不支持 WebDAV') },
    openRemoteMarkdownFolder: async () => { throw new Error('浏览器版暂不支持 WebDAV') },
    testSyncConnection: async () => { throw new Error('浏览器版暂不支持远程连接测试') }
  }
}

export function installWebApi() {
  const localApi = window.mdPreview || createWebApi()
  if (!window.mdPreview) window.mdPreview = localApi
  const api = createRemoteApi(localApi)
  window.mdPreviewBridge = api
  return { api, isDesktop: Boolean(window.mdPreview) }
}
