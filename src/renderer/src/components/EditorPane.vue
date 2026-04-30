<script setup>
import { computed, ref, watch } from 'vue'

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
  }
})

const emit = defineEmits(['status', 'image-inserted'])

const model = defineModel({
  type: String,
  required: true
})

const api = window.mdPreview

const textareaRef = ref(null)
const history = ref([])
const historyIndex = ref(-1)
const maxHistorySize = 160
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)
const lastSelection = ref({
  start: model.value.length,
  end: model.value.length
})

resetHistory(model.value)

function focusEditor() {
  textareaRef.value?.focus()
}

function normalizeSelection(range) {
  const start = Math.max(0, Math.min(range.start, model.value.length))
  const end = Math.max(start, Math.min(range.end, model.value.length))

  return { start, end }
}

function rememberSelection() {
  const textarea = textareaRef.value
  if (!textarea) return lastSelection.value

  lastSelection.value = normalizeSelection({
    start: textarea.selectionStart,
    end: textarea.selectionEnd
  })

  return lastSelection.value
}

function restoreLastSelection() {
  const textarea = textareaRef.value
  if (!textarea) return

  const range = normalizeSelection(lastSelection.value)
  textarea.focus({ preventScroll: true })
  textarea.selectionStart = range.start
  textarea.selectionEnd = range.end
  lastSelection.value = range
}

function getSelectionRange() {
  const textarea = textareaRef.value
  if (textarea && document.activeElement === textarea) return rememberSelection()

  return normalizeSelection(lastSelection.value)
}

function createSnapshot(content = model.value, selectionStart, selectionEnd) {
  const range =
    typeof selectionStart === 'number' && typeof selectionEnd === 'number'
      ? { start: selectionStart, end: selectionEnd }
      : getSelectionRange()

  return {
    content,
    selectionStart: range.start,
    selectionEnd: range.end
  }
}

function resetHistory(content) {
  const cursor = content.length
  lastSelection.value = {
    start: cursor,
    end: cursor
  }
  history.value = [
    {
      content,
      selectionStart: cursor,
      selectionEnd: cursor
    }
  ]
  historyIndex.value = 0
}

function pushHistory(content, selectionStart, selectionEnd) {
  const snapshot = createSnapshot(content, selectionStart, selectionEnd)
  const current = history.value[historyIndex.value]

  if (current?.content === snapshot.content) {
    history.value[historyIndex.value] = snapshot
    return
  }

  const nextHistory = history.value.slice(0, historyIndex.value + 1)
  nextHistory.push(snapshot)

  if (nextHistory.length > maxHistorySize) {
    nextHistory.shift()
  }

  history.value = nextHistory
  historyIndex.value = nextHistory.length - 1
}

function setEditorSelection(selectionStart, selectionEnd) {
  lastSelection.value = normalizeSelection({
    start: selectionStart,
    end: selectionEnd
  })

  requestAnimationFrame(() => {
    if (!textareaRef.value) return
    textareaRef.value.selectionStart = selectionStart
    textareaRef.value.selectionEnd = selectionEnd
    focusEditor()
  })
}

function commitEditorValue(nextValue, selectionStart, selectionEnd) {
  model.value = nextValue
  pushHistory(nextValue, selectionStart, selectionEnd)
  setEditorSelection(selectionStart, selectionEnd)
}

function replaceSelection(nextValue, selectionStart, selectionEnd) {
  commitEditorValue(nextValue, selectionStart, selectionEnd)
}

