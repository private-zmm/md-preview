<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Vditor from 'vditor'

const props = defineProps({
  historyKey: {
    type: [Number, String],
    required: true
  },
  filePath: {
    type: String,
    default: null
  },
  defaultFolderPath: {
    type: String,
    default: ''
  },
  imageSavePath: {
    type: String,
    default: 'images'
  },
  syncSettings: {
    type: Object,
    default: null
  },
  theme: {
    type: String,
    default: 'classic'
  }
})

const emit = defineEmits(['status', 'image-inserted'])
const model = defineModel({
  type: String,
  required: true
})

const api = window.mdPreview
const rootRef = ref(null)
let editor = null
let isApplyingExternalValue = false
let resolvingImagesToken = 0
let editorValueSnapshot = model.value

function toSerializable(value) {
  if (!value) return null
  return JSON.parse(JSON.stringify(value))
}

function getVditorTheme() {
  return props.theme === 'night' ? 'dark' : 'classic'
}

function getContentTheme() {
  return props.theme === 'night' ? 'dark' : 'light'
}

function syncEditorTheme() {
  editor?.setTheme(getVditorTheme(), getContentTheme(), props.theme === 'night' ? 'github-dark' : 'github')
}

function getAssetBasePath() {
  return props.filePath || props.defaultFolderPath || null
}

function collectPreviewImages() {
  return [
    ...new Set(
      [...(rootRef.value?.querySelectorAll('.vditor-reset img[src]') || [])]
        .map((image) => image.getAttribute('data-original-src') || image.getAttribute('src'))
        .filter(Boolean)
    )
  ]
}

async function resolvePreviewImages() {
  if (typeof api?.resolveAssetUrl !== 'function') return

  const token = ++resolvingImagesToken
  const sources = collectPreviewImages()
  if (sources.length === 0) return

  const assetMap = new Map()

  await Promise.all(
    sources.map(async (source) => {
      try {
        const resolved = await api.resolveAssetUrl(
          getAssetBasePath(),
          source,
          toSerializable(props.syncSettings)
        )
        assetMap.set(source, resolved)
      } catch {
        assetMap.set(source, source)
      }
    })
  )

  if (token !== resolvingImagesToken) return

  rootRef.value?.querySelectorAll('.vditor-reset img[src]').forEach((image) => {
    const original = image.getAttribute('data-original-src') || image.getAttribute('src')
    const resolved = assetMap.get(original)

    image.setAttribute('data-original-src', original)
    if (resolved && image.getAttribute('src') !== resolved) {
      image.setAttribute('src', resolved)
    }
  })
}

function scheduleResolvePreviewImages() {
  window.setTimeout(resolvePreviewImages, 80)
  window.setTimeout(resolvePreviewImages, 280)
}

function createUploadResponse(files, markdownPath) {
  const fileName = files?.[0]?.name || 'image.png'

  return JSON.stringify({
    code: 0,
    msg: '',
    data: {
      errFiles: [],
      succMap: {
        [fileName]: markdownPath
      }
    }
  })
}

async function saveImageFromClipboard() {
  if (typeof api?.saveClipboardImage !== 'function') {
    emit('status', '粘贴图片功能需要重启应用后生效')
    return null
  }

  const result = await api.saveClipboardImage({
    markdownFilePath: props.filePath || null,
    defaultFolderPath: props.defaultFolderPath || null,
    imageSavePath: props.imageSavePath || 'images',
    syncSettings: toSerializable(props.syncSettings)
  })

  if (result?.canceled) {
    if (result.reason === 'empty') emit('status', '剪贴板里没有可粘贴的图片')
    return null
  }

  if (result.cleanup) {
    emit('image-inserted', {
      ...result.cleanup,
      syncSettings: toSerializable(props.syncSettings)
    })
  }
  emit('status', `已插入图片 ${result.markdownPath}`)
  return result
}

async function handlePaste(event) {
  const hasImage = [...(event.clipboardData?.items || [])].some((item) =>
    item.type.startsWith('image/')
  )
  if (!hasImage) return

  event.preventDefault()

  try {
    const result = await saveImageFromClipboard()
    if (!result) return
    editor?.insertValue(`![image](${result.markdownPath})`)
  } catch (error) {
    emit('status', `插入图片失败：${error.message}`)
  }
}

async function uploadFiles(files) {
  try {
    const result = await saveImageFromClipboard()
    if (!result) return '未选择图片'
    editor?.insertValue(`![${files?.[0]?.name || 'image'}](${result.markdownPath})`)
    return null
  } catch (error) {
    emit('status', `插入图片失败：${error.message}`)
    return error.message
  }
}

function setEditorValue(value, clearStack = false) {
  if (!editor || editorValueSnapshot === value) return

  isApplyingExternalValue = true
  editor.setValue(value, clearStack)
  editorValueSnapshot = value
  scheduleResolvePreviewImages()
  nextTick(() => {
    isApplyingExternalValue = false
  })
}

