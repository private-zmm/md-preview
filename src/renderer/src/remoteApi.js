const SESSION_KEY = 'mdpreview-server-session'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') || null
  } catch {
    return null
  }
}

function writeSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

function serverPathForDocument(id) {
  return `server://document/${id}`
}

function documentIdFromPath(filePath) {
  const match = /^server:\/\/document\/([^/]+)$/.exec(String(filePath || ''))
  return match?.[1] || null
}

export function createRemoteApi(localApi) {
  const usesSecureStorage = typeof localApi.loadServerSession === 'function'
  const state = { session: usesSecureStorage ? null : readSession(), ready: Promise.resolve() }
  const assetUrls = new Map()

  function persistSession(session) {
    if (!usesSecureStorage) writeSession(session)
  }

  if (typeof localApi.loadServerSession === 'function') {
    state.ready = localApi.loadServerSession().then((session) => {
      if (session?.serverUrl && session?.accessToken) state.session = session
    })
  }

  function isServerMode() {
    return Boolean(state.session?.serverUrl && state.session?.accessToken)
  }

  async function request(path, options = {}, retry = true) {
    await state.ready
    if (!isServerMode()) throw new Error('尚未连接服务器')
    const headers = new Headers(options.headers || {})
    headers.set('Authorization', `Bearer ${state.session.accessToken}`)
    if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
    const response = await fetch(`${state.session.serverUrl.replace(/\/$/, '')}${path}`, { ...options, headers })

    if (response.status === 401 && retry && state.session.refreshToken) {
      const refresh = await fetch(`${state.session.serverUrl.replace(/\/$/, '')}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: state.session.refreshToken })
      })
      if (refresh.ok) {
        const payload = await refresh.json()
        state.session.accessToken = payload.accessToken
        persistSession(state.session)
        await localApi.saveServerSession?.(state.session)
        return request(path, options, false)
      }
      state.session = null
      persistSession(null)
      await localApi.clearServerSession?.()
    }

    if (!response.ok) {
      let message = `服务器请求失败：HTTP ${response.status}`
      try {
        message = (await response.json()).error || message
      } catch {
        // Keep the HTTP status when the response is not JSON.
      }
      throw new Error(message)
    }
    return response
  }

  async function login(settings) {
    await state.ready
    const serverUrl = String(settings.serverUrl || settings.url || '').trim().replace(/\/$/, '')
    if (!serverUrl || !settings.email || !settings.password) throw new Error('请填写服务器地址、邮箱和密码')
    const response = await fetch(`${serverUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: settings.email, password: settings.password })
    })
    const payload = await response.json()
    if (!response.ok) throw new Error(payload.error || '登录失败')
    state.session = { serverUrl, ...payload }
    persistSession(state.session)
    await localApi.saveServerSession?.(state.session)
    return payload.user
  }

  function logout() {
    state.session = null
    persistSession(null)
    localApi.clearServerSession?.()
  }

  function sessionInfo() {
    if (!state.session) return null
    return { serverUrl: state.session.serverUrl, user: state.session.user }
  }

  async function openServerMarkdownFolder() {
    const response = await request('/api/documents')
    const payload = await response.json()
    const files = payload.documents.map((document) => ({
      type: 'file',
      filePath: serverPathForDocument(document.id),
      fileName: document.title,
      baseName: document.title.replace(/\.[^.]+$/, ''),
      extension: '.md',
      summary: '',
      relativePath: document.relative_path || document.title
    }))
    return {
      canceled: false,
      folderPath: 'server://workspace',
      folderName: '服务器文档',
      files
    }
  }

  async function openServerMarkdownFile(filePath) {
    let documentId = documentIdFromPath(filePath)
    if (!documentId) {
      const folder = await openServerMarkdownFolder()
      const first = folder.files[0]
      if (!first) return { canceled: true }
      documentId = documentIdFromPath(first.filePath)
    }
    const response = await request(`/api/documents/${documentId}`)
    const document = await response.json()
    return {
      canceled: false,
      filePath: serverPathForDocument(document.id),
      fileName: document.title,
      content: document.content
    }
  }

  async function saveServerMarkdownFile(filePath, content) {
    const documentId = documentIdFromPath(filePath)
    if (!documentId) return saveServerMarkdownFileAs(content)
    const response = await request(`/api/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    })
    const document = await response.json()
    return { canceled: false, filePath, fileName: document.title, file: null }
  }

  async function saveServerMarkdownFileAs(content) {
    const title = window.prompt('服务器文件名', 'Untitled.md')
    if (!title) return { canceled: true }
    const fileName = /\.(md|markdown|mdown|mkd)$/i.test(title) ? title : `${title}.md`
    const response = await request('/api/documents', {
      method: 'POST',
      body: JSON.stringify({ title: fileName, content })
    })
    const document = await response.json()
    return {
      canceled: false,
      filePath: serverPathForDocument(document.id),
      fileName: document.title,
      file: null
    }
  }

  async function createServerMarkdownFileInFolder(options) {
    const title = String(options.fileName || 'Untitled.md')
    const response = await request('/api/documents', {
      method: 'POST',
      body: JSON.stringify({ title: /\.md$/i.test(title) ? title : `${title}.md`, content: '' })
    })
    const document = await response.json()
    return {
      file: { type: 'file', filePath: serverPathForDocument(document.id), fileName: document.title, relativePath: document.title },
      folder: await openServerMarkdownFolder()
    }
  }

  async function renameServerFolderItem(options) {
    const documentId = documentIdFromPath(options.itemPath)
    if (!documentId) throw new Error('服务器模式只支持重命名文件')
    const response = await request(`/api/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ title: options.newName })
    })
    const document = await response.json()
    const newPath = serverPathForDocument(document.id)
    return {
      oldPath: options.itemPath,
      newPath,
      file: { type: 'file', filePath: newPath, fileName: document.title, relativePath: document.title },
      folder: await openServerMarkdownFolder()
    }
  }

  async function duplicateServerFolderFile(options) {
    const documentId = documentIdFromPath(options.filePath)
    const response = await request(`/api/documents/${documentId}/duplicate`, { method: 'POST' })
    const document = await response.json()
    return {
      file: { type: 'file', filePath: serverPathForDocument(document.id), fileName: document.title, relativePath: document.title },
      folder: await openServerMarkdownFolder()
    }
  }

  async function deleteServerFolderItem(options) {
    const documentId = documentIdFromPath(options.itemPath)
    await request(`/api/documents/${documentId}`, { method: 'DELETE' })
    return { deletedPath: options.itemPath, folder: await openServerMarkdownFolder() }
  }

  async function saveServerImageFile(options) {
    const documentId = documentIdFromPath(options.markdownFilePath)
    if (!documentId) throw new Error('请先保存服务器文档，再上传图片')
    const form = new FormData()
    form.append('file', new Blob([options.imageData], { type: options.mimeType || 'application/octet-stream' }), options.fileName || 'image.png')
    const response = await request(`/api/documents/${documentId}/assets`, { method: 'POST', body: form })
    const asset = await response.json()
    return {
      canceled: false,
      markdownPath: asset.url,
      cleanup: { type: 'server', assetId: asset.id },
      fileName: asset.fileName
    }
  }

  async function resolveServerAssetUrl(markdownFilePath, source) {
    if (!source || /^(?:[a-z]+:|\/\/)/i.test(source)) return source
    if (!isServerMode()) return source
    if (source.startsWith('/')) {
      if (assetUrls.has(source)) return assetUrls.get(source)
      const response = await request(source)
      const objectUrl = URL.createObjectURL(await response.blob())
      assetUrls.set(source, objectUrl)
      return objectUrl
    }
    return source
  }

  const bridge = {
    ...localApi,
    isServerMode,
    login,
    logout,
    getServerSession: sessionInfo,
    openServerMarkdownFile,
    openServerMarkdownFolder,
    saveServerMarkdownFile,
    saveServerMarkdownFileAs,
    createServerMarkdownFileInFolder,
    renameServerFolderItem,
    duplicateServerFolderFile,
    deleteServerFolderItem,
    resolveServerAssetUrl,
    async openMarkdownFile(filePath) {
      return isServerMode() ? openServerMarkdownFile(filePath) : localApi.openMarkdownFile(filePath)
    },
    async openMarkdownFolder() {
      return isServerMode() ? openServerMarkdownFolder() : localApi.openMarkdownFolder()
    },
    async saveMarkdownFile(filePath, content, defaultFolderPath) {
      return String(filePath || '').startsWith('server://') || isServerMode()
        ? saveServerMarkdownFile(filePath, content)
        : localApi.saveMarkdownFile(filePath, content, defaultFolderPath)
    },
    async saveMarkdownFileAs(content, defaultFolderPath) {
      return isServerMode() ? saveServerMarkdownFileAs(content) : localApi.saveMarkdownFileAs(content, defaultFolderPath)
    },
    async saveImageFile(options) {
      return String(options?.markdownFilePath || '').startsWith('server://')
        ? saveServerImageFile(options)
        : localApi.saveImageFile(options)
    },
    async resolveAssetUrl(markdownFilePath, source, syncSettings) {
      return String(markdownFilePath || '').startsWith('server://')
        ? resolveServerAssetUrl(markdownFilePath, source)
        : localApi.resolveAssetUrl(markdownFilePath, source, syncSettings)
    },
    async refreshMarkdownFolder(folderPath) {
      return String(folderPath || '').startsWith('server://')
        ? openServerMarkdownFolder()
        : localApi.refreshMarkdownFolder(folderPath)
    },
    async createMarkdownFileInFolder(options) {
      return isServerMode() ? createServerMarkdownFileInFolder(options) : localApi.createMarkdownFileInFolder(options)
    },
    async renameFolderItem(options) {
      return isServerMode() ? renameServerFolderItem(options) : localApi.renameFolderItem(options)
    },
    async duplicateFolderFile(options) {
      return isServerMode() ? duplicateServerFolderFile(options) : localApi.duplicateFolderFile(options)
    },
    async deleteFolderItem(options) {
      return isServerMode() ? deleteServerFolderItem(options) : localApi.deleteFolderItem(options)
    }
  }

  return bridge
}
