import crypto from 'node:crypto'
import { config } from './config.js'

const key = crypto.createHash('sha256').update(config.jwtSecret).digest()

export function encryptJson(value) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value || {}), 'utf8'), cipher.final()])
  return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.')
}

export function decryptJson(value) {
  const [ivText, tagText, encryptedText] = String(value || '').split('.')
  if (!ivText || !tagText || !encryptedText) return {}
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivText, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagText, 'base64url'))
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(encryptedText, 'base64url')), decipher.final()]).toString('utf8'))
}