function runCommand(command) {
  const commandMap = {
    paragraph: () => editor?.insertValue('\n'),
    'heading-1': () => editor?.insertValue('# '),
    'heading-2': () => editor?.insertValue('## '),
    'heading-3': () => editor?.insertValue('### '),
    'heading-4': () => editor?.insertValue('#### '),
    'heading-5': () => editor?.insertValue('##### '),
    'heading-6': () => editor?.insertValue('###### '),
    quote: () => editor?.insertValue('> '),
    'ordered-list': () => editor?.insertValue('1. '),
    'unordered-list': () => editor?.insertValue('- '),
    'task-list': () => editor?.insertValue('- [ ] '),
    'code-block': () => editor?.insertValue('\n```\n代码\n```\n'),
    divider: () => editor?.insertValue('\n---\n'),
    bold: () => editor?.insertValue('**文本**'),
    italic: () => editor?.insertValue('*文本*'),
    underline: () => editor?.insertValue('<u>文本</u>'),
    'inline-code': () => editor?.insertValue('`代码`'),
    strike: () => editor?.insertValue('~~文本~~'),
    comment: () => editor?.insertValue('<!-- 注释 -->'),
    link: () => editor?.insertValue('[链接文本](https://)'),
    'table-insert': () => editor?.insertValue('\n| 标题 | 标题 | 标题 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n')
  }

  commandMap[command]?.()
}

function normalizeHeadingText(value = '') {
  return String(value)
    .replace(/^#{1,6}\s+/, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function findHeadingElement(item) {
  const root = rootRef.value
  if (!root) return null

  const headings = [...root.querySelectorAll('.vditor-reset h1, .vditor-reset h2, .vditor-reset h3, .vditor-reset h4, .vditor-reset h5, .vditor-reset h6')]
  const byIndex = headings[item?.headingIndex]
  const expectedTitle = normalizeHeadingText(item?.title)

  if (byIndex && (!expectedTitle || normalizeHeadingText(byIndex.textContent) === expectedTitle)) {
    return byIndex
  }

  return headings.find((heading) => normalizeHeadingText(heading.textContent) === expectedTitle) || null
}

function scrollToOutline(item) {
  const heading = findHeadingElement(item)
  if (heading) {
    heading.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    return
  }

  scrollToLine(item?.lineIndex)
}

function scrollToLine(lineIndex = 0) {
  const line = Math.max(0, Number(lineIndex) || 0)
  const contentElement = rootRef.value?.querySelector('.vditor-ir, .vditor-wysiwyg, .vditor-sv')
  if (!contentElement) return

  const lineHeight = 30
  contentElement.scrollTo({
    top: Math.max(0, line * lineHeight - contentElement.clientHeight * 0.18),
    behavior: 'smooth'
  })
}

function getValue() {
  return editor?.getValue() ?? model.value
}

onMounted(() => {
  editor = new Vditor(rootRef.value, {
    value: model.value,
    mode: 'ir',
    lang: 'zh_CN',
    height: '100%',
    width: '100%',
    placeholder: '开始写作...',
    cache: {
      enable: false
    },
    counter: {
      enable: false
    },
    resize: {
      enable: false
    },
    toolbar: [],
    toolbarConfig: {
      hide: true
    },
    preview: {
      markdown: {
        toc: true,
        mark: true
      },
      hljs: {
        style: props.theme === 'night' ? 'github-dark' : 'github'
      }
    },
    upload: {
      accept: 'image/*',
      multiple: false,
      handler: uploadFiles,
      format: createUploadResponse
    },
    input(value) {
      if (isApplyingExternalValue) return
      editorValueSnapshot = value
      model.value = value
      scheduleResolvePreviewImages()
    },
    after() {
      syncEditorTheme()
      rootRef.value?.addEventListener('paste', handlePaste, true)
      scheduleResolvePreviewImages()
    }
  })
})

onBeforeUnmount(() => {
  rootRef.value?.removeEventListener('paste', handlePaste, true)
  editor?.destroy()
  editor = null
})

watch(
  () => props.historyKey,
  () => setEditorValue(model.value, true),
  { flush: 'post' }
)

watch(
  () => model.value,
  (value) => setEditorValue(value),
  { flush: 'post' }
)

watch(
  () => props.theme,
  () => syncEditorTheme()
)

watch(
  () => [props.filePath, props.defaultFolderPath, JSON.stringify(props.syncSettings)],
  () => scheduleResolvePreviewImages()
)

defineExpose({
  getValue,
  runCommand,
  scrollToOutline,
  scrollToLine
})
</script>

<template>
  <div class="pane editor-pane vditor-editor-pane">
    <div ref="rootRef" class="vditor-editor"></div>
  </div>
</template>
