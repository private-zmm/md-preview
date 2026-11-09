import { migrate, closeDatabase } from './db.js'

try {
  await migrate()
  console.log('Database migration completed')
} finally {
  await closeDatabase()
}
