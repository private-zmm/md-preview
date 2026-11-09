import path from 'node:path'

const dataDir = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'))

export const config = {
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 8787),
  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://mdpreview:mdpreview@localhost:5432/mdpreview',
  dataDir,
  documentsDir: path.join(dataDir, 'documents'),
  assetsDir: path.join(dataDir, 'assets'),
  tempDir: path.join(dataDir, 'temp'),
  backupDir: path.resolve(process.env.BACKUP_DIR || path.join(dataDir, 'backups')),
  jwtSecret: process.env.JWT_SECRET || 'change-this-development-secret',
  accessTokenMinutes: Number(process.env.ACCESS_TOKEN_MINUTES || 30),
  refreshTokenDays: Number(process.env.REFRESH_TOKEN_DAYS || 30),
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'change-me-now',
  embeddingBaseUrl: process.env.EMBEDDING_BASE_URL || 'https://api.openai.com/v1',
  embeddingApiKey: process.env.EMBEDDING_API_KEY || '',
  embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS || 1536),
  backupSchedule: process.env.BACKUP_SCHEDULE || '0 3 * * *',
  backupEnabled: process.env.BACKUP_ENABLED !== 'false',
  s3: {
    endpoint: process.env.BACKUP_S3_ENDPOINT || '',
    region: process.env.BACKUP_S3_REGION || 'auto',
    bucket: process.env.BACKUP_S3_BUCKET || '',
    accessKeyId: process.env.BACKUP_S3_ACCESS_KEY || '',
    secretAccessKey: process.env.BACKUP_S3_SECRET_KEY || '',
    prefix: process.env.BACKUP_S3_PREFIX || 'mdpreview/backups'
  }
}

export function isS3Configured() {
  return Boolean(
    config.s3.bucket && config.s3.accessKeyId && config.s3.secretAccessKey
  )
}
