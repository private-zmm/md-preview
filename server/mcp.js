import crypto from 'node:crypto'
import { config } from './config.js'
import { query } from './db.js'
import { authRequired } from './auth.js'
import { deleteDocumentFile, readDocument, writeDocument } from './storage.js'
import { queueDocumentEmbedding } from './embedding.js'
import { moveDocument } from './documentMoves.js'

const supportedProtocolVersions = ['2025-06-18', '2025-03-26', '2024-11-05']

const tools = [
  {
    name: 'list_documents',
    description: '列出当前用户的 Markdown 笔记。',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 200 } }
    }
  },
  {
    name: 'read_document',
    description: '读取一篇笔记的完整内容。',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }
  },
  {
    name: 'create_document',
    description: '创建一篇 Markdown 笔记。',
    inputSchema: {
      type: 'object',
      properties: { title: { type: 'string' }, content: { type: 'string' }, relativePath: { type: 'string' } },
      required: ['title']
    }
  },
  {
    name: 'update_document',
    description: '更新一篇笔记，可选传入 version 防止覆盖他人修改。',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, content: { type: 'string' }, title: { type: 'string' }, version: { type: 'integer' } },
      required: ['id', 'content']
    }
  },
  {
    name: 'move_document',
    description: '移动当前用户的笔记，可同时重命名。relativePath 为包含文件名的目标相对路径，例如 归档/部署说明.md；移到根目录时只传文件名。目标同名文件不会被覆盖。',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, relativePath: { type: 'string' } },
      required: ['id', 'relativePath']
    }
  },
  {
    name: 'delete_document',
    description: '删除一篇笔记。',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }
  },
  {
    name: 'search_documents',
    description: '按标题或相对路径搜索笔记。',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
  },
  {
    name: 'duplicate_document',
    description: '复制一篇笔记。',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }
  }
]

function jsonResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] }
}

async function getDocument(id, userId) {
  const result = await query('SELECT * FROM documents WHERE id = $1 AND user_id = $2', [id, userId])
  if (!result.rows[0]) throw new Error('文档不存在')
  return result.rows[0]
}

async function callTool(name, args, userId) {
  const input = args || {}

  if (name === 'list_documents') {
    const text = String(input.query || '').trim()
    const limit = Math.min(Math.max(Number(input.limit) || 100, 1), 200)
    const result = await query(
      `SELECT id, title, relative_path, version, created_at, updated_at FROM documents
       WHERE user_id = $1 AND ($2 = '' OR title ILIKE $3 OR relative_path ILIKE $3)
       ORDER BY updated_at DESC LIMIT $4`,
      [userId, text, `%${text}%`, limit]
    )
    return jsonResult({ documents: result.rows })
  }

  if (name === 'search_documents') {
    const text = String(input.query || '').trim()
    if (!text) return jsonResult({ documents: [] })
    const result = await query(
      `SELECT id, title, relative_path, version, updated_at FROM documents
       WHERE user_id = $1 AND (title ILIKE $2 OR relative_path ILIKE $2)
       ORDER BY updated_at DESC LIMIT 100`,
      [userId, `%${text}%`]
    )
    return jsonResult({ documents: result.rows })
  }

  if (name === 'read_document') {
    const document = await getDocument(input.id, userId)
    return jsonResult({
      id: document.id,
      title: document.title,
      relativePath: document.relative_path,
      version: document.version,
      content: await readDocument(document.content_path)
    })
  }

  if (name === 'create_document') {
    const id = crypto.randomUUID()
    const title = String(input.title || 'Untitled.md')
    const content = String(input.content || '')
    const relativePath = String(input.relativePath || title)
    const contentPath = await writeDocument(userId, id, content)
    await query(
      `INSERT INTO documents (id, user_id, title, relative_path, content_path)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, userId, title, relativePath, contentPath]
    )
    queueDocumentEmbedding(id)
    return jsonResult({ id, title, relativePath, version: 1 })
  }

  if (name === 'update_document') {
    const document = await getDocument(input.id, userId)
    if (input.version != null && Number(input.version) !== document.version) {
      throw new Error(`文档版本冲突，当前版本为 ${document.version}`)
    }
    await writeDocument(userId, document.id, String(input.content))
    const updated = await query(
      `UPDATE documents SET title = COALESCE($1, title), version = version + 1, updated_at = NOW()
       WHERE id = $2 RETURNING id, title, relative_path, version, updated_at`,
      [input.title ? String(input.title) : null, document.id]
    )
    queueDocumentEmbedding(document.id)
    return jsonResult(updated.rows[0])
  }

  if (name === 'move_document') {
    return jsonResult(await moveDocument(userId, input.id, input.relativePath))
  }

  if (name === 'delete_document') {
    const document = await getDocument(input.id, userId)
    await deleteDocumentFile(document.content_path)
    await query('DELETE FROM documents WHERE id = $1 AND user_id = $2', [document.id, userId])
    return jsonResult({ ok: true, id: document.id })
  }

  if (name === 'duplicate_document') {
    const source = await getDocument(input.id, userId)
    const id = crypto.randomUUID()
    const content = await readDocument(source.content_path)
    const title = source.title.replace(/(\.md)?$/i, ' copy$1')
    const contentPath = await writeDocument(userId, id, content)
    await query(
      `INSERT INTO documents (id, user_id, title, relative_path, content_path)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, userId, title, '', contentPath]
    )
    return jsonResult({ id, title, version: 1 })
  }

  throw new Error(`未知工具：${name}`)
}

async function resolveMcpUser(request) {
  if (!config.mcpApiKey) return request.user
  const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [config.mcpUserEmail])
  if (!result.rows[0]) throw new Error('MCP_USER_EMAIL 对应的用户不存在')
  const user = result.rows[0]
  return { sub: user.id, email: user.email, role: user.role }
}

export async function mcpAuthRequired(request, reply) {
  const header = request.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (config.mcpApiKey && token === config.mcpApiKey) {
    request.user = await resolveMcpUser(request)
    return
  }
  await authRequired(request, reply)
}

export async function handleMcpRequest(request, reply) {
  const payload = request.body
  if (!payload || Array.isArray(payload) || payload.jsonrpc !== '2.0' || !payload.method) {
    return reply.code(400).send({ error: '需要单个 JSON-RPC 2.0 请求' })
  }

  if (payload.method === 'notifications/initialized') return reply.code(204).send()

  const id = payload.id ?? null
  try {
    if (payload.method === 'initialize') {
      const requestedVersion = payload.params?.protocolVersion
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: supportedProtocolVersions.includes(requestedVersion)
            ? requestedVersion
            : supportedProtocolVersions[0],
          capabilities: { tools: {} },
          serverInfo: { name: 'mdpreview', version: '0.1.6' }
        }
      }
    }

    if (payload.method === 'ping') return { jsonrpc: '2.0', id, result: {} }
    if (payload.method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools } }
    if (payload.method === 'tools/call') {
      const result = await callTool(payload.params?.name, payload.params?.arguments, request.user.sub)
      return { jsonrpc: '2.0', id, result }
    }

    return { jsonrpc: '2.0', id, error: { code: -32601, message: '方法不存在' } }
  } catch (error) {
    return { jsonrpc: '2.0', id, result: { isError: true, content: [{ type: 'text', text: error.message }] } }
  }
}
