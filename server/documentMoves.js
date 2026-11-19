import path from 'node:path'
import { query } from './db.js'

function moveError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode })
}

export function normalizeMovePath(value, { allowEmpty = false } = {}) {
  const raw = String(value || '').replace(/\\/g, '/').trim()
  if (!raw && allowEmpty) return ''
  if (!raw || raw.startsWith('/') || /^[A-Za-z]:[\\/]/.test(raw)) {
    throw moveError('目标路径必须是当前工作区内的相对路径', 400)
  }

  const parts = raw.split('/').filter(Boolean)
  if (parts.some((part) => part === '.' || part === '..')) throw moveError('目标路径不能包含 . 或 ..', 400)
  return parts.join('/')
}

export async function moveDocument(userId, id, targetPath) {
  const relativePath = normalizeMovePath(targetPath)
  if (!/\.(md|markdown|mdown|mkd)$/i.test(relativePath)) {
    throw moveError('目标路径必须是 Markdown 文件路径', 400)
  }

  const result = await query('SELECT * FROM documents WHERE id = $1 AND user_id = $2', [id, userId])
  const document = result.rows[0]
  if (!document) throw moveError('文档不存在', 404)
  if (document.relative_path === relativePath) throw moveError('目标位置与当前相同', 400)

  const conflict = await query(
    'SELECT id FROM documents WHERE user_id = $1 AND relative_path = $2 AND id <> $3',
    [userId, relativePath, document.id]
  )
  if (conflict.rows[0]) throw moveError('目标位置已存在同名文件', 409)

  const updated = await query(
    `UPDATE documents SET title = $1, relative_path = $2, updated_at = NOW()
     WHERE id = $3 AND user_id = $4 RETURNING id, title, relative_path, version, updated_at`,
    [path.posix.basename(relativePath), relativePath, document.id, userId]
  )
  return updated.rows[0]
}
