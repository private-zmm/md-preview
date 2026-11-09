import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { createReadStream } from 'node:fs'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { config } from './config.js'
import { closeDatabase, migrate, query } from './db.js'
import { ensureAdminUser, authenticate, authRequired, adminRequired, publicUser, signAccessToken, signRefreshToken } from './auth.js'
import { ensureStorage, readDocument, writeDocument, deleteDocumentFile, saveAsset, resolveAssetPath } from './storage.js'
import { generateDocumentEmbedding, queueDocumentEmbedding } from './embedding.js'
import { createBackup, listBackups, restoreBackup, startBackupScheduler } from './backup.js'
import { encryptJson } from './secure.js'

const app = Fastify({ logger: true, bodyLimit: 25 * 1024 * 1024 })

await app.register(cors, { origin: true, credentials: true })
await app.register(multipart, { limits: { fileSize: 20 * 1024 * 1024, files: 1 } })

app.get('/health', async () => ({ ok: true, service: 'mdpreview-server', time: new Date().toISOString() }))

app.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body || {}
  if (!email || !password) return reply.code(400).send({ error: '邮箱和密码不能为空' })
  const user = await authenticate(email, password)
  if (!user) return reply.code(401).send({ error: '邮箱或密码错误' })
  return {
    user: publicUser(user),
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user)
  }
})

app.post('/api/auth/refresh', async (request, reply) => {
  const { refreshToken } = request.body || {}
  if (!refreshToken) return reply.code(400).send({ error: '缺少 refreshToken' })
  try {
    const jwt = await import('jsonwebtoken')
    const payload = jwt.default.verify(refreshToken, config.jwtSecret)
    if (payload.type !== 'refresh') throw new Error('invalid token type')
    const result = await query('SELECT * FROM users WHERE id = $1', [payload.sub])
    if (!result.rows[0]) return reply.code(401).send({ error: '用户不存在' })
    return { accessToken: signAccessToken(result.rows[0]) }
  } catch {
    return reply.code(401).send({ error: '刷新令牌无效' })
  }
})

app.get('/api/auth/me', { preHandler: authRequired }, async (request) => {
  const result = await query('SELECT * FROM users WHERE id = $1', [request.user.sub])
  return { user: publicUser(result.rows[0]) }
})

app.get('/api/documents', { preHandler: authRequired }, async (request) => {
  const result = await query(
    `SELECT id, title, relative_path, version, created_at, updated_at
     FROM documents WHERE user_id = $1 ORDER BY updated_at DESC`,
    [request.user.sub]
  )
  return { documents: result.rows }
})

app.post('/api/documents', { preHandler: authRequired }, async (request, reply) => {
  const { title = 'Untitled.md', content = '', relativePath = '' } = request.body || {}
  const id = crypto.randomUUID()
  const contentPath = await writeDocument(request.user.sub, id, content)
  await query(
    `INSERT INTO documents (id, user_id, title, relative_path, content_path)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, request.user.sub, String(title), String(relativePath), contentPath]
  )
  queueDocumentEmbedding(id)
  return reply.code(201).send({ id, title, version: 1, content, relativePath })
})

app.get('/api/documents/:id', { preHandler: authRequired }, async (request, reply) => {
  const result = await query('SELECT * FROM documents WHERE id = $1 AND user_id = $2', [request.params.id, request.user.sub])
  const document = result.rows[0]
  if (!document) return reply.code(404).send({ error: '文档不存在' })
  const { content_path: _contentPath, ...metadata } = document
  return { ...metadata, content: await readDocument(document.content_path) }
})

app.put('/api/documents/:id', { preHandler: authRequired }, async (request, reply) => {
  const { content = '', title, version } = request.body || {}
  const result = await query('SELECT * FROM documents WHERE id = $1 AND user_id = $2', [request.params.id, request.user.sub])
  const document = result.rows[0]
  if (!document) return reply.code(404).send({ error: '文档不存在' })
  if (version && Number(version) !== document.version) return reply.code(409).send({ error: '文档版本冲突', version: document.version })
  await writeDocument(request.user.sub, document.id, content)
  const updated = await query(
    `UPDATE documents SET title = COALESCE($1, title), version = version + 1, updated_at = NOW()
     WHERE id = $2 RETURNING id, title, version, updated_at`,
    [title ? String(title) : null, document.id]
  )
  queueDocumentEmbedding(document.id)
  return updated.rows[0]
})

app.post('/api/documents/:id/duplicate', { preHandler: authRequired }, async (request, reply) => {
  const result = await query('SELECT * FROM documents WHERE id = $1 AND user_id = $2', [request.params.id, request.user.sub])
  const source = result.rows[0]
  if (!source) return reply.code(404).send({ error: '文档不存在' })
  const id = crypto.randomUUID()
  const content = await readDocument(source.content_path)
  const title = source.title.replace(/(\.md)?$/i, ' copy$1')
  const contentPath = await writeDocument(request.user.sub, id, content)
  await query(
    `INSERT INTO documents (id, user_id, title, relative_path, content_path)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, request.user.sub, title, '', contentPath]
  )
  return reply.code(201).send({ id, title, version: 1, relativePath: '' })
})

