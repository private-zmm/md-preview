import { ref } from 'vue'
import MarkdownIt from 'markdown-it'
import taskLists from 'markdown-it-task-lists'
import DOMPurify from 'dompurify'
import hljs from '@highlightjs/cdn-assets/es/highlight.min.js'

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    const canHighlight = language && hljs.getLanguage(language)

    if (canHighlight) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(code, { language }).value}</code></pre>`
      } catch {
        return ''
      }
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`
  }
}).use(taskLists, {
  enabled: true,
  label: true
})

const defaultImageRenderer =
  md.renderer.rules.image ||
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const srcIndex = tokens[idx].attrIndex('src')

  if (srcIndex >= 0) {
    const original = tokens[idx].attrs[srcIndex][1]
    const resolved = env.assetMap?.get(original)
    tokens[idx].attrSet('data-original-src', original)
    if (resolved) tokens[idx].attrs[srcIndex][1] = resolved
  }

  return defaultImageRenderer(tokens, idx, options, env, self)
}

function extractImageSources(markdown) {
  return [...markdown.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)].map(
    (match) => match[1]
  )
}

export function useMarkdownRenderer(api) {
  const html = ref('')
  let renderingToken = 0

  async function collectAssetMap(markdown, markdownFilePath, syncSettings) {
    const sources = [...new Set(extractImageSources(markdown))]
    const assetMap = new Map()

    await Promise.all(
      sources.map(async (source) => {
        try {
          const resolved = await api.resolveAssetUrl(markdownFilePath, source, syncSettings)
          assetMap.set(source, resolved)
        } catch {
          assetMap.set(source, source)
        }
      })
    )

    return assetMap
  }

  async function render(markdown, markdownFilePath, syncSettings = null) {
    const token = ++renderingToken
    const assetMap = await collectAssetMap(markdown, markdownFilePath, syncSettings)
    if (token !== renderingToken) return

    const unsafeHtml = md.render(markdown, { assetMap })
    html.value = DOMPurify.sanitize(unsafeHtml, {
      ADD_ATTR: ['target', 'rel', 'checked', 'data-original-src'],
      ALLOWED_URI_REGEXP:
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    })
  }

  return {
    html,
    render
  }
}
