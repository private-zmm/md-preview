import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { config } from './config.js'
import { query } from './db.js'

function tokenPayload(user) {
  return { sub: user.id, email: user.email, role: user.role }
}

export function signAccessToken(user) {
  return jwt.sign(tokenPayload(user), config.jwtSecret, { expiresIn: `${config.accessTokenMinutes}m` })
}

export function signRefreshToken(user) {
  return jwt.sign({ ...tokenPayload(user), type: 'refresh' }, config.jwtSecret, {
    expiresIn: `${config.refreshTokenDays}d`
  })
}

export async function ensureAdminUser() {
  const existing = await query('SELECT id FROM users WHERE email = $1', [config.adminEmail])
  if (existing.rowCount) return

  const passwordHash = await bcrypt.hash(config.adminPassword, 12)
  await query(
    `INSERT INTO users (id, email, password_hash, display_name, role)
     VALUES ($1, $2, $3, $4, 'admin')`,
    [crypto.randomUUID(), config.adminEmail, passwordHash, 'Administrator']
  )
}

export async function authenticate(email, password) {
  const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email])
  const user = result.rows[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null
  return user
}

export async function authRequired(request, reply) {
  const header = request.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return reply.code(401).send({ error: '需要登录' })

  try {
    request.user = jwt.verify(token, config.jwtSecret)
  } catch {
    return reply.code(401).send({ error: '登录已过期' })
  }
}

export async function adminRequired(request, reply) {
  await authRequired(request, reply)
  if (reply.sent) return
  if (request.user.role !== 'admin') return reply.code(403).send({ error: '需要管理员权限' })
}

export function publicUser(user) {
  return { id: user.id, email: user.email, displayName: user.display_name, role: user.role }
}
