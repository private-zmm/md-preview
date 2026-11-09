import fs from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'
import { config } from './config.js'

const { Pool } = pg
export const pool = new Pool({ connectionString: config.databaseUrl })

export function query(text, values) {
  return pool.query(text, values)
}

export async function migrate() {
  const migrationPath = path.join(process.cwd(), 'server', 'migrations', '001_init.sql')
  const sql = await fs.readFile(migrationPath, 'utf8')
  await pool.query(sql)
}

export async function closeDatabase() {
  await pool.end()
}
