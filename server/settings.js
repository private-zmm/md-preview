import cron from 'node-cron'
import { config, isS3Configured } from './config.js'
import { query } from './db.js'
import { decryptJson, encryptJson } from './secure.js'

const settingsKey = 'server'

function currentSettings() {
  return {
    mcpApiKey: config.mcpApiKey,
    mcpUserEmail: config.mcpUserEmail,
    backupEnabled: config.backupEnabled,
    backupSchedule: config.backupSchedule,
    s3: { ...config.s3 }
  }
}

function publicSettings() {
  return {
    mcpApiKey: config.mcpApiKey,
    mcpUserEmail: config.mcpUserEmail,
    backupEnabled: config.backupEnabled,
    backupSchedule: config.backupSchedule,
    s3: {
      endpoint: config.s3.endpoint,
      region: config.s3.region,
      bucket: config.s3.bucket,
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: '',
      hasSecret: Boolean(config.s3.secretAccessKey),
      prefix: config.s3.prefix
    },
    s3Configured: isS3Configured()
  }
}

export async function loadServerSettings() {
  const result = await query('SELECT encrypted_value FROM server_settings WHERE key = $1', [settingsKey])
  if (!result.rows[0]) return

  const saved = decryptJson(result.rows[0].encrypted_value)
  if (typeof saved.mcpApiKey === 'string') config.mcpApiKey = saved.mcpApiKey
  if (typeof saved.mcpUserEmail === 'string' && saved.mcpUserEmail) config.mcpUserEmail = saved.mcpUserEmail
  if (typeof saved.backupEnabled === 'boolean') config.backupEnabled = saved.backupEnabled
  if (typeof saved.backupSchedule === 'string' && cron.validate(saved.backupSchedule)) {
    config.backupSchedule = saved.backupSchedule
  }
  if (saved.s3 && typeof saved.s3 === 'object') {
    for (const key of ['endpoint', 'region', 'bucket', 'accessKeyId', 'secretAccessKey', 'prefix']) {
      if (typeof saved.s3[key] === 'string') config.s3[key] = saved.s3[key]
    }
  }
}

export function getServerSettings() {
  return publicSettings()
}

export async function saveServerSettings(input = {}) {
  const next = currentSettings()
  if (typeof input.mcpApiKey === 'string') next.mcpApiKey = input.mcpApiKey.trim()
  if (typeof input.mcpUserEmail === 'string' && input.mcpUserEmail.trim()) next.mcpUserEmail = input.mcpUserEmail.trim()
  if (typeof input.backupEnabled === 'boolean') next.backupEnabled = input.backupEnabled
  if (typeof input.backupSchedule === 'string') {
    const schedule = input.backupSchedule.trim()
    if (!cron.validate(schedule)) throw new Error('备份 Cron 表达式无效')
    next.backupSchedule = schedule
  }
  if (input.s3 && typeof input.s3 === 'object') {
    for (const key of ['endpoint', 'region', 'bucket', 'accessKeyId', 'prefix']) {
      if (typeof input.s3[key] === 'string') next.s3[key] = input.s3[key].trim()
    }
    if (typeof input.s3.secretAccessKey === 'string' && input.s3.secretAccessKey) {
      next.s3.secretAccessKey = input.s3.secretAccessKey
    }
  }

  await query(
    `INSERT INTO server_settings (key, encrypted_value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET encrypted_value = EXCLUDED.encrypted_value, updated_at = NOW()`,
    [settingsKey, encryptJson(next)]
  )

  config.mcpApiKey = next.mcpApiKey
  config.mcpUserEmail = next.mcpUserEmail
  config.backupEnabled = next.backupEnabled
  config.backupSchedule = next.backupSchedule
  config.s3 = next.s3
  return publicSettings()
}
