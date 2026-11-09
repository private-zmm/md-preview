import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import { execFile } from 'node:child_process'
import cron from 'node-cron'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { config, isS3Configured } from './config.js'
import { query } from './db.js'

const execFileAsync = promisify(execFile)
const s3 = isS3Configured()
  ? new S3Client({
      endpoint: config.s3.endpoint || undefined,
      region: config.s3.region,
      forcePathStyle: Boolean(config.s3.endpoint),
      credentials: { accessKeyId: config.s3.accessKeyId, secretAccessKey: config.s3.secretAccessKey }
    })
  : null

async function sha256(filePath) {
  const hash = crypto.createHash('sha256')
  hash.update(await fs.readFile(filePath))
  return hash.digest('hex')
}

async function uploadObject(key, filePath) {
  if (!s3) return
  await s3.send(new PutObjectCommand({ Bucket: config.s3.bucket, Key: key, Body: createReadStream(filePath) }))
}

async function downloadObject(key, filePath) {
  if (!s3) throw new Error('未配置 S3 备份')
  const response = await s3.send(new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }))
  await fs.writeFile(filePath, Buffer.from(await response.Body.transformToByteArray()))
}

export async function createBackup({ upload = true } = {}) {
  const id = new Date().toISOString().replace(/[:.]/g, '-')
  const temporaryDir = path.join(config.tempDir, `backup-${id}`)
  const backupDir = path.join(config.backupDir, id)
  await fs.mkdir(temporaryDir, { recursive: true })

  const databaseDump = path.join(temporaryDir, 'database.dump')
  const filesArchive = path.join(temporaryDir, 'files.tar.gz')
  await execFileAsync('pg_dump', ['--dbname', config.databaseUrl, '--format=custom', '--file', databaseDump])
  await execFileAsync('tar', ['-czf', filesArchive, '-C', config.dataDir, 'documents', 'assets'])

  const manifest = {
    id,
    createdAt: new Date().toISOString(),
    files: {
      databaseDump: { sha256: await sha256(databaseDump), size: (await fs.stat(databaseDump)).size },
      filesArchive: { sha256: await sha256(filesArchive), size: (await fs.stat(filesArchive)).size }
    }
  }
  await fs.writeFile(path.join(temporaryDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
  await fs.mkdir(config.backupDir, { recursive: true })
  await fs.rename(temporaryDir, backupDir)

  const s3Prefix = `${config.s3.prefix}/${id}`
  if (upload && s3) {
    await uploadObject(`${s3Prefix}/database.dump`, path.join(backupDir, 'database.dump'))
    await uploadObject(`${s3Prefix}/files.tar.gz`, path.join(backupDir, 'files.tar.gz'))
    await uploadObject(`${s3Prefix}/manifest.json`, path.join(backupDir, 'manifest.json'))
  }

  const sizeBytes = manifest.files.databaseDump.size + manifest.files.filesArchive.size
  await query(
    `INSERT INTO backup_records (id, local_path, s3_prefix, status, size_bytes, manifest)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
    [id, backupDir, s3 ? s3Prefix : null, s3 ? 'uploaded' : 'created', sizeBytes, JSON.stringify(manifest)]
  )
  return { ...manifest, localPath: backupDir, s3Prefix: s3 ? s3Prefix : null }
}

export async function listBackups() {
  const result = await query('SELECT id, s3_prefix, status, size_bytes, manifest, created_at FROM backup_records ORDER BY created_at DESC')
  return result.rows
}

export async function restoreBackup(id) {
  const result = await query('SELECT * FROM backup_records WHERE id = $1', [id])
  const backup = result.rows[0]
  if (!backup) throw new Error('备份不存在')

  const restoreDir = path.join(config.tempDir, `restore-${id}`)
  await fs.rm(restoreDir, { recursive: true, force: true })
  await fs.mkdir(restoreDir, { recursive: true })
  const files = ['database.dump', 'files.tar.gz', 'manifest.json']
  for (const file of files) {
    const localFile = path.join(backup.local_path, file)
    try {
      await fs.copyFile(localFile, path.join(restoreDir, file))
    } catch {
      if (!backup.s3_prefix) throw new Error(`备份文件缺失：${file}`)
      await downloadObject(`${backup.s3_prefix}/${file}`, path.join(restoreDir, file))
    }
  }

  const currentSnapshot = await createBackup({ upload: false })
  await execFileAsync('pg_restore', ['--clean', '--if-exists', '--no-owner', '--dbname', config.databaseUrl, path.join(restoreDir, 'database.dump')])
  await fs.rm(config.documentsDir, { recursive: true, force: true })
  await fs.rm(config.assetsDir, { recursive: true, force: true })
  await fs.mkdir(config.dataDir, { recursive: true })
  await execFileAsync('tar', ['-xzf', path.join(restoreDir, 'files.tar.gz'), '-C', config.dataDir])
  return { restored: id, rollbackSnapshot: currentSnapshot.id }
}

export function startBackupScheduler() {
  if (!config.backupEnabled) return null
  return cron.schedule(config.backupSchedule, () => {
    createBackup().catch((error) => console.error('Scheduled backup failed:', error.message))
  })
}
