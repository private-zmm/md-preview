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

const api = window.mdPreviewBridge || window.mdPreview
const rootRef = ref(null)
const imageInputRef = ref(null)
const tableMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  isHeader: false,
  isSingleColumn: false
})
let editor = null
let isEditorReady = false
let isApplyingExternalValue = false
let resolvingImagesToken = 0
let editorValueSnapshot = model.value
let activeTable = null
let activeTableRow = null
let activeColumnIndex = -1

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

function getImageSaveOptions() {
  return {
    markdownFilePath: props.filePath || null,
    defaultFolderPath: props.defaultFolderPath || null,
    imageSavePath: props.imageSavePath || 'images',
    syncSettings: toSerializable(props.syncSettings)
  }
}

function registerSavedImage(result) {
  if (result.cleanup) {
    emit('image-inserted', {
      ...result.cleanup,
      syncSettings: toSerializable(props.syncSettings)
    })
  }
  emit('status', `已插入图片 ${result.markdownPath}`)
}

async function saveImageFromClipboard() {
  if (typeof api?.saveClipboardImage !== 'function') {
    emit('status', '粘贴图片功能需要重启应用后生效')
    return null
  }

  const result = await api.saveClipboardImage(getImageSaveOptions())

  if (result?.canceled) {
    if (result.reason === 'empty') emit('status', '剪贴板里没有可粘贴的图片')
    return null
  }

  registerSavedImage(result)
  return result
}

async function saveSelectedImage(file) {
  if (typeof api?.saveImageFile !== 'function') {
    emit('status', '选择图片功能需要重启应用后生效')
    return null
  }

  const result = await api.saveImageFile({
    ...getImageSaveOptions(),
    imageData: await file.arrayBuffer(),
    fileName: file.name,
    mimeType: file.type
  })

  if (result?.canceled) {
    if (result.reason === 'empty') emit('status', '图片文件为空')
    return null
  }

  registerSavedImage(result)
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
    const file = files?.[0]
    if (!file) return '未选择图片'
    if (!file.type.startsWith('image/')) return '请选择图片文件'

    const result = await saveSelectedImage(file)
    if (!result) return '图片未插入'
    editor?.insertValue(`![${file.name || 'image'}](${result.markdownPath})`)
    return null
  } catch (error) {
    emit('status', `插入图片失败：${error.message}`)
    return error.message
  }
}

function setEditorValue(value, clearStack = false) {
  if (!editor || !isEditorReady) return

  const nextValue = value ?? ''
  if (editorValueSnapshot === nextValue) return

  isApplyingExternalValue = true
  editor.setValue(nextValue, clearStack)
  editorValueSnapshot = nextValue
  scheduleResolvePreviewImages()
  nextTick(() => {
    isApplyingExternalValue = false
  })
}

function closeTableMenu() {
  tableMenu.value.visible = false
  activeTable = null
  activeTableRow = null
  activeColumnIndex = -1
}

function openTableMenu(event) {
  const target = event.target
  const cell = target instanceof Element ? target.closest('td, th') : null
  const table = cell?.closest('table')
  const row = cell?.parentElement

  if (!cell || !table || !row || !rootRef.value?.contains(table)) {
    closeTableMenu()
    return
  }

  const columnIndex = [...row.cells].indexOf(cell)
  if (columnIndex < 0) return

  event.preventDefault()
  activeTable = table
  activeTableRow = row
  activeColumnIndex = columnIndex
  tableMenu.value = {
    visible: true,
    x: Math.max(8, Math.min(event.clientX, window.innerWidth - 180)),
    y: Math.max(8, Math.min(event.clientY, window.innerHeight - 156)),
    isHeader: cell.tagName === 'TH',
    isSingleColumn: row.cells.length <= 1
  }
}

function chooseImage() {
  imageInputRef.value?.click()
}

async function handleImageFileChange(event) {
  const files = event.target.files
  if (!files?.length) return

  await uploadFiles(files)
  event.target.value = ''
}

function createBlankTableCell(tagName, sourceCell) {
  const cell = document.createElement(tagName)
  const align = sourceCell.getAttribute('align')

  if (align) cell.setAttribute('align', align)
  cell.textContent = ' '
  return cell
}

function syncTableContent() {
  const nextValue = editor?.getValue()
  if (nextValue == null) return

  closeTableMenu()
  setEditorValue(nextValue)
  model.value = nextValue
}

