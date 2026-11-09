import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { config } from './config.js'

export async function ensureStorage() {
  await Promise.all([
    fs.mkdir(config.documentsDir, { recursive: true }),
    fs.mkdir(config.assetsDir, { recursive: true }),
    fs.mkdir(config.tempDir, { recursive: true }),
    fs.mkdir(config.backupDir, { recursive: true })
  ])
}

function userDirectory(root, userId) {
  return path.join(root, String(userId))
}

export function documentStoragePath(userId, documentId) {
  return path.join(userDirectory(config.documentsDir, userId), `${documentId}.md`)
}

export async function writeDocument(userId, documentId, content) {
  const filePath = documentStoragePath(userId, documentId)
  const directory = path.dirname(filePath)
  const temporaryPath = `${filePath}.${crypto.randomUUID()}.tmp`
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(temporaryPath, content, 'utf8')
  await fs.rename(temporaryPath, filePath)
  return filePath
}

export async function readDocument(filePath) {
  return fs.readFile(filePath, 'utf8')
}

export async function deleteDocumentFile(filePath) {
  await fs.rm(filePath, { force: true })
}

export async function saveAsset(userId, documentId, originalName, mimeType, buffer) {
  const extension = path.extname(String(originalName || '')).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.bin'
  const hash = crypto.createHash('sha256').update(buffer).digest('hex')
  const relativePath = path.join(String(userId), String(documentId), `${hash}${extension}`)
  const filePath = path.join(config.assetsDir, relativePath)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, buffer)
  return { filePath, relativePath, hash, size: buffer.byteLength }
}

export function resolveAssetPath(relativePath) {
  const normalized = String(relativePath || '').replaceAll('\\', '/')
  if (!normalized || normalized.includes('..') || path.isAbsolute(normalized)) {
    throw new Error('非法文件路径')
  }
  return path.join(config.assetsDir, normalized)
}
