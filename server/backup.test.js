import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { SourceTextModule, SyntheticModule } from 'node:vm'

// Use real temporary files, substituting the external database, commands and S3 service.
async function loadBackup(t, { commandError, uploadError, s3 = false, endpoint } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mdpreview-backup-test-'))
  assert.equal(path.dirname(root), path.resolve(os.tmpdir()))
  assert.ok(path.basename(root).startsWith('mdpreview-backup-test-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const config = {
    databaseUrl: 'postgresql://user:private-password@localhost/notes',
    dataDir: path.join(root, 'data'),
    tempDir: path.join(root, 'data', 'temp'),
    backupDir: path.join(root, 'backups'),
    s3: { endpoint, region: 'us-east-1', prefix: '/notes/backups/', bucket: 'notes', accessKeyId: 'test-key', secretAccessKey: 'private-secret' }
  }
  const records = []
  const uploads = []
  const commands = []
  const mocks = {
    './config.js': { config, isS3Configured: () => s3 },
    './db.js': { query: async (sql, values) => { records.push({ sql, values }); return { rows: [] } } },
    'node:child_process': {
      execFile: (command, args, callback) => {
        commands.push(command)
        if (commandError) return callback(commandError, '', commandError.stderr || '')
        const output = command === 'pg_dump' ? args[args.indexOf('--file') + 1] : args[1]
        fs.writeFile(output, command === 'pg_dump' ? 'database contents' : 'document and image contents')
          .then(() => callback(null, '', ''), callback)
      }
    },
    '@aws-sdk/client-s3': {
      PutObjectCommand: class { constructor(input) { this.input = input } },
      GetObjectCommand: class {},
      S3Client: class {
        destroy() {}
        async send(command) {
          // Consume the file stream even on error so tests do not leak open handles.
          for await (const chunk of command.input.Body) assert.ok(chunk.length)
          if (uploadError) throw uploadError
          uploads.push(command.input.Key)
        }
      }
    }
  }
  if (endpoint) delete mocks['@aws-sdk/client-s3']
  const module = new SourceTextModule(await fs.readFile(new URL('./backup.js', import.meta.url), 'utf8'))
  await module.link(async (specifier) => {
    const exports = mocks[specifier] || await import(specifier)
    const names = Object.keys(exports)
    return new SyntheticModule(names, function () {
      for (const name of names) this.setExport(name, exports[name])
    })
  })
  await module.evaluate()
  return { createBackup: module.namespace.createBackup, config, records, uploads, commands }
}

test('PostgreSQL version mismatch reports the cause and removes incomplete backup files', async (t) => {
  const commandError = Object.assign(new Error('command failed'), { stderr: 'pg_dump: error: aborting because of server version mismatch' })
  const backup = await loadBackup(t, { commandError })
  await assert.rejects(backup.createBackup(), /数据库备份失败：PostgreSQL 备份工具版本低于数据库版本/)
  assert.deepEqual(await fs.readdir(backup.config.backupDir), [])
  assert.equal(backup.records.length, 0)
})

test('command failure details do not expose the database URL', async (t) => {
  const commandError = new Error('Command failed: pg_dump --dbname postgresql://user:private-password@localhost/notes')
  const backup = await loadBackup(t, { commandError })
  await assert.rejects(backup.createBackup(), (error) => {
    assert.match(error.message, /数据库备份失败/)
    assert.ok(!error.message.includes('private-password'))
    return true
  })
})

test('local-only snapshot is not uploaded or marked uploaded even with S3 configured', async (t) => {
  const backup = await loadBackup(t, { s3: true })
  const result = await backup.createBackup({ upload: false })
  assert.equal(result.s3Prefix, null)
  assert.deepEqual(backup.uploads, [])
  assert.equal(backup.records[0].values[3], 'created')
  assert.deepEqual((await fs.readdir(result.localPath)).sort(), ['database.dump', 'files.tar.gz', 'manifest.json'])
  assert.deepEqual(backup.commands, ['pg_dump', 'tar'])
})

test('S3 failure retains a complete, recorded local backup and explains upload failure', async (t) => {
  const backup = await loadBackup(t, { s3: true, uploadError: new Error('AccessDenied: private-secret') })
  await assert.rejects(backup.createBackup(), (error) => {
    assert.match(error.message, /本地备份已保存，但上传 S3 失败.*AccessDenied/)
    assert.ok(!error.message.includes('private-secret'))
    return true
  })
  assert.equal(backup.records.length, 1)
  const [id, localPath, prefix, status] = backup.records[0].values
  assert.ok(id)
  assert.equal(prefix, null)
  assert.equal(status, 'created')
  assert.equal((await fs.readdir(localPath)).length, 3)
  assert.deepEqual(await fs.readdir(backup.config.backupDir), [id])
})

test('successful S3 backup uploads all three files before marking it uploaded', async (t) => {
  const backup = await loadBackup(t, { s3: true })
  const result = await backup.createBackup()
  assert.ok(result.s3Prefix.startsWith('notes/backups/'))
  assert.equal(backup.uploads.length, 3)
  assert.ok(backup.uploads.every((key) => key.startsWith(`${result.s3Prefix}/`)))
  assert.equal(backup.records.length, 2)
  assert.match(backup.records[1].sql, /status = 'uploaded'/)
})

test('real AWS SDK uploads plain file bodies to a compatible S3 endpoint without streaming trailers', async (t) => {
  const received = []
  const server = http.createServer(async (request, response) => {
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    const body = Buffer.concat(chunks)
    const unsupported = request.headers['content-encoding']?.includes('aws-chunked') ||
      request.headers['x-amz-trailer'] || request.headers['transfer-encoding'] ||
      Number(request.headers['content-length']) !== body.length
    received.push({ path: request.url, body, headers: request.headers, unsupported })
    response.writeHead(unsupported ? 501 : 200, { 'Content-Type': 'application/xml' })
    response.end(unsupported ? '<Error><Code>NotImplemented</Code><Message>Streaming trailers are unsupported</Message></Error>' : '')
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise((resolve) => {
    server.close(resolve)
    server.closeAllConnections()
  }))
  const endpoint = `http://127.0.0.1:${server.address().port}`
  const backup = await loadBackup(t, { s3: true, endpoint })
  const result = await backup.createBackup()
  assert.equal(received.length, 3)
  assert.ok(received.every((request) => !request.unsupported && request.path.startsWith(`/notes/${result.s3Prefix}/`)))
  assert.equal(received[0].body.toString(), 'database contents')
  assert.equal(received[1].body.toString(), 'document and image contents')
  assert.equal(JSON.parse(received[2].body.toString()).id, result.id)
  assert.match(backup.records[1].sql, /status = 'uploaded'/)
})
