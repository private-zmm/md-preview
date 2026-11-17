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
let backupScheduler = null

function getS3Client() {
  if (!isS3Configured()) return null
  return new S3Client({
    endpoint: config.s3.endpoint || undefined,
    region: config.s3.region,
    forcePathStyle: Boolean(config.s3.endpoint),
    // Compatible S3 services may reject AWS streaming checksum trailers.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
    credentials: { accessKeyId: config.s3.accessKeyId, secretAccessKey: config.s3.secretAccessKey }
  })
}

async function sha256(filePath) {
  const hash = crypto.createHash('sha256')
  hash.update(await fs.readFile(filePath))
  return hash.digest('hex')
}

async function uploadObject(key, filePath) {
  const { size } = await fs.stat(filePath)
  const s3 = getS3Client()
  if (!s3) return
  const body = createReadStream(filePath)
  try {
    await s3.send(new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: body,
      ContentLength: size
    }))
  } finally {
    body.destroy()
    s3.destroy()
  }
}

async function downloadObject(key, filePath) {
  const s3 = getS3Client()
  if (!s3) throw new Error('未配置 S3 备份')
  const response = await s3.send(new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }))
  await fs.writeFile(filePath, Buffer.from(await response.Body.transformToByteArray()))
}

function backupError(stage, error) {
  let detail = String(error.stderr || error.message || error.code || '未知错误').trim()
  // execFile errors include the complete command, which may contain database credentials.
  detail = detail.replaceAll(config.databaseUrl, '[数据库连接]')
  for (const secret of [config.s3.accessKeyId, config.s3.secretAccessKey]) {
    if (secret) detail = detail.replaceAll(secret, '[已隐藏]')
  }
  if (error.code === 'ENOENT') detail = '缺少备份命令，请更新服务镜像'
  if (/server version mismatch|aborting because of server version/i.test(detail)) {
    detail = 'PostgreSQL 备份工具版本低于数据库版本，请更新服务镜像'
  }
  return new Error(`${stage}：${detail.slice(0, 600)}`)
}

async function runBackupStep(stage, run) {
  try {
    return await run()
  } catch (error) {
    throw backupError(stage, error)
  }
}

export async function createBackup({ upload = true } = {}) {
  const shouldUpload = upload && isS3Configured()
  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID()}`
  // Stage on the backup volume so publishing also works with a separate BACKUP_DIR mount.
  const temporaryDir = path.join(config.backupDir, `.backup-${id}`)
  const backupDir = path.join(config.backupDir, id)
  await runBackupStep('创建备份目录失败', () => fs.mkdir(temporaryDir, { recursive: true }))

  try {
    const databaseDump = path.join(temporaryDir, 'database.dump')
    const filesArchive = path.join(temporaryDir, 'files.tar.gz')
    await runBackupStep('数据库备份失败', () => execFileAsync('pg_dump', ['--dbname', config.databaseUrl, '--format=custom', '--file', databaseDump]))
    await runBackupStep('文档和图片打包失败', () => execFileAsync('tar', ['-czf', filesArchive, '-C', config.dataDir, 'documents', 'assets']))

    const manifest = {
      id,
      createdAt: new Date().toISOString(),
      files: {
        databaseDump: { sha256: await sha256(databaseDump), size: (await fs.stat(databaseDump)).size },
        filesArchive: { sha256: await sha256(filesArchive), size: (await fs.stat(filesArchive)).size }
      }
    }
    await runBackupStep('保存本地备份失败', async () => {
      await fs.writeFile(path.join(temporaryDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
      await fs.rename(temporaryDir, backupDir)
    })

    const prefix = config.s3.prefix.replace(/^\/+|\/+$/g, '')
    const s3Prefix = prefix ? `${prefix}/${id}` : id

    const sizeBytes = manifest.files.databaseDump.size + manifest.files.filesArchive.size
    await runBackupStep('登记备份记录失败', () => query(
      `INSERT INTO backup_records (id, local_path, s3_prefix, status, size_bytes, manifest)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
      [id, backupDir, null, 'created', sizeBytes, JSON.stringify(manifest)]
    ))
    if (shouldUpload) {
      await runBackupStep('本地备份已保存，但上传 S3 失败', async () => {
        await uploadObject(`${s3Prefix}/database.dump`, path.join(backupDir, 'database.dump'))
        await uploadObject(`${s3Prefix}/files.tar.gz`, path.join(backupDir, 'files.tar.gz'))
        await uploadObject(`${s3Prefix}/manifest.json`, path.join(backupDir, 'manifest.json'))
      })
      await runBackupStep('更新备份记录失败', () => query(
        "UPDATE backup_records SET s3_prefix = $1, status = 'uploaded' WHERE id = $2",
        [s3Prefix, id]
      ))
    }
    return { ...manifest, localPath: backupDir, s3Prefix: shouldUpload ? s3Prefix : null }
  } finally {
    await fs.rm(temporaryDir, { recursive: true, force: true }).catch(() => {})
  }
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
  backupScheduler?.stop()
  backupScheduler = null
  if (!config.backupEnabled) return null
  backupScheduler = cron.schedule(config.backupSchedule, () => {
    createBackup().catch((error) => console.error('Scheduled backup failed:', error.message))
  })
  return backupScheduler
}
