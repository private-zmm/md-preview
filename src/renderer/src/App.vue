<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import '@highlightjs/cdn-assets/styles/github.min.css'
import TopBar from './components/TopBar.vue'
import VditorEditorPane from './components/VditorEditorPane.vue'
import StatusBar from './components/StatusBar.vue'
import StartupError from './components/StartupError.vue'
import FileSidebar from './components/FileSidebar.vue'
import UnsavedDialog from './components/UnsavedDialog.vue'
import SettingsPage from './components/SettingsPage.vue'
import { createInitialDocumentState, useDocumentState } from './composables/useDocumentState'
import { useMarkdownRenderer } from './composables/useMarkdownRenderer'
import { normalizeTheme } from './constants/themes'
import { sampleDocument } from './constants/sampleDocument'

const api = window.mdPreview
const hasDesktopApi = Boolean(api)
const defaultS3Settings = {
  endpoint: '',
  region: 'auto',
  bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  publicBaseUrl: '',
  prefix: 'MdPreview/',
  imagePath: 'images',
  forcePathStyle: false
}

const defaultWebDavSettings = {
  url: '',
  publicBaseUrl: '',
  username: '',
  password: '',
  remotePath: '/MdPreview'
}

const defaultSettings = {
  image: {
    imageProvider: 'local',
    imageSavePath: 'images',
    s3: { ...defaultS3Settings }
  },
  remote: {
    webdav: { ...defaultWebDavSettings },
    webdavImagePath: 'images'
  }
}
const state = createInitialDocumentState()
const statusText = ref('Ready')
const folderPath = ref('')
const folderName = ref('')
const folderFiles = ref([])
const isUnsavedDialogOpen = ref(false)
const isInputDialogOpen = ref(false)
const isSettingsOpen = ref(false)
const notification = ref(null)
const editorSessionKey = ref(0)
const editorPaneRef = ref(null)
const inputDialogInputRef = ref(null)
const inputDialog = ref({
  title: '',
  value: ''
})
const appSettings = ref(loadSettings())
const pendingInsertedImages = ref([])

const { isDirty, title, wordCount, setDocument, markSaved } = useDocumentState(state)
const { html, render } = hasDesktopApi ? useMarkdownRenderer(api) : { html: ref(''), render: async () => {} }

