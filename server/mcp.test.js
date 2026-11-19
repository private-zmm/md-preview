import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { test } from 'node:test'
import { SourceTextModule, SyntheticModule } from 'node:vm'

async function loadMcp(documents) {
  const writes = []
  const query = async (sql, values) => {
    if (sql.startsWith('SELECT * FROM documents')) {
      return { rows: documents.filter((document) => document.id === values[0] && document.user_id === values[1]) }
    }
    if (sql.startsWith('SELECT id FROM documents')) {
      return { rows: documents.filter((document) => document.user_id === values[0] && document.relative_path === values[1] && document.id !== values[2]) }
    }
    if (sql.startsWith('UPDATE documents')) {
      assert.match(sql, /WHERE id = \$3 AND user_id = \$4/)
      writes.push(values)
      const document = documents.find((entry) => entry.id === values[2] && entry.user_id === values[3])
      if (!document) return { rows: [] }
      document.title = values[0]
      document.relative_path = values[1]
      document.updated_at = 'new timestamp'
      const { id, title, relative_path, version, updated_at } = document
      return { rows: [{ id, title, relative_path, version, updated_at }] }
    }
    throw new Error(`Unexpected query: ${sql}`)
  }

  async function load(name, mocks) {
    const module = new SourceTextModule(await fs.readFile(new URL(name, import.meta.url), 'utf8'))
    await module.link(async (specifier) => {
      const values = mocks[specifier] || await import(specifier)
      if (values instanceof SourceTextModule) return values
      return new SyntheticModule(Object.keys(values), function () {
        for (const [key, value] of Object.entries(values)) this.setExport(key, value)
      })
    })
    await module.evaluate()
    return module
  }

  const moves = await load('./documentMoves.js', { './db.js': { query } })
  const unexpectedWrite = () => { throw new Error('Moving must not rewrite document contents or assets') }
  const mcp = await load('./mcp.js', {
    './db.js': { query },
    './config.js': { config: {} },
    './auth.js': { authRequired: () => {} },
    './storage.js': { readDocument: unexpectedWrite, writeDocument: unexpectedWrite, deleteDocumentFile: unexpectedWrite },
    './embedding.js': { queueDocumentEmbedding: unexpectedWrite },
    './documentMoves.js': moves
  })
  return {
    writes,
    moveDocument: moves.namespace.moveDocument,
    request: (method, params, userId = 'user-1') => mcp.namespace.handleMcpRequest({
      body: { jsonrpc: '2.0', id: 1, method, params },
      user: { sub: userId }
    }),
    move: (args, userId = 'user-1') => mcp.namespace.handleMcpRequest({
      body: { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'move_document', arguments: args } },
      user: { sub: userId }
    })
  }
}

function document(overrides = {}) {
  return {
    id: 'doc-1', user_id: 'user-1', title: 'note.md', relative_path: 'drafts/note.md',
    content_path: '/storage/user-1/doc-1.md', content: '# Original', version: 3,
    assetIds: ['image-1'], ...overrides
  }
}

test('MCP advertises move_document with an ID and a full target path', async () => {
  const mcp = await loadMcp([])
  const response = await mcp.request('tools/list')
  const tool = response.result.tools.find((entry) => entry.name === 'move_document')
  assert.ok(tool)
  assert.deepEqual(Array.from(tool.inputSchema.required), ['id', 'relativePath'])
})

test('MCP moves and renames a document without changing its ID, content, version or assets', async () => {
  const source = document()
  const mcp = await loadMcp([source])
  const response = await mcp.move({ id: source.id, relativePath: '  archive\\2026//renamed.md  ' })
  assert.equal(response.result.isError, undefined)
  const result = JSON.parse(response.result.content[0].text)
  assert.equal(result.relative_path, 'archive/2026/renamed.md')
  assert.equal(result.title, 'renamed.md')
  assert.equal(result.id, 'doc-1')
  assert.equal(source.version, 3)
  assert.equal(source.content_path, '/storage/user-1/doc-1.md')
  assert.equal(source.content, '# Original')
  assert.deepEqual(source.assetIds, ['image-1'])
  assert.equal(mcp.writes.length, 1)
})

test('MCP can move a document to the workspace root', async () => {
  const source = document()
  const mcp = await loadMcp([source])
  await mcp.move({ id: source.id, relativePath: 'note.md' })
  assert.equal(source.relative_path, 'note.md')
})

test('MCP refuses to overwrite another document at the target path', async () => {
  const source = document()
  const target = document({ id: 'doc-2', relative_path: 'archive/note.md', content: '# Destination' })
  const mcp = await loadMcp([source, target])
  const response = await mcp.move({ id: source.id, relativePath: target.relative_path })
  assert.equal(response.result.isError, true)
  assert.match(response.result.content[0].text, /目标位置已存在同名文件/)
  assert.equal(source.relative_path, 'drafts/note.md')
  assert.equal(target.content, '# Destination')
  assert.equal(mcp.writes.length, 0)
  await assert.rejects(mcp.moveDocument('user-1', source.id, target.relative_path), { statusCode: 409 })
})

test('MCP cannot move another user’s document', async () => {
  const source = document({ user_id: 'user-2' })
  const mcp = await loadMcp([source])
  const response = await mcp.move({ id: source.id, relativePath: 'archive/note.md' })
  assert.equal(response.result.isError, true)
  assert.match(response.result.content[0].text, /文档不存在/)
  assert.equal(mcp.writes.length, 0)
  assert.equal(source.relative_path, 'drafts/note.md')
  await assert.rejects(mcp.moveDocument('user-1', source.id, 'archive/note.md'), { statusCode: 404 })
})

test('another user’s matching target path does not block a move', async () => {
  const source = document()
  const other = document({ id: 'doc-2', user_id: 'user-2', relative_path: 'archive/note.md' })
  const mcp = await loadMcp([source, other])
  const response = await mcp.move({ id: source.id, relativePath: other.relative_path })
  assert.equal(response.result.isError, undefined)
  assert.equal(source.relative_path, 'archive/note.md')
  assert.equal(other.updated_at, undefined)
})

test('MCP rejects invalid destinations and moves to the current location', async (t) => {
  for (const relativePath of [undefined, '', '/tmp/note.md', 'C:\\notes\\note.md', '../note.md', 'archive/./note.md', 'archive/../note.md', 'archive/image.png', 'drafts/note.md']) {
    await t.test(String(relativePath), async () => {
      const source = document()
      const mcp = await loadMcp([source])
      const response = await mcp.move({ id: source.id, relativePath })
      assert.equal(response.result.isError, true)
      assert.equal(mcp.writes.length, 0)
      assert.equal(source.relative_path, 'drafts/note.md')
      await assert.rejects(mcp.moveDocument('user-1', source.id, relativePath), { statusCode: 400 })
    })
  }
})