function wrapSelection(before, after = before, placeholder = '文本') {
  const { start, end } = getSelectionRange()
  const selected = model.value.slice(start, end) || placeholder
  const inserted = `${before}${selected}${after}`
  const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`
  const selectedStart = start + before.length
  const selectedEnd = selectedStart + selected.length

  replaceSelection(nextValue, selectedStart, selectedEnd)
}

function updateSelectedLines(transformLine) {
  const { start, end } = getSelectionRange()
  const { lineStart, lineEnd } = getLineBounds(start, end)
  const block = model.value.slice(lineStart, lineEnd)
  const nextBlock = block
    .split('\n')
    .map((line) => transformLine(line))
    .join('\n')

  replaceSelection(
    `${model.value.slice(0, lineStart)}${nextBlock}${model.value.slice(lineEnd)}`,
    lineStart,
    lineStart + nextBlock.length
  )
}

function getLineBounds(start, end) {
  const lineStart = model.value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const nextBreak = model.value.indexOf('\n', end)
  const lineEnd = nextBreak === -1 ? model.value.length : nextBreak

  return { lineStart, lineEnd }
}

function setHeadingLevel(level) {
  updateSelectedLines((line) => {
    const cleanLine = stripBlockMarker(line)
    return level > 0 ? `${'#'.repeat(level)} ${cleanLine || '标题'}` : cleanLine
  })
}

function adjustHeadingLevel(offset) {
  updateSelectedLines((line) => {
    const match = /^(#{1,6})\s+(.*)$/.exec(line)
    const nextLevel = Math.min(6, Math.max(1, (match?.[1].length || 0) + offset))
    const text = match?.[2] || line || '标题'

    return `${'#'.repeat(nextLevel)} ${text}`
  })
}

function stripBlockMarker(line) {
  return line
    .replace(/^#{1,6}\s+/, '')
    .replace(/^>\s?/, '')
    .replace(/^[-*+]\s+\[[ xX]\]\s+/, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
}

function prefixLines(prefix, placeholder) {
  updateSelectedLines((line) => {
    const cleanLine = stripBlockMarker(line)
    return `${prefix}${cleanLine || placeholder}`
  })
}

function insertLink() {
  const { start, end } = getSelectionRange()
  const selected = model.value.slice(start, end) || '链接文本'
  const inserted = `[${selected}](https://)`
  const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`
  const urlStart = start + selected.length + 3

  replaceSelection(nextValue, urlStart, urlStart + 8)
}

function insertPlainText(text) {
  const { start, end } = getSelectionRange()
  const nextValue = `${model.value.slice(0, start)}${text}${model.value.slice(end)}`
  const nextCursor = start + text.length

  replaceSelection(nextValue, nextCursor, nextCursor)
}

function insertCode() {
  const { start, end } = getSelectionRange()
  const selected = model.value.slice(start, end)

  if (selected.includes('\n')) {
    const inserted = `\n\`\`\`\n${selected || '代码'}\n\`\`\`\n`
    replaceSelection(
      `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`,
      start + 5,
      start + 5 + (selected || '代码').length
    )
    return
  }

  wrapSelection('`', '`', '代码')
}

function insertCodeBlock() {
  const { start, end } = getSelectionRange()
  const selected = model.value.slice(start, end) || '代码'
  const inserted = `\n\`\`\`\n${selected}\n\`\`\`\n`

  replaceSelection(
    `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`,
    start + 5,
    start + 5 + selected.length
  )
}

function insertDivider() {
  const { start, end } = getSelectionRange()
  const inserted = `${start > 0 ? '\n\n' : ''}---\n\n`
  const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`
  const nextCursor = start + inserted.length

  replaceSelection(nextValue, nextCursor, nextCursor)
}

function insertBlankLine() {
  const { start, end } = getSelectionRange()
  const inserted = `${start > 0 ? '\n' : ''}\n`
  const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`
  const nextCursor = start + inserted.length

  replaceSelection(nextValue, nextCursor, nextCursor)
}

function getCursorLineIndex(start) {
  return model.value.slice(0, start).split('\n').length - 1
}

function isTableLine(line) {
  return line.includes('|')
}