const hasSidebar = computed(() => Boolean(folderName.value || currentOutline.value.length > 0))
const workspaceClass = computed(() => `workspace ${hasSidebar.value ? 'has-sidebar' : ''}`)
const assetBasePath = computed(() => state.filePath || folderPath.value || null)
const currentOutline = computed(() => {
  let headingIndex = 0

  return state.content
    .split(/\r?\n/)
    .map((line, index) => {
      const match = /^(#{1,6})\s+(.+)$/.exec(line.trim())
      if (!match) return null

      const item = {
        id: `${index}-${match[1].length}`,
        level: match[1].length,
        lineIndex: index,
        headingIndex,
        title: match[2].replace(/[`*_~]/g, '').trim()
      }
      headingIndex += 1

      return item
    })
    .filter(Boolean)
})
let removeOpenListener = null
let removeCloseListener = null
let unsavedDialogResolver = null
let inputDialogResolver = null
let notificationTimer = null

function loadSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem('mdpreview-settings') || '{}')
    return normalizeSettings(savedSettings)
  } catch {
    return JSON.parse(JSON.stringify(defaultSettings))
  }
}

function normalizeS3Settings(settings = {}) {
  return {
    ...defaultS3Settings,
    ...settings,
    imagePath: settings.imagePath || settings.imageSavePath || defaultS3Settings.imagePath
  }
}

function normalizeWebDavSettings(settings = {}) {
  return {
    ...defaultWebDavSettings,
    ...settings
  }
}

function normalizeSettings(settings = {}) {
  const hasCurrentShape = settings.image || settings.remote?.webdavImagePath
  const hasPreviousShape = settings.local || settings.remote
  const legacyImagePath = settings.imageSavePath || defaultSettings.image.imageSavePath
  const legacyS3 = normalizeS3Settings(settings.s3 || {})
  const legacyWebDav = normalizeWebDavSettings(settings.webdav || {})

  if (!hasCurrentShape && !hasPreviousShape) {
    return {
      image: {
        imageProvider: 'local',
        imageSavePath: legacyImagePath,
        s3: {
          ...legacyS3,
          imagePath: legacyImagePath
        }
      },
      remote: {
        webdav: legacyWebDav,
        webdavImagePath: legacyImagePath
      }
    }
  }

  const previousLocal = settings.local || {}
  const previousRemote = settings.remote || {}

  return {
    image: {
      ...defaultSettings.image,
      ...(settings.image || previousLocal),
      s3: normalizeS3Settings(settings.image?.s3 || previousLocal.s3 || {})
    },
    remote: {
      ...defaultSettings.remote,
      ...previousRemote,
      webdav: normalizeWebDavSettings(previousRemote.webdav || {}),
      webdavImagePath:
        previousRemote.webdavImagePath ||
        previousLocal.imageSavePath ||
        settings.imageSavePath ||
        defaultSettings.remote.webdavImagePath
    }
  }
}

function setStatus(message) {
  statusText.value = message
}

function toSerializable(value) {
  if (!value) return null
  return JSON.parse(JSON.stringify(value))
}

function showNotification(message, type = 'success') {
  notification.value = {
    id: Date.now(),
    message,
    type
  }

  window.clearTimeout(notificationTimer)
  notificationTimer = window.setTimeout(() => {
    notification.value = null
  }, 2600)
}

function closeNotification() {
  notification.value = null
  window.clearTimeout(notificationTimer)
}

function handleSettingsStatus(message) {
  const isError = /失败|错误|需要重启/.test(message)
  setStatus(message)
  showNotification(message, isError ? 'error' : 'success')
}

function persistSettings(settings) {
  appSettings.value = normalizeSettings(settings)
  localStorage.setItem('mdpreview-settings', JSON.stringify(appSettings.value))
}

function saveSettings(settings) {
  persistSettings(settings)
  setStatus('设置已保存')
  showNotification('设置已保存', 'success')
}

function saveImageSettings(settings) {
  persistSettings({
    ...appSettings.value,
    image: settings
  })
  setStatus('图像设置已保存')
  showNotification('图像设置已保存', 'success')
}

function saveRemoteSettings(settings) {
  persistSettings({
    ...appSettings.value,
    remote: settings
  })
  setStatus('远程设置已保存')
  showNotification('远程设置已保存', 'success')
}

function createS3SyncSettings(s3) {
  return {
    syncProvider: 's3',
    s3: normalizeS3Settings(s3)
  }
}

function createWebDavSyncSettings(webdav) {
  return {
    syncProvider: 'webdav',
    webdav: normalizeWebDavSettings(webdav)
  }
}

function getRemoteSyncSettings() {
  return createWebDavSyncSettings(appSettings.value.remote.webdav)
}

const activeImageConfig = computed(() => {
  const isRemoteDocument =
    state.filePath?.startsWith('webdav://') || folderPath.value?.startsWith('webdav://')

  if (isRemoteDocument) {
    const remote = appSettings.value.remote

    return {
      imageSavePath: remote.webdavImagePath || 'images',
      syncSettings: createWebDavSyncSettings(remote.webdav)
    }
  }

  const image = appSettings.value.image

  if (image.imageProvider === 's3') {
    return {
      imageSavePath: image.s3.imagePath || 'images',
      syncSettings: createS3SyncSettings(image.s3)
    }
  }

  return {
    imageSavePath: image.imageSavePath || 'images',
    syncSettings: null
  }
})

function loadDocument(documentState) {
  setDocument(documentState)
  editorSessionKey.value += 1
}

function setTheme(theme) {
  state.theme = normalizeTheme(theme)
  document.documentElement.dataset.theme = state.theme
  localStorage.setItem('mdpreview-theme', state.theme)
}

function runEditorCommand(command) {
  editorPaneRef.value?.runCommand(command)
}

function handleOutlineSelect(item) {
  editorPaneRef.value?.scrollToOutline(item)
}

function registerPendingImage(image) {
  if (!image?.type) return
  pendingInsertedImages.value = [...pendingInsertedImages.value, toSerializable(image)]
}

function confirmPendingImages() {
  pendingInsertedImages.value = []
}

async function cleanupPendingImages() {
  if (pendingInsertedImages.value.length === 0) return

  const images = pendingInsertedImages.value
  pendingInsertedImages.value = []

  try {
    if (typeof api.deleteInsertedImages !== 'function') {
      setStatus('清理未保存图片功能需要重启应用后生效')
      return
    }

    const result = await api.deleteInsertedImages({
      images: toSerializable(images),
      syncSettings: toSerializable(activeImageConfig.value.syncSettings)
    })

    if (result?.failedCount > 0) {
      const message = `已清理 ${result.deletedCount} 张未保存图片，${result.failedCount} 张清理失败`
      setStatus(message)
      showNotification(message, 'error')
    } else if (result?.deletedCount > 0) {
      setStatus(`已清理 ${result.deletedCount} 张未保存图片`)
    }
  } catch (error) {
    setStatus(`清理未保存图片失败：${error.message}`)
    showNotification(`清理未保存图片失败：${error.message}`, 'error')
  }
}

function escapeHtmlText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function createExportHtml() {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtmlText(state.fileName)}</title>
  <style>
    body {
      margin: 0;
      background: #ffffff;
      color: #2f2a25;
      font-family: Georgia, "Times New Roman", "Songti SC", "SimSun", serif;
    }
    .markdown-body {
      box-sizing: border-box;
      width: min(100%, 820px);
      margin: 0 auto;
      padding: 48px 56px 72px;
      font-size: 17px;
      line-height: 1.82;
      overflow-wrap: anywhere;
    }
    h1, h2, h3, h4 { color: #211f1c; font-weight: 600; line-height: 1.35; }
    h1 { margin: 0 0 26px; padding-bottom: 12px; border-bottom: 1px solid #e7e2da; font-size: 30px; }
    h2 { margin: 36px 0 14px; font-size: 23px; }
    h3 { margin: 30px 0 10px; font-size: 19px; }
    h4 { margin: 24px 0 8px; font-size: 16px; }
    p, ul, ol, blockquote, table, pre { margin-top: 0; margin-bottom: 18px; }
    a { color: #28708d; text-decoration: none; }
    blockquote { padding: 2px 0 2px 17px; border-left: 4px solid #d7cdc1; color: #686058; }
    code { padding: 2px 5px; border-radius: 5px; background: #ece7df; color: #7a3e2f; font-family: Consolas, monospace; font-size: 0.9em; }
    pre { overflow: auto; padding: 16px 18px; border-radius: 7px; background: #f0ece5; }
    pre code { padding: 0; background: transparent; color: inherit; }
    table { width: 100%; border-collapse: collapse; font-size: 15px; }
    th, td { padding: 9px 11px; border: 1px solid #ded6ca; }
    th { background: #f0ebe3; font-weight: 600; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    hr { height: 1px; margin: 28px 0; border: 0; background: #e7e2da; }
    .task-list-item { list-style: none; }
  </style>
</head>
<body>
  <article class="markdown-body">${html.value}</article>
</body>
</html>`
}

async function exportDocument(format) {
  try {
    if (typeof api.exportMarkdownDocument !== 'function') {
      setStatus('导出功能需要重启应用后生效')
      return
    }

    const result = await api.exportMarkdownDocument({
      format,
      fileName: state.fileName,
      html: createExportHtml()
    })

    if (result?.canceled) return
    setStatus(`已导出 ${result.fileName}`)
  } catch (error) {
    setStatus(`导出失败：${error.message}`)
  }
}

function requestUnsavedDecision() {
  isUnsavedDialogOpen.value = true

  return new Promise((resolve) => {
    unsavedDialogResolver = resolve
  })
}

function resolveUnsavedDecision(decision) {
  isUnsavedDialogOpen.value = false
  unsavedDialogResolver?.(decision)
  unsavedDialogResolver = null
}

async function maybeContinueWithUnsavedChanges() {
  if (!isDirty.value) {
    await cleanupPendingImages()
    return true
  }

  const decision = await requestUnsavedDecision()

  if (decision === 'cancel') return false
  if (decision === 'discard') {
    await cleanupPendingImages()
    return true
  }
  if (decision === 'save') return saveFile()

  return false
}

async function openFile(filePath) {
  if (!(await maybeContinueWithUnsavedChanges())) return

  try {
    const result = filePath?.startsWith('webdav://')
      ? await api.openRemoteMarkdownFile(filePath, toSerializable(getRemoteSyncSettings()))
      : await api.openMarkdownFile(filePath)
    if (result?.canceled) return

    loadDocument(result)
    setStatus(`已打开 ${result.fileName}`)
  } catch (error) {
    setStatus(`打开失败：${error.message}`)
  }
}

function sortFolderFiles(files) {
  return [...files].sort((left, right) => left.relativePath.localeCompare(right.relativePath))
}

function countMarkdownFiles(files) {
  return files.filter((file) => file.type !== 'directory').length
}

function createSummary(content) {
  return content
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[`*_~>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50)
}

function upsertFolderFile(file) {
  if (!file || !folderPath.value) return

  const nextFiles = folderFiles.value.filter((item) => item.filePath !== file.filePath)
  nextFiles.push(file)
  folderFiles.value = sortFolderFiles(nextFiles)
}

function updateActiveFolderFileSummary() {
  if (!state.filePath || countMarkdownFiles(folderFiles.value) === 0) return

  folderFiles.value = folderFiles.value.map((file) =>
    file.type !== 'directory' && file.filePath === state.filePath ? { ...file, summary: createSummary(state.content) } : file
  )
}

function isSameOrChildPath(parentPath, childPath) {
  if (!parentPath || !childPath) return false
  const normalizedParent = parentPath.replace(/\\/g, '/').replace(/\/$/, '')
  const normalizedChild = childPath.replace(/\\/g, '/')
  return normalizedChild === normalizedParent || normalizedChild.startsWith(`${normalizedParent}/`)
}

function getFolderActionDir(file) {
  if (!file?.filePath) return folderPath.value
  if (file.type === 'directory') return file.filePath
  if (file.filePath.startsWith('webdav://')) {
    const index = file.filePath.lastIndexOf('/')
    return index > 'webdav://'.length - 1 ? file.filePath.slice(0, index) : folderPath.value
  }

  return file.filePath.split(/[\\/]/).slice(0, -1).join('\\') || folderPath.value
}

function requestInputName(title, defaultValue = '') {
  inputDialog.value = {
    title,
    value: defaultValue
  }
  isInputDialogOpen.value = true

  nextTick(() => {
    inputDialogInputRef.value?.focus()
    inputDialogInputRef.value?.select()
  })

  return new Promise((resolve) => {
    inputDialogResolver = resolve
  })
}

function resolveInputDialog(value) {
  isInputDialogOpen.value = false
  const nextValue = typeof value === 'string' ? value.trim() : null
  inputDialogResolver?.(nextValue || null)
  inputDialogResolver = null
}

function applyFolderResult(folder) {
  if (!folder) return
  folderName.value = folder.folderName
  folderPath.value = folder.folderPath
  folderFiles.value = folder.files || []
}

async function refreshFolder() {
  if (!folderPath.value || typeof api.refreshMarkdownFolder !== 'function') return
  const result = folderPath.value.startsWith('webdav://')
    ? await api.refreshRemoteMarkdownFolder(toSerializable(getRemoteSyncSettings()), folderPath.value)
    : await api.refreshMarkdownFolder(folderPath.value)
  if (!result?.canceled) applyFolderResult(result)
}

async function handleFolderAction({ action, file }) {
  if (!folderPath.value) return

  try {
    const isRemoteFolder = folderPath.value.startsWith('webdav://')
    const remoteSettings = toSerializable(getRemoteSyncSettings())

    if (action === 'new-file') {
      const fileName = await requestInputName('新建 Markdown 文件', 'Untitled.md')
      if (!fileName) return

      const result = isRemoteFolder
        ? await api.createRemoteMarkdownFileInFolder({
            settings: remoteSettings,
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            fileName
          })
        : await api.createMarkdownFileInFolder({
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            fileName
          })
      applyFolderResult(result.folder)
      await openFile(result.file.filePath)
      return
    }

    if (action === 'new-folder') {
      const newFolderName = await requestInputName('新建文件夹', 'New Folder')
      if (!newFolderName) return

      const result = isRemoteFolder
        ? await api.createRemoteFolderInFolder({
            settings: remoteSettings,
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            folderName: newFolderName
          })
        : await api.createFolderInFolder({
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            folderName: newFolderName
          })
      applyFolderResult(result)
      setStatus(`已新建文件夹 ${newFolderName}`)
      return
    }

    if (!file?.filePath) return

    if (action === 'rename') {
      const nextName = await requestInputName('重命名', file.fileName)
      if (!nextName || nextName === file.fileName) return

      const result = isRemoteFolder
        ? await api.renameRemoteFolderItem({
            settings: remoteSettings,
            folderPath: folderPath.value,
            itemPath: file.filePath,
            newName: nextName
          })
        : await api.renameFolderItem({
            folderPath: folderPath.value,
            itemPath: file.filePath,
            newName: nextName
          })
      applyFolderResult(result.folder)
      if (state.filePath === result.oldPath && result.file) {
        loadDocument(result.file)
        setStatus(`已重命名为 ${result.file.fileName}`)
      } else if (file.type === 'directory' && isSameOrChildPath(result.oldPath, state.filePath)) {
        loadDocument({
          filePath: null,
          fileName: 'Untitled.md',
          content: ''
        })
        setStatus(`已重命名为 ${newName}`)
      }
      return
    }

    if (action === 'duplicate') {
      const result = isRemoteFolder
        ? await api.duplicateRemoteFolderFile({
            settings: remoteSettings,
            folderPath: folderPath.value,
            filePath: file.filePath
          })
        : await api.duplicateFolderFile({
            folderPath: folderPath.value,
            filePath: file.filePath
          })
      applyFolderResult(result.folder)
      setStatus(`已创建副本 ${result.file.fileName}`)
      return
    }

    if (action === 'delete') {
      if (!window.confirm(`确定删除 ${file.fileName}？`)) return

      const result = isRemoteFolder
        ? await api.deleteRemoteFolderItem({
            settings: remoteSettings,
            folderPath: folderPath.value,
            itemPath: file.filePath
          })
        : await api.deleteFolderItem({
            folderPath: folderPath.value,
            itemPath: file.filePath
          })
      applyFolderResult(result.folder)
      if (state.filePath === result.deletedPath || isSameOrChildPath(result.deletedPath, state.filePath)) {
        loadDocument({
          filePath: null,
          fileName: 'Untitled.md',
          content: ''
        })
      }
      setStatus(`已删除 ${file.fileName}`)
      return
    }

    if (action === 'show-location') {
      if (isRemoteFolder) await api.showRemoteFolderItem(remoteSettings, file.filePath)
      else await api.showFolderItem(file.filePath)
    }
  } catch (error) {
    setStatus(`文件操作失败：${error.message}`)
    showNotification(`文件操作失败：${error.message}`, 'error')
  }
}

async function createFile() {
  if (!(await maybeContinueWithUnsavedChanges())) return

  loadDocument({
    filePath: null,
    fileName: 'Untitled.md',
    content: ''
  })
  setStatus('已新建未保存文档')
}

async function openFolder() {
  try {
    const result = await api.openMarkdownFolder()
    if (result?.canceled) return

    folderName.value = result.folderName
    folderPath.value = result.folderPath
    folderFiles.value = result.files || []
    setStatus(`已打开文件夹 ${result.folderName}，找到 ${countMarkdownFiles(folderFiles.value)} 个 Markdown 文件`)
  } catch (error) {
    setStatus(`打开文件夹失败：${error.message}`)
  }
}

async function openRemoteFolder() {
  if (!(await maybeContinueWithUnsavedChanges())) return

  try {
    if (typeof api.openRemoteMarkdownFolder !== 'function') {
      setStatus('打开远程文件夹功能需要重启应用后生效')
      return
    }

    const result = await api.openRemoteMarkdownFolder(toSerializable(getRemoteSyncSettings()))
    if (result?.canceled) return

    folderName.value = result.folderName
    folderPath.value = result.folderPath
    folderFiles.value = result.files || []
    setStatus(`已打开远程文件夹 ${result.folderName}，找到 ${countMarkdownFiles(folderFiles.value)} 个 Markdown 文件`)
  } catch (error) {
    setStatus(`打开远程文件夹失败：${error.message}`)
    showNotification(`打开远程文件夹失败：${error.message}`, 'error')
  }
}

async function saveFile() {
  try {
    const contentToSave = editorPaneRef.value?.getValue?.() ?? state.content
    state.content = contentToSave
    const result = state.filePath?.startsWith('webdav://')
      ? await api.saveRemoteMarkdownFile(
          toSerializable(getRemoteSyncSettings()),
          state.filePath,
          contentToSave
        )
      : await api.saveMarkdownFile(state.filePath, contentToSave, folderPath.value || null)
    if (result?.canceled) return false

    markSaved(result, contentToSave)
    confirmPendingImages()
    upsertFolderFile(result.file)
    updateActiveFolderFileSummary()
    setStatus(`已保存 ${result.fileName}`)
    showNotification(`已保存 ${result.fileName}`, 'success')
    return true
  } catch (error) {
    setStatus(`保存失败：${error.message}`)
    showNotification(`保存失败：${error.message}`, 'error')
    return false
  }
}

async function saveFileAs() {
  try {
    const contentToSave = editorPaneRef.value?.getValue?.() ?? state.content
    state.content = contentToSave
    const result = await api.saveMarkdownFileAs(contentToSave, folderPath.value || null)
    if (result?.canceled) return false

    markSaved(result, contentToSave)
    confirmPendingImages()
    upsertFolderFile(result.file)
    updateActiveFolderFileSummary()
    setStatus(`已另存为 ${result.fileName}`)
    showNotification(`已另存为 ${result.fileName}`, 'success')
    return true
  } catch (error) {
    setStatus(`另存为失败：${error.message}`)
    showNotification(`另存为失败：${error.message}`, 'error')
    return false
  }
}

function handleKeyboard(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    if (event.shiftKey) saveFileAs()
    else saveFile()
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') {
    event.preventDefault()
    createFile()
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'o') {
    event.preventDefault()
    if (event.shiftKey) openFolder()
    else openFile()
  }
}

onMounted(async () => {
  if (!hasDesktopApi) return

  setTheme(state.theme)
  loadDocument({
    filePath: null,
    fileName: 'Untitled.md',
    content: sampleDocument
  })

  await render(state.content, assetBasePath.value, toSerializable(activeImageConfig.value.syncSettings))

  window.addEventListener('keydown', handleKeyboard)

  removeOpenListener = api.onOpenFromSystem((filePath) => openFile(filePath))
  removeCloseListener = api.onRequestClose(async () => {
    if (await maybeContinueWithUnsavedChanges()) {
      api.forceClose()
    }
  })

  try {
    const initialFile = await api.getInitialFile()

    if (initialFile && !initialFile.canceled) {
      loadDocument(initialFile)
      setStatus(`已打开 ${initialFile.fileName}`)
    }
  } catch (error) {
    setStatus(`启动载入失败：${error.message}`)
  }
})

onUnmounted(() => {
  removeOpenListener?.()
  removeCloseListener?.()
  window.clearTimeout(notificationTimer)
  window.removeEventListener('keydown', handleKeyboard)
})

watch(
  () => [state.content, assetBasePath.value, JSON.stringify(activeImageConfig.value.syncSettings)],
  () => render(state.content, assetBasePath.value, toSerializable(activeImageConfig.value.syncSettings)),
  { flush: 'post' }
)

watch(title, (nextTitle) => api?.setWindowTitle(nextTitle), { immediate: true })
watch(isDirty, (dirty) => api?.setDocumentEdited(dirty), { immediate: true })
</script>

<template>
  <StartupError v-if="!hasDesktopApi" />

  <main v-else class="shell">
    <TopBar
      :is-dirty="isDirty"
      :theme="state.theme"
      @create="createFile"
      @open="openFile"
      @open-folder="openFolder"
      @open-remote-folder="openRemoteFolder"
      @save="saveFile"
      @save-as="saveFileAs"
      @export="exportDocument"
      @settings="isSettingsOpen = true"
      @paragraph-command="runEditorCommand"
      @format-command="runEditorCommand"
      @update:theme="setTheme"
    />

    <SettingsPage
      v-if="isSettingsOpen"
      :settings="appSettings"
      @close="isSettingsOpen = false"
      @status="handleSettingsStatus"
      @save="saveSettings"
      @save-image="saveImageSettings"
      @save-remote="saveRemoteSettings"
    />

    <section v-else :class="workspaceClass">
      <FileSidebar
        v-if="hasSidebar"
        :folder-name="folderName"
        :folder-path="folderPath"
        :files="folderFiles"
        :outline="currentOutline"
        :active-file-path="state.filePath"
        :show-files="Boolean(folderName)"
        @create-file="createFile"
        @open-file="openFile"
        @folder-action="handleFolderAction"
        @select-outline="handleOutlineSelect"
      />
      <VditorEditorPane
        ref="editorPaneRef"
        v-model="state.content"
        :history-key="editorSessionKey"
        :file-path="state.filePath"
        :default-folder-path="folderPath"
        :image-save-path="activeImageConfig.imageSavePath"
        :sync-settings="activeImageConfig.syncSettings"
        :theme="state.theme"
        @status="setStatus"
        @image-inserted="registerPendingImage"
      />
    </section>

    <StatusBar :status="statusText" :stats="wordCount" />

    <div
      v-if="notification"
      :key="notification.id"
      class="toast-notification"
      :class="`toast-${notification.type}`"
      role="status"
    >
      <span class="toast-accent"></span>
      <span class="toast-icon" aria-hidden="true">
        {{ notification.type === 'error' ? '!' : '✓' }}
      </span>
      <span class="toast-message">{{ notification.message }}</span>
      <button class="toast-close" type="button" aria-label="关闭通知" @click="closeNotification">
        ×
      </button>
      <span class="toast-progress"></span>
    </div>

    <UnsavedDialog
      :open="isUnsavedDialogOpen"
      @save="resolveUnsavedDecision('save')"
      @discard="resolveUnsavedDecision('discard')"
      @cancel="resolveUnsavedDecision('cancel')"
    />

    <div
      v-if="isInputDialogOpen"
      class="dialog-backdrop"
      role="presentation"
      @click.self="resolveInputDialog(null)"
    >
      <form
        class="input-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inputDialogTitle"
        @submit.prevent="resolveInputDialog(inputDialog.value)"
      >
        <h2 id="inputDialogTitle">{{ inputDialog.title }}</h2>
        <input
          ref="inputDialogInputRef"
          v-model="inputDialog.value"
          class="input-dialog-field"
          type="text"
          autocomplete="off"
          @keydown.esc.prevent="resolveInputDialog(null)"
        />
        <div class="input-dialog-actions">
          <button class="dialog-button" type="button" @click="resolveInputDialog(null)">取消</button>
          <button class="dialog-button primary" type="submit">确定</button>
        </div>
      </form>
    </div>
  </main>
</template>