function insertTableRow() {
  const table = activeTable
  const row = activeTableRow
  if (!table || !row || !table.isConnected || !row.isConnected) return

  const referenceCells = [...(table.rows[0]?.cells || row.cells)]
  if (referenceCells.length === 0) return

  const nextRow = document.createElement('tr')
  referenceCells.forEach((cell) => {
    nextRow.appendChild(createBlankTableCell('td', cell))
  })

  if (row.parentElement?.tagName === 'TBODY') {
    row.insertAdjacentElement('afterend', nextRow)
  } else {
    const body = table.tBodies[0] || table.appendChild(document.createElement('tbody'))
    body.insertBefore(nextRow, body.firstChild)
  }

  syncTableContent()
}

function insertTableColumn() {
  const table = activeTable
  if (!table || !table.isConnected || activeColumnIndex < 0) return

  Array.from(table.rows).forEach((row) => {
    const cell = row.cells[activeColumnIndex]
    if (!cell) return

    cell.insertAdjacentElement('afterend', createBlankTableCell(cell.tagName.toLowerCase(), cell))
  })

  syncTableContent()
}

function deleteTableRow() {
  const row = activeTableRow
  if (!row || !row.isConnected || tableMenu.value.isHeader) return

  const body = row.parentElement
  row.remove()
  if (body?.tagName === 'TBODY' && body.rows.length === 0) body.remove()

  syncTableContent()
}

function deleteTableColumn() {
  const table = activeTable
  if (!table || !table.isConnected || activeColumnIndex < 0 || tableMenu.value.isSingleColumn) return

  Array.from(table.rows).forEach((row) => row.cells[activeColumnIndex]?.remove())
  syncTableContent()
}

function runTableMenuAction(action) {
  const actions = {
    'row-insert': insertTableRow,
    'column-insert': insertTableColumn,
    'row-delete': deleteTableRow,
    'column-delete': deleteTableColumn
  }

  actions[action]?.()
}

function handleTableMenuKeydown(event) {
  if (event.key === 'Escape') closeTableMenu()
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
    'image-insert': chooseImage,
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
    mode: 'wysiwyg',
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
      handler: uploadFiles
    },
    input(value) {
      if (isApplyingExternalValue) return
      editorValueSnapshot = value
      model.value = value
      scheduleResolvePreviewImages()
    },
    after() {
      isEditorReady = true
      syncEditorTheme()
      setEditorValue(model.value, true)
      rootRef.value?.addEventListener('paste', handlePaste, true)
      rootRef.value?.addEventListener('contextmenu', openTableMenu, true)
      window.addEventListener('pointerdown', closeTableMenu)
      window.addEventListener('keydown', handleTableMenuKeydown)
      scheduleResolvePreviewImages()
    }
  })
})

onBeforeUnmount(() => {
  rootRef.value?.removeEventListener('paste', handlePaste, true)
  rootRef.value?.removeEventListener('contextmenu', openTableMenu, true)
  window.removeEventListener('pointerdown', closeTableMenu)
  window.removeEventListener('keydown', handleTableMenuKeydown)
  editor?.destroy()
  editor = null
  isEditorReady = false
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
    <input
      ref="imageInputRef"
      type="file"
      accept="image/*"
      hidden
      @change="handleImageFileChange"
    />

    <div
      v-if="tableMenu.visible"
      class="table-context-menu"
      :style="{ left: `${tableMenu.x}px`, top: `${tableMenu.y}px` }"
      role="menu"
      @pointerdown.stop
    >
      <button class="file-menu-item" type="button" role="menuitem" @click="runTableMenuAction('row-insert')">
        <span>在下方新增一行</span>
      </button>
      <button class="file-menu-item" type="button" role="menuitem" @click="runTableMenuAction('column-insert')">
        <span>在右侧新增一列</span>
      </button>
      <div class="file-menu-separator"></div>
      <button
        class="file-menu-item danger"
        type="button"
        role="menuitem"
        :disabled="tableMenu.isHeader"
        @click="runTableMenuAction('row-delete')"
      >
        <span>删除当前行</span>
      </button>
      <button
        class="file-menu-item danger"
        type="button"
        role="menuitem"
        :disabled="tableMenu.isSingleColumn"
        @click="runTableMenuAction('column-delete')"
      >
        <span>删除当前列</span>
      </button>
    </div>
  </div>
</template>
