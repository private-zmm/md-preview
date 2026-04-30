import { computed, reactive } from 'vue'
import { sampleDocument } from '../constants/sampleDocument'
import { normalizeTheme } from '../constants/themes'

export function createInitialDocumentState() {
  return reactive({
    filePath: null,
    fileName: 'Untitled.md',
    content: sampleDocument,
    savedContent: sampleDocument,
    theme: normalizeTheme(localStorage.getItem('mdpreview-theme'))
  })
}

export function useDocumentState(state) {
  const isDirty = computed(() => state.content !== state.savedContent)
  const title = computed(() => `${isDirty.value ? '* ' : ''}${state.fileName} - MdPreview`)
  const wordCount = computed(() => `${state.content.length} 字`)

  function setDocument(documentState) {
    state.filePath = documentState.filePath || null
    state.fileName = documentState.fileName || 'Untitled.md'
    state.content = documentState.content ?? ''
    state.savedContent = state.content
  }

  function markSaved(fileState, savedContent = state.content) {
    state.filePath = fileState.filePath
    state.fileName = fileState.fileName
    state.savedContent = savedContent
  }

  return {
    isDirty,
    title,
    wordCount,
    setDocument,
    markSaved
  }
}
