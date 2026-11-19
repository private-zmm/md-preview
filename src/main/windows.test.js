import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'

async function loadMain(argv = []) {
  const windows = []
  const handlers = new Map()
  const dialogs = []
  let ready = false
  let resolveReady
  const readyPromise = new Promise((resolve) => { resolveReady = resolve })
  const app = Object.assign(new EventEmitter(), {
    requestSingleInstanceLock: () => true,
    isReady: () => ready,
    whenReady: () => readyPromise,
    quit: () => {}
  })
  class BrowserWindow extends EventEmitter {
    constructor() {
      super()
      this.messages = []
      this.webContents = {
        send: (...args) => this.messages.push(args),
        setWindowOpenHandler: () => {}
      }
      windows.push(this)
    }
    static fromWebContents(sender) { return windows.find((window) => !window.destroyed && window.webContents === sender) }
    show() { this.shown = true }
    loadFile() {}
    setTitle(title) { this.title = title }
    setDocumentEdited(edited) { this.edited = edited }
    destroy() { this.destroyed = true; this.emit('closed') }
  }
  const electron = {
    app,
    BrowserWindow,
    clipboard: { readImage: () => ({ isEmpty: () => false, toPNG: () => Buffer.from('image') }) },
    dialog: {
      showOpenDialog: async (parent, options) => { dialogs.push({ parent, options }); return { canceled: true } },
      showSaveDialog: async (parent, options) => { dialogs.push({ parent, options }); return { canceled: true } }
    },
    ipcMain: { handle: (name, handler) => handlers.set(name, handler) },
    Menu: { setApplicationMenu: () => {} },
    nativeImage: {},
    safeStorage: {},
    shell: {}
  }
  const context = createContext({
    process: { argv: ['MdPreview.exe', ...argv], env: {}, platform: 'win32' },
    Buffer,
    setTimeout,
    URL
  })
  const sourceUrl = new URL('./index.js', import.meta.url)
  const module = new SourceTextModule(await fs.readFile(sourceUrl, 'utf8'), {
    context,
    initializeImportMeta: (meta) => { meta.url = sourceUrl.href }
  })
  await module.link(async (specifier) => {
    const values = specifier === 'electron' ? electron : await import(specifier)
    return new SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value)
    }, { context })
  })
  await module.evaluate()
  return {
    app, windows, dialogs,
    ready: async () => { ready = true; resolveReady(); await readyPromise },
    invoke: (name, window, ...args) => handlers.get(name)({ sender: window.webContents }, ...args)
  }
}

test('system file opens create independent windows, including during startup', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mdpreview-windows-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const firstPath = path.join(root, 'first.md')
  const secondPath = path.join(root, 'second.md')
  await Promise.all([fs.writeFile(firstPath, '# First'), fs.writeFile(secondPath, '# Second')])
  const main = await loadMain([firstPath])
  main.app.emit('second-instance', {}, ['MdPreview.exe', secondPath])
  await main.ready()
  assert.equal(main.windows.length, 2)
  const [first, second] = main.windows
  // Read in reverse order to detect any shared initial-file state.
  assert.equal((await main.invoke('document:get-initial-file', second)).content, '# Second')
  assert.equal((await main.invoke('document:get-initial-file', first)).content, '# First')
  assert.equal(await main.invoke('document:get-initial-file', second), null)
  main.app.emit('second-instance', {}, ['MdPreview.exe', firstPath])
  assert.equal(main.windows.length, 3)
  assert.equal((await main.invoke('document:get-initial-file', main.windows[2])).filePath, firstPath)
  assert.equal(first.messages.length, 0)
  assert.equal(second.messages.length, 0)
})

test('window title, dirty state, visibility and close confirmation stay with their sender', async () => {
  const main = await loadMain()
  await main.ready()
  const first = main.windows[0]
  main.invoke('window:create', first)
  const second = main.windows[1]
  first.emit('ready-to-show')
  assert.equal(first.shown, true)
  assert.equal(second.shown, undefined)
  main.invoke('window:set-title', first, 'local.md')
  main.invoke('window:set-title', second, 'remote.md')
  main.invoke('window:set-document-edited', second, true)
  assert.equal(first.title, 'local.md')
  assert.equal(second.title, 'remote.md')
  assert.equal(first.edited, undefined)
  assert.equal(second.edited, true)
  let prevented = false
  second.emit('close', { preventDefault: () => { prevented = true } })
  assert.equal(prevented, true)
  assert.equal(second.messages[0][0], 'window:request-close')
  main.invoke('window:force-close', first)
  assert.equal(first.destroyed, true)
  assert.equal(second.destroyed, undefined)
  second.messages.length = 0
  second.emit('close', { preventDefault: () => {} })
  assert.equal(second.messages[0][0], 'window:request-close')
})

test('file, folder, save, export and image dialogs use the requesting window', async () => {
  const main = await loadMain()
  await main.ready()
  const first = main.windows[0]
  main.invoke('window:create', first)
  const second = main.windows[1]
  const requests = [
    ['document:open'],
    ['document:open-folder'],
    ['document:create', null],
    ['document:save', { filePath: null, content: '# Draft' }],
    ['document:save-as', { content: '# Draft' }],
    ['document:export', { format: 'html', fileName: 'draft.md', html: '<h1>Draft</h1>' }],
    ['document:save-image-file', { imageData: Buffer.from('image'), fileName: 'image.png' }],
    ['document:save-clipboard-image', {}],
    ['dialog:choose-folder', 'Images']
  ]
  for (const window of [second, first]) {
    for (const [name, ...args] of requests) {
      const result = await main.invoke(name, window, ...args)
      assert.equal(result.canceled, true)
      assert.equal(main.dialogs.at(-1).parent, window, name)
    }
  }
  assert.equal(main.dialogs.length, requests.length * 2)
})

test('open-file events received before app readiness retain the file', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mdpreview-windows-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const filePath = path.join(root, 'queued.md')
  await fs.writeFile(filePath, '# Queued')
  const main = await loadMain()
  main.app.emit('open-file', { preventDefault: () => {} }, filePath)
  await main.ready()
  assert.equal(main.windows.length, 1)
  assert.equal((await main.invoke('document:get-initial-file', main.windows[0])).content, '# Queued')
})
