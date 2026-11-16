import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('mdPreview', {
  getInitialFile: () => ipcRenderer.invoke('document:get-initial-file'),
  createMarkdownFile: (folderPath) => ipcRenderer.invoke('document:create', folderPath),
  openMarkdownFile: (filePath) => ipcRenderer.invoke('document:open', filePath),
  openMarkdownFolder: () => ipcRenderer.invoke('document:open-folder'),
  refreshMarkdownFolder: (folderPath) => ipcRenderer.invoke('document:refresh-folder', folderPath),
  createMarkdownFileInFolder: (options) => ipcRenderer.invoke('document:create-in-folder', options),
  createFolderInFolder: (options) => ipcRenderer.invoke('document:create-folder-in-folder', options),
  renameFolderItem: (options) => ipcRenderer.invoke('document:rename-folder-item', options),
  duplicateFolderFile: (options) => ipcRenderer.invoke('document:duplicate-folder-file', options),
  deleteFolderItem: (options) => ipcRenderer.invoke('document:delete-folder-item', options),
  showFolderItem: (itemPath) => ipcRenderer.invoke('document:show-folder-item', itemPath),
  saveMarkdownFile: (filePath, content, defaultFolderPath) =>
    ipcRenderer.invoke('document:save', { filePath, content, defaultFolderPath }),
  saveMarkdownFileAs: (content, defaultFolderPath) =>
    ipcRenderer.invoke('document:save-as', { content, defaultFolderPath }),
  exportMarkdownDocument: (options) => ipcRenderer.invoke('document:export', options),
  saveClipboardImage: (options) => ipcRenderer.invoke('document:save-clipboard-image', options),
  saveImageFile: (options) => ipcRenderer.invoke('document:save-image-file', options),
  deleteInsertedImages: (options) => ipcRenderer.invoke('document:delete-inserted-images', options),
  copyTextToClipboard: (text) => ipcRenderer.invoke('clipboard:copy-text', text),
  copyImageToClipboard: (source) => ipcRenderer.invoke('clipboard:copy-image', source),
  testSyncConnection: (options) => ipcRenderer.invoke('sync:test-connection', options),
  chooseFolder: (title) => ipcRenderer.invoke('dialog:choose-folder', title),
  resolveAssetUrl: (markdownFilePath, source, syncSettings) =>
    ipcRenderer.invoke('document:asset-url', { markdownFilePath, source, syncSettings }),
  setWindowTitle: (title) => ipcRenderer.invoke('window:set-title', title),
  setDocumentEdited: (edited) => ipcRenderer.invoke('window:set-document-edited', edited),
  forceClose: () => ipcRenderer.invoke('window:force-close'),
  saveServerSession: (session) => ipcRenderer.invoke('server:save-session', session),
  loadServerSession: () => ipcRenderer.invoke('server:load-session'),
  clearServerSession: () => ipcRenderer.invoke('server:clear-session'),
  onOpenFromSystem: (callback) => {
    const listener = (_event, filePath) => callback(filePath)
    ipcRenderer.on('document:open-from-system', listener)
    return () => ipcRenderer.removeListener('document:open-from-system', listener)
  },
  onRequestClose: (callback) => {
    const listener = () => callback()
    ipcRenderer.on('window:request-close', listener)
    return () => ipcRenderer.removeListener('window:request-close', listener)
  }
})