function isTableSeparatorLine(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function splitTableLine(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return trimmed.split('|').map((cell) => cell.trim())
}

function formatTableRow(cells) {
  return `| ${cells.join(' | ')} |`
}

function createSeparatorRow(count) {
  return formatTableRow(Array.from({ length: count }, () => '---'))
}

function findTableBlock() {
  const range = getSelectionRange()
  const lines = model.value.split('\n')
  const lineIndex = getCursorLineIndex(range.start)

  if (!isTableLine(lines[lineIndex] || '')) return null

  let start = lineIndex
  let end = lineIndex

  while (start > 0 && isTableLine(lines[start - 1])) start -= 1
  while (end < lines.length - 1 && isTableLine(lines[end + 1])) end += 1

  const block = lines.slice(start, end + 1)
  const separatorIndex = block.findIndex(isTableSeparatorLine)
  if (separatorIndex === -1) return null

  const rowCells = block.map(splitTableLine)
  const columnCount = Math.max(...rowCells.map((cells) => cells.length), 1)
  const normalizedRows = rowCells.map((cells, index) => {
    const nextCells = cells.slice(0, columnCount)
    while (nextCells.length < columnCount) nextCells.push(index === separatorIndex ? '---' : '')
    return index === separatorIndex ? Array.from({ length: columnCount }, () => '---') : nextCells
  })

  return {
    lines,
    start,
    end,
    lineIndex,
    separatorIndex: start + separatorIndex,
    rows: normalizedRows,
    columnCount
  }
}

function replaceTableBlock(table, rows, cursorRowOffset = 0) {
  const nextLines = [...table.lines]
  nextLines.splice(table.start, table.end - table.start + 1, ...rows.map(formatTableRow))
  const nextValue = nextLines.join('\n')
  const targetLine = Math.min(table.start + cursorRowOffset, nextLines.length - 1)
  const selectionStart = nextLines.slice(0, targetLine).join('\n').length + (targetLine > 0 ? 1 : 0)

  commitEditorValue(nextValue, selectionStart, selectionStart)
}

function insertTable() {
  const { start, end } = getSelectionRange()
  const table = [
    '| 标题 | 标题 | 标题 |',
    '| --- | --- | --- |',
    '| 内容 | 内容 | 内容 |'
  ].join('\n')
  const prefix = start > 0 && model.value[start - 1] !== '\n' ? '\n\n' : ''
  const suffix = end < model.value.length && model.value[end] !== '\n' ? '\n\n' : '\n'
  const inserted = `${prefix}${table}${suffix}`
  const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`
  const cursor = start + prefix.length + table.length

  replaceSelection(nextValue, cursor, cursor)
}

function insertTableRow(position) {
  const table = findTableBlock()
  if (!table) {
    insertTable()
    return
  }

  const rows = table.rows.map((row) => [...row])
  const relativeLine = table.lineIndex - table.start
  const safeLine = table.lineIndex === table.separatorIndex ? table.separatorIndex + 1 : table.lineIndex
  const insertIndex =
    position === 'before' ? Math.max(0, safeLine - table.start) : Math.min(rows.length, safeLine - table.start + 1)

  rows.splice(insertIndex, 0, Array.from({ length: table.columnCount }, () => ''))
  replaceTableBlock(table, rows, insertIndex)
}

function insertTableColumn(position) {
  const table = findTableBlock()
  if (!table) {
    insertTable()
    return
  }

  const { start } = getSelectionRange()
  const currentLineStart = model.value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const beforeCursor = model.value.slice(currentLineStart, start)
  const currentColumn = Math.max(0, beforeCursor.split('|').length - 2)
  const insertIndex =
    position === 'before' ? currentColumn : Math.min(table.columnCount, currentColumn + 1)

  const rows = table.rows.map((row, index) => {
    const nextRow = [...row]
    nextRow.splice(insertIndex, 0, table.start + index === table.separatorIndex ? '---' : '')
    return nextRow
  })

  replaceTableBlock(table, rows, table.lineIndex - table.start)
}

function deleteTableRow() {
  const table = findTableBlock()
  if (!table) return

  const relativeLine = table.lineIndex - table.start
  if (table.lineIndex === table.separatorIndex || table.rows.length <= 3) return

  const rows = table.rows.filter((_row, index) => index !== relativeLine)
  replaceTableBlock(table, rows, Math.min(relativeLine, rows.length - 1))
}

function deleteTableColumn() {
  const table = findTableBlock()
  if (!table || table.columnCount <= 1) return

  const { start } = getSelectionRange()
  const currentLineStart = model.value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const beforeCursor = model.value.slice(currentLineStart, start)
  const columnIndex = Math.max(0, Math.min(table.columnCount - 1, beforeCursor.split('|').length - 2))
  const rows = table.rows.map((row) => row.filter((_cell, index) => index !== columnIndex))

  replaceTableBlock(table, rows, table.lineIndex - table.start)
}

function deleteTable() {
  const table = findTableBlock()
  if (!table) return

  const nextLines = [...table.lines]
  nextLines.splice(table.start, table.end - table.start + 1)
  const nextValue = nextLines.join('\n')
  const targetLine = Math.min(table.start, nextLines.length - 1)
  const selectionStart =
    targetLine >= 0 ? nextLines.slice(0, targetLine).join('\n').length + (targetLine > 0 ? 1 : 0) : 0

  commitEditorValue(nextValue, selectionStart, selectionStart)
}

function insertParagraphBefore() {
  const { start, end } = getSelectionRange()
  const { lineStart } = getLineBounds(start, end)
  const inserted = '\n'
  const nextCursor = lineStart

  replaceSelection(
    `${model.value.slice(0, lineStart)}${inserted}${model.value.slice(lineStart)}`,
    nextCursor,
    nextCursor
  )
}

function insertParagraphAfter() {
  const { start, end } = getSelectionRange()
  const { lineEnd } = getLineBounds(start, end)
  const inserted = '\n'
  const nextCursor = lineEnd + inserted.length

  replaceSelection(
    `${model.value.slice(0, lineEnd)}${inserted}${model.value.slice(lineEnd)}`,
    nextCursor,
    nextCursor
  )
}

function insertComment() {
  const { start, end } = getSelectionRange()
  const selected = model.value.slice(start, end) || '注释'
  const inserted = `<!-- ${selected} -->`

  replaceSelection(
    `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`,
    start + 5,
    start + 5 + selected.length
  )
}

function clearFormat() {
  const { start, end } = getSelectionRange()
  const selected = model.value.slice(start, end)
  if (!selected) return

  const nextText = selected
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<u>(.*?)<\/u>/g, '$1')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')

  replaceSelection(
    `${model.value.slice(0, start)}${nextText}${model.value.slice(end)}`,
    start,
    start + nextText.length
  )
}

function runCommand(command) {
  restoreLastSelection()

  if (/^heading-[1-6]$/.test(command)) {
    setHeadingLevel(Number(command.at(-1)))
    return
  }

  const commandMap = {
    paragraph: () => setHeadingLevel(0),
    'heading-up': () => adjustHeadingLevel(-1),
    'heading-down': () => adjustHeadingLevel(1),
    quote: () => prefixLines('> ', '引用'),
    'ordered-list': () => prefixLines('1. ', '列表项'),
    'unordered-list': () => prefixLines('- ', '列表项'),
    'task-list': () => prefixLines('- [ ] ', '任务'),
    'paragraph-before': insertParagraphBefore,
    'paragraph-after': insertParagraphAfter,
    'table-insert': insertTable,
    'table-row-before': () => insertTableRow('before'),
    'table-row-after': () => insertTableRow('after'),
    'table-column-before': () => insertTableColumn('before'),
    'table-column-after': () => insertTableColumn('after'),
    'table-row-delete': deleteTableRow,
    'table-column-delete': deleteTableColumn,
    'table-delete': deleteTable,
    'code-block': insertCodeBlock,
    divider: insertDivider,
    bold: () => wrapSelection('**'),
    italic: () => wrapSelection('*'),
    underline: () => wrapSelection('<u>', '</u>'),
    'inline-code': insertCode,
    strike: () => wrapSelection('~~'),
    comment: insertComment,
    link: insertLink,
    'clear-format': clearFormat
  }

  commandMap[command]?.()
}

function handleTab(event) {
  event.preventDefault()

  const textarea = event.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const nextValue = `${model.value.slice(0, start)}  ${model.value.slice(end)}`
  const nextCursor = start + 2

  commitEditorValue(nextValue, nextCursor, nextCursor)
}

function restoreHistory(targetIndex) {
  const snapshot = history.value[targetIndex]
  if (!snapshot) return

  historyIndex.value = targetIndex
  model.value = snapshot.content
  setEditorSelection(snapshot.selectionStart, snapshot.selectionEnd)
}

function undoEdit() {
  if (historyIndex.value <= 0) return
  restoreHistory(historyIndex.value - 1)
}

function redoEdit() {
  if (historyIndex.value >= history.value.length - 1) return
  restoreHistory(historyIndex.value + 1)
}

function handleInput(event) {
  const textarea = event.target
  lastSelection.value = normalizeSelection({
    start: textarea.selectionStart,
    end: textarea.selectionEnd
  })
  commitEditorValue(textarea.value, textarea.selectionStart, textarea.selectionEnd)
}

function handleKeydown(event) {
  const key = event.key.toLowerCase()
  const isModifierPressed = event.ctrlKey || event.metaKey

  if (isModifierPressed && key === 'z') {
    event.preventDefault()
    if (event.shiftKey) redoEdit()
    else undoEdit()
    return
  }

  if (isModifierPressed && key === 'y') {
    event.preventDefault()
    redoEdit()
    return
  }

  if (isModifierPressed && /^[0-6]$/.test(key)) {
    event.preventDefault()
    setHeadingLevel(Number(key))
    return
  }

  if (isModifierPressed && key === 'b') {
    event.preventDefault()
    runCommand('bold')
    return
  }

  if (isModifierPressed && key === 'i') {
    event.preventDefault()
    runCommand('italic')
    return
  }

  if (isModifierPressed && key === 'u') {
    event.preventDefault()
    runCommand('underline')
    return
  }

  if (isModifierPressed && key === 'k' && !event.shiftKey) {
    event.preventDefault()
    runCommand('link')
    return
  }

  if (isModifierPressed && key === 't') {
    event.preventDefault()
    runCommand('table-insert')
    return
  }

  if (isModifierPressed && event.key === 'Enter') {
    event.preventDefault()
    runCommand('table-row-after')
    return
  }

  if (isModifierPressed && event.shiftKey && key === 'k') {
    event.preventDefault()
    runCommand('code-block')
    return
  }

  if (isModifierPressed && event.shiftKey && key === 'q') {
    event.preventDefault()
    runCommand('quote')
    return
  }

  if (isModifierPressed && event.shiftKey && event.code === 'BracketLeft') {
    event.preventDefault()
    runCommand('ordered-list')
    return
  }

  if (isModifierPressed && event.shiftKey && event.code === 'BracketRight') {
    event.preventDefault()
    runCommand('unordered-list')
    return
  }

  if (isModifierPressed && event.shiftKey && key === 'x') {
    event.preventDefault()
    runCommand('task-list')
    return
  }

  if (isModifierPressed && (key === '=' || key === '+')) {
    event.preventDefault()
    runCommand('heading-up')
    return
  }

  if (isModifierPressed && key === '-') {
    event.preventDefault()
    runCommand('heading-down')
    return
  }

  if (isModifierPressed && key === '\\') {
    event.preventDefault()
    runCommand('clear-format')
    return
  }

  if (event.altKey && event.shiftKey && key === '5') {
    event.preventDefault()
    runCommand('strike')
    return
  }

  if (isModifierPressed && event.shiftKey && event.code === 'Backquote') {
    event.preventDefault()
    runCommand('inline-code')
    return
  }

  if (event.key === 'Tab') {
    handleTab(event)
  }
}

function hasClipboardImage(event) {
  return [...(event.clipboardData?.items || [])].some((item) => item.type.startsWith('image/'))
}

function toSerializable(value) {
  if (!value) return null
  return JSON.parse(JSON.stringify(value))
}

async function handlePaste(event) {
  const text = event.clipboardData?.getData('text/plain')
  if (!hasClipboardImage(event) && text) return

  event.preventDefault()
  rememberSelection()

  if (typeof api?.saveClipboardImage !== 'function') {
    emit('status', '粘贴图片功能需要重启应用后生效')
    return
  }

  try {
    const result = await api.saveClipboardImage({
      markdownFilePath: props.filePath || null,
      defaultFolderPath: props.defaultFolderPath || null,
      imageSavePath: props.imageSavePath || 'images',
      syncSettings: toSerializable(props.syncSettings)
    })

    if (result?.canceled) {
      if (result.reason === 'empty') emit('status', '剪贴板里没有可粘贴的图片')
      return
    }

    insertPlainText(`![image](${result.markdownPath})`)
    if (result.cleanup) {
      emit('image-inserted', {
        ...result.cleanup,
        syncSettings: toSerializable(props.syncSettings)
      })
    }
    emit('status', `已插入图片 ${result.markdownPath}`)
  } catch (error) {
    emit('status', `插入图片失败：${error.message}`)
  }
}

function scrollToLine(lineIndex = 0) {
  const textarea = textareaRef.value
  if (!textarea) return

  const lines = model.value.split('\n')
  const safeLineIndex = Math.max(0, Math.min(Number(lineIndex) || 0, lines.length - 1))
  const selectionStart =
    safeLineIndex === 0 ? 0 : lines.slice(0, safeLineIndex).join('\n').length + 1
  const lineHeight = Number.parseFloat(window.getComputedStyle(textarea).lineHeight) || 24
  const targetTop = Math.max(0, safeLineIndex * lineHeight - textarea.clientHeight * 0.18)

  lastSelection.value = {
    start: selectionStart,
    end: selectionStart
  }
  textarea.selectionStart = selectionStart
  textarea.selectionEnd = selectionStart
  textarea.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  })
}

watch(
  () => props.historyKey,
  () => {
    resetHistory(model.value)
  },
  { flush: 'post' }
)

defineExpose({
  runCommand,
  scrollToLine
})
</script>

<template>
  <div class="pane editor-pane">
    <textarea
      ref="textareaRef"
      :value="model"
      spellcheck="false"
      aria-label="Markdown 源码编辑器"
      @input="handleInput"
      @keydown="handleKeydown"
      @select="rememberSelection"
      @paste="handlePaste"
      @keyup="rememberSelection"
      @mouseup="rememberSelection"
      @focus="rememberSelection"
      @blur="rememberSelection"
    ></textarea>
  </div>
</template>
