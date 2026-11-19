import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRemoteApi } from './remoteApi.js'

async function connectedApi(t) {
  const localCalls = []
  const requests = []
  const localApi = {
    loadServerSession: async () => ({ serverUrl: 'https://notes.example', accessToken: 'test-token' })
  }
  for (const name of ['openMarkdownFile', 'openMarkdownFolder', 'saveMarkdownFile', 'saveMarkdownFileAs',
    'createMarkdownFileInFolder', 'renameFolderItem', 'moveFolderItem', 'duplicateFolderFile', 'deleteFolderItem']) {
    localApi[name] = async (...args) => { localCalls.push({ name, args }); return { local: true } }
  }
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url, options })
    return Response.json({ id: 'remote-id', title: 'remote.md', content: '# Remote', documents: [] })
  })
  const api = createRemoteApi(localApi)
  await Promise.resolve()
  assert.equal(api.isServerMode(), true)
  return { api, localCalls, requests }
}

test('server login does not intercept local paths or local file/folder pickers', async (t) => {
  const { api, localCalls, requests } = await connectedApi(t)
  await api.openMarkdownFile('C:\\notes\\local.md')
  await api.openMarkdownFile()
  await api.openMarkdownFolder()
  assert.deepEqual(localCalls.map(({ name, args }) => [name, args[0]]), [
    ['openMarkdownFile', 'C:\\notes\\local.md'],
    ['openMarkdownFile', undefined],
    ['openMarkdownFolder', undefined]
  ])
  assert.equal(requests.length, 0)
})

test('local save and save-as never upload to the server, including with a remote sidebar', async (t) => {
  const { api, localCalls, requests } = await connectedApi(t)
  const filePath = 'C:\\notes\\local.md'
  await api.saveMarkdownFile(filePath, '# Local', 'server://workspace')
  await api.saveMarkdownFileAs('# Copy', 'server://workspace', filePath)
  await api.saveMarkdownFile(null, '# New local', null)
  assert.deepEqual(localCalls, [
    { name: 'saveMarkdownFile', args: [filePath, '# Local', null] },
    { name: 'saveMarkdownFileAs', args: ['# Copy', null] },
    { name: 'saveMarkdownFile', args: [null, '# New local', null] }
  ])
  assert.equal(requests.length, 0)
})

test('server files still open and save remotely, even with a local sidebar', async (t) => {
  const { api, localCalls, requests } = await connectedApi(t)
  const filePath = 'server://document/remote-id'
  assert.equal((await api.openMarkdownFile(filePath)).content, '# Remote')
  await api.saveMarkdownFile(filePath, '# Changed', 'C:\\notes')
  await api.openServerMarkdownFolder()
  assert.equal(localCalls.length, 0)
  assert.deepEqual(requests.map(({ url, options }) => [url, options.method || 'GET']), [
    ['https://notes.example/api/documents/remote-id', 'GET'],
    ['https://notes.example/api/documents/remote-id', 'PUT'],
    ['https://notes.example/api/documents', 'GET']
  ])
  assert.equal(JSON.parse(requests[1].options.body).content, '# Changed')
})

test('new remote drafts and remote save-as use server context instead of login status', async (t) => {
  const { api, localCalls, requests } = await connectedApi(t)
  const previousWindow = globalThis.window
  globalThis.window = { prompt: () => 'copy.md' }
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  })
  await api.saveMarkdownFile(null, '# New remote', 'server://workspace')
  await api.saveMarkdownFileAs('# Remote copy', 'C:\\notes', 'server://document/remote-id')
  assert.equal(localCalls.length, 0)
  assert.equal(requests.length, 2)
  for (const request of requests) {
    assert.equal(request.url, 'https://notes.example/api/documents')
    assert.equal(request.options.method, 'POST')
  }
})

test('local folder operations keep using the filesystem while logged in', async (t) => {
  const { api, localCalls, requests } = await connectedApi(t)
  const options = { folderPath: 'C:\\notes', itemPath: 'C:\\notes\\local.md', filePath: 'C:\\notes\\local.md' }
  for (const method of ['createMarkdownFileInFolder', 'renameFolderItem', 'moveFolderItem', 'duplicateFolderFile', 'deleteFolderItem']) {
    await api[method](options)
    assert.equal(localCalls.at(-1).name, method)
  }
  assert.equal(requests.length, 0)
})
