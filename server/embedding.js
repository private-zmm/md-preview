import crypto from 'node:crypto'
import { config } from './config.js'
import { query } from './db.js'

function splitContent(content, maxLength = 2400) {
  const paragraphs = String(content || '').split(/\n\s*\n/)
  const chunks = []
  let current = ''

  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph
    if (next.length > maxLength && current) {
      chunks.push(current)
      current = paragraph
    } else {
      current = next
    }
  }
  if (current.trim()) chunks.push(current)
  return chunks
}

async function requestEmbeddings(inputs) {
  if (!config.embeddingApiKey) throw new Error('未配置 EMBEDDING_API_KEY')
  const endpoint = `${config.embeddingBaseUrl.replace(/\/$/, '')}/embeddings`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${config.embeddingApiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ model: config.embeddingModel, input: inputs })
  })
  if (!response.ok) throw new Error(`Embedding API 返回 ${response.status}: ${await response.text()}`)
  const payload = await response.json()
  return payload.data.map((item) => item.embedding)
}

export async function generateDocumentEmbedding(documentId) {
  const documentResult = await query('SELECT * FROM documents WHERE id = $1', [documentId])
  const document = documentResult.rows[0]
  if (!document) throw new Error('文档不存在')

  const jobId = crypto.randomUUID()
  await query('INSERT INTO embedding_jobs (id, document_id, status) VALUES ($1, $2, $3)', [jobId, documentId, 'running'])

  try {
    const fs = await import('node:fs/promises')
    const content = await fs.readFile(document.content_path, 'utf8')
    const chunks = splitContent(content)
    const vectors = await requestEmbeddings(chunks)

    await query('DELETE FROM document_chunks WHERE document_id = $1', [documentId])
    for (let index = 0; index < chunks.length; index += 1) {
      if (vectors[index].length !== config.embeddingDimensions) {
        throw new Error(`Embedding 维度为 ${vectors[index].length}，当前配置要求 ${config.embeddingDimensions}`)
      }
      await query(
        `INSERT INTO document_chunks (id, document_id, chunk_index, content, embedding, embedding_model)
         VALUES ($1, $2, $3, $4, $5::vector, $6)`,
        [crypto.randomUUID(), documentId, index, chunks[index], JSON.stringify(vectors[index]), config.embeddingModel]
      )
    }
    await query('UPDATE embedding_jobs SET status = $1, finished_at = NOW() WHERE id = $2', ['completed', jobId])
    return { jobId, chunks: chunks.length }
  } catch (error) {
    await query('UPDATE embedding_jobs SET status = $1, error_message = $2, finished_at = NOW() WHERE id = $3', [
      'failed',
      error.message,
      jobId
    ])
    throw error
  }
}

export function queueDocumentEmbedding(documentId) {
  if (!config.embeddingApiKey) return
  setImmediate(() => generateDocumentEmbedding(documentId).catch((error) => console.error('Embedding failed:', error.message)))
}

export { splitContent }