app.delete('/api/documents/:id', { preHandler: authRequired }, async (request, reply) => {
  const result = await query('SELECT content_path FROM documents WHERE id = $1 AND user_id = $2', [request.params.id, request.user.sub])
  if (!result.rows[0]) return reply.code(404).send({ error: '文档不存在' })
  await deleteDocumentFile(result.rows[0].content_path)
  await query('DELETE FROM documents WHERE id = $1 AND user_id = $2', [request.params.id, request.user.sub])
  return { ok: true }
})

app.post('/api/documents/:id/assets', { preHandler: authRequired }, async (request, reply) => {
  const documentResult = await query('SELECT id FROM documents WHERE id = $1 AND user_id = $2', [request.params.id, request.user.sub])
  if (!documentResult.rows[0]) return reply.code(404).send({ error: '文档不存在' })
  const file = await request.file()
  if (!file) return reply.code(400).send({ error: '缺少图片文件' })
  if (!file.mimetype.startsWith('image/')) return reply.code(415).send({ error: '只支持图片文件' })
  const buffer = await file.toBuffer()
  const saved = await saveAsset(request.user.sub, request.params.id, file.filename, file.mimetype, buffer)
  const id = crypto.randomUUID()
  await query(
    `INSERT INTO document_assets (id, document_id, original_name, storage_path, mime_type, size_bytes, sha256)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, request.params.id, file.filename, saved.relativePath, file.mimetype, saved.size, saved.hash]
  )
  return reply.code(201).send({ id, fileName: file.filename, path: saved.relativePath, url: `/api/assets/${id}` })
})

app.get('/api/assets/:id', { preHandler: authRequired }, async (request, reply) => {
  const result = await query(
    `SELECT a.* FROM document_assets a JOIN documents d ON d.id = a.document_id
     WHERE a.id = $1 AND d.user_id = $2`,
    [request.params.id, request.user.sub]
  )
  const asset = result.rows[0]
  if (!asset) return reply.code(404).send({ error: '图片不存在' })
  const filePath = resolveAssetPath(asset.storage_path)
  if (!fsSync.existsSync(filePath)) return reply.code(404).send({ error: '图片文件不存在' })
  return reply.type(asset.mime_type).send(createReadStream(filePath))
})

app.get('/api/search', { preHandler: authRequired }, async (request) => {
  const text = String(request.query?.q || '').trim()
  if (!text) return { documents: [] }
  const result = await query(
    `SELECT id, title, relative_path, version, updated_at FROM documents
     WHERE user_id = $1 AND (title ILIKE $2 OR relative_path ILIKE $2)
     ORDER BY updated_at DESC LIMIT 100`,
    [request.user.sub, `%${text}%`]
  )
  return { documents: result.rows }
})

app.post('/api/embeddings/rebuild', { preHandler: authRequired }, async (request, reply) => {
  const result = await query('SELECT id FROM documents WHERE user_id = $1', [request.user.sub])
  setImmediate(async () => {
    for (const document of result.rows) {
      try {
        await generateDocumentEmbedding(document.id)
      } catch (error) {
        app.log.error(error, `Embedding failed for ${document.id}`)
      }
    }
  })
  return reply.code(202).send({ accepted: true, count: result.rowCount })
})

app.get('/api/mcp/servers', { preHandler: authRequired }, async (request) => {
  const result = await query(
    `SELECT id, name, transport, endpoint, enabled, created_at, updated_at
     FROM mcp_servers WHERE user_id = $1 ORDER BY name`,
    [request.user.sub]
  )
  return { servers: result.rows }
})

app.post('/api/mcp/servers', { preHandler: authRequired }, async (request, reply) => {
  const { name, endpoint, transport = 'streamable-http', config: secretConfig = {} } = request.body || {}
  if (!name || !endpoint) return reply.code(400).send({ error: 'MCP 名称和地址不能为空' })
  const id = crypto.randomUUID()
  await query(
    `INSERT INTO mcp_servers (id, user_id, name, transport, endpoint, encrypted_config)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, request.user.sub, name, transport, endpoint, encryptJson(secretConfig)]
  )
  return reply.code(201).send({ id, name, transport, endpoint, enabled: true })
})

app.delete('/api/mcp/servers/:id', { preHandler: authRequired }, async (request, reply) => {
  const result = await query('DELETE FROM mcp_servers WHERE id = $1 AND user_id = $2', [request.params.id, request.user.sub])
  if (!result.rowCount) return reply.code(404).send({ error: 'MCP 服务不存在' })
  return { ok: true }
})

app.get('/api/backups', { preHandler: adminRequired }, async () => ({ backups: await listBackups() }))
app.post('/api/backups/create', { preHandler: adminRequired }, async () => ({ backup: await createBackup() }))
app.post('/api/backups/:id/restore', { preHandler: adminRequired }, async (request) => ({ result: await restoreBackup(request.params.id) }))

const webRoot = path.resolve(process.cwd(), 'dist-web')
if (fsSync.existsSync(webRoot)) {
  await app.register(fastifyStatic, { root: webRoot, prefix: '/', index: false })
  app.get('/', async (_request, reply) => reply.sendFile('index.html'))
}

await migrate()
await ensureStorage()
await ensureAdminUser()
startBackupScheduler()

const shutdown = async () => {
  await app.close()
  await closeDatabase()
  process.exit(0)
}
process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

await app.listen({ host: config.host, port: config.port })
