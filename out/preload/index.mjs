import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("mdPreview", {
  getInitialFile: () => ipcRenderer.invoke("document:get-initial-file"),
  createMarkdownFile: (folderPath) => ipcRenderer.invoke("document:create", folderPath),
  openMarkdownFile: (filePath) => ipcRenderer.invoke("document:open", filePath),
  openMarkdownFolder: () => ipcRenderer.invoke("document:open-folder"),
  openRemoteMarkdownFile: (filePath, settings) => ipcRenderer.invoke("document:open-remote", { filePath, settings }),
  openRemoteMarkdownFolder: (settings) => ipcRenderer.invoke("document:open-remote-folder", settings),
  refreshMarkdownFolder: (folderPath) => ipcRenderer.invoke("document:refresh-folder", folderPath),
  refreshRemoteMarkdownFolder: (settings, folderPath) => ipcRenderer.invoke("document:refresh-remote-folder", { settings, folderPath }),
  createMarkdownFileInFolder: (options) => ipcRenderer.invoke("document:create-in-folder", options),
  createFolderInFolder: (options) => ipcRenderer.invoke("document:create-folder-in-folder", options),
  renameFolderItem: (options) => ipcRenderer.invoke("document:rename-folder-item", options),
  duplicateFolderFile: (options) => ipcRenderer.invoke("document:duplicate-folder-file", options),
  deleteFolderItem: (options) => ipcRenderer.invoke("document:delete-folder-item", options),
  showFolderItem: (itemPath) => ipcRenderer.invoke("document:show-folder-item", itemPath),
  createRemoteMarkdownFileInFolder: (options) => ipcRenderer.invoke("document:create-remote-in-folder", options),
  createRemoteFolderInFolder: (options) => ipcRenderer.invoke("document:create-remote-folder-in-folder", options),
  renameRemoteFolderItem: (options) => ipcRenderer.invoke("document:rename-remote-folder-item", options),
  duplicateRemoteFolderFile: (options) => ipcRenderer.invoke("document:duplicate-remote-folder-file", options),
  deleteRemoteFolderItem: (options) => ipcRenderer.invoke("document:delete-remote-folder-item", options),
  showRemoteFolderItem: (settings, itemPath) => ipcRenderer.invoke("document:show-remote-folder-item", { settings, itemPath }),
  saveMarkdownFile: (filePath, content, defaultFolderPath) => ipcRenderer.invoke("document:save", { filePath, content, defaultFolderPath }),
  saveMarkdownFileAs: (content, defaultFolderPath) => ipcRenderer.invoke("document:save-as", { content, defaultFolderPath }),
  saveRemoteMarkdownFile: (settings, filePath, content) => ipcRenderer.invoke("document:save-remote", { settings, filePath, content }),
  exportMarkdownDocument: (options) => ipcRenderer.invoke("document:export", options),
  saveClipboardImage: (options) => ipcRenderer.invoke("document:save-clipboard-image", options),
  deleteInsertedImages: (options) => ipcRenderer.invoke("document:delete-inserted-images", options),
  copyTextToClipboard: (text) => ipcRenderer.invoke("clipboard:copy-text", text),
  copyImageToClipboard: (source) => ipcRenderer.invoke("clipboard:copy-image", source),
  testSyncConnection: (options) => ipcRenderer.invoke("sync:test-connection", options),
  chooseFolder: (title) => ipcRenderer.invoke("dialog:choose-folder", title),
  resolveAssetUrl: (markdownFilePath, source, syncSettings) => ipcRenderer.invoke("document:asset-url", { markdownFilePath, source, syncSettings }),
  setWindowTitle: (title) => ipcRenderer.invoke("window:set-title", title),
  setDocumentEdited: (edited) => ipcRenderer.invoke("window:set-document-edited", edited),
  forceClose: () => ipcRenderer.invoke("window:force-close"),
  onOpenFromSystem: (callback) => {
    const listener = (_event, filePath) => callback(filePath);
    ipcRenderer.on("document:open-from-system", listener);
    return () => ipcRenderer.removeListener("document:open-from-system", listener);
  },
  onRequestClose: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("window:request-close", listener);
    return () => ipcRenderer.removeListener("window:request-close", listener);
  }
});
