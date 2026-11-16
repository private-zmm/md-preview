<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  folderName: {
    type: String,
    default: ''
  },
  folderPath: {
    type: String,
    default: ''
  },
  files: {
    type: Array,
    default: () => []
  },
  searchResultPaths: {
    type: Array,
    default: null
  },
  activeFilePath: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['create-file', 'open-file', 'folder-action', 'resize-start', 'search'])
const expandedDirs = ref(new Set())
const rootExpanded = ref(true)
const searchQuery = ref('')
const sidebarLabel = 'Markdown 文件夹'
const showRoot = computed(() => Boolean(props.folderName && props.folderPath !== 'server://workspace'))
const footerName = computed(() => props.folderName || '当前文件')
const markdownFileCount = computed(() => props.files.filter((file) => file.type !== 'directory').length)
const fileTree = computed(() => buildFileTree(props.files))
const displayFileTree = computed(() => filterFileTree(fileTree.value, searchQuery.value, props.searchResultPaths))
const visibleFileNodes = computed(() => (rootExpanded.value ? flattenVisibleNodes(displayFileTree.value) : []))
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  file: null
})

const menuItems = [
  { label: '新建文件', action: 'new-file' },
  { label: '新建文件夹', action: 'new-folder' },
  { separator: true },
  { label: '重命名', action: 'rename', needsTarget: true },
  { label: '移动到目录…', action: 'move', needsTarget: true },
  { label: '创建副本', action: 'duplicate', needsTarget: true, needsMarkdown: true },
  { label: '删除', action: 'delete', needsTarget: true, danger: true },
  { separator: true },
  { label: '打开文件位置', action: 'show-location', needsTarget: true }
]

function normalizePathPart(part) {
  return String(part || '').replace(/\\/g, '/')
}

function joinPath(basePath, name) {
  if (!basePath) return name
  return `${basePath.replace(/[\\/]$/, '')}\\${name}`
}

function createDirNode(name, path, level, parentPath = '') {
  return {
    type: 'directory',
    name,
    path,
    parentPath,
    level,
    children: [],
    directories: new Map()
  }
}

function ensureDirectory(root, parts) {
  let current = root

  parts.forEach((part, index) => {
    if (!current.directories.has(part)) {
      current.directories.set(part, createDirNode(part, joinPath(current.path, part), index + 1, current.path))
      current.children.push(current.directories.get(part))
    }
    current = current.directories.get(part)
  })

  return current
}

function buildFileTree(files) {
  const root = createDirNode(props.folderName, props.folderPath, 0)

  for (const file of files) {
    const parts = normalizePathPart(file.relativePath || file.fileName).split('/').filter(Boolean)
    if (file.type === 'directory') {
      ensureDirectory(root, parts)
      continue
    }

    const current = ensureDirectory(root, parts.slice(0, -1))
    current.children.push({ type: 'file', file, level: parts.length - 1 })
  }

  function normalizeNode(node) {
    node.children.sort((left, right) => {
      if (left.type !== right.type) return left.type === 'directory' ? -1 : 1
      const leftName = left.type === 'directory' ? left.name : left.file.fileName
      const rightName = right.type === 'directory' ? right.name : right.file.fileName
      return leftName.localeCompare(rightName)
    })
    node.children.forEach((child) => child.type === 'directory' && normalizeNode(child))
    return node.children
  }

  return normalizeNode(root)
}

function filterFileTree(nodes, query, searchResultPaths = null) {
  const normalizedQuery = String(query || '').trim().toLocaleLowerCase()
  if (!normalizedQuery) return nodes
  const resultPaths = searchResultPaths instanceof Set
    ? searchResultPaths
    : Array.isArray(searchResultPaths)
      ? new Set(searchResultPaths)
      : null

  return nodes.reduce((matches, node) => {
    if (node.type === 'directory') {
      const children = filterFileTree(node.children, normalizedQuery, resultPaths ? [...resultPaths] : null)
      if (children.length > 0) matches.push({ ...node, children })
      return matches
    }

    const file = node.file
    const searchable = `${file.fileName || ''} ${file.relativePath || ''} ${file.searchText || ''} ${file.summary || ''}`.toLocaleLowerCase()
    const matchedByServerSearch = resultPaths ? resultPaths.has(file.filePath) : false
    if (matchedByServerSearch || (!resultPaths && searchable.includes(normalizedQuery))) matches.push(node)
    return matches
  }, [])
}

function flattenVisibleNodes(nodes) {
  const visibleNodes = []

  function walk(items) {
    for (const item of items) {
      visibleNodes.push(item)
      if (item.type === 'directory' && expandedDirs.value.has(item.path)) {
        walk(item.children)
      }
    }
  }

  walk(nodes)
  return visibleNodes
}

function isDirExpanded(path) {
  return expandedDirs.value.has(path)
}

function collectDirectoryPaths(nodes, predicate = () => true) {
  const paths = []

  function walk(items) {
    for (const item of items) {
      if (item.type !== 'directory') continue
      if (predicate(item)) paths.push(item.path)
      walk(item.children)
    }
  }

  walk(nodes)
  return paths
}

function toggleDir(node) {
  const nextExpandedDirs = new Set(expandedDirs.value)
  const isExpanded = nextExpandedDirs.has(node.path)

  for (const path of collectDirectoryPaths(displayFileTree.value, (item) => item.parentPath === node.parentPath || item.path.startsWith(`${node.path}\\`) || item.path.startsWith(`${node.path}/`))) {
    nextExpandedDirs.delete(path)
  }

  if (!isExpanded) nextExpandedDirs.add(node.path)
  expandedDirs.value = nextExpandedDirs
}

watch(
  displayFileTree,
  (nodes) => {
    const existingPaths = new Set(collectDirectoryPaths(nodes))
    const nextExpandedDirs = new Set([...expandedDirs.value].filter((path) => existingPaths.has(path)))
    if (searchQuery.value.trim() || nextExpandedDirs.size === 0) {
      existingPaths.forEach((path) => nextExpandedDirs.add(path))
    }
    expandedDirs.value = nextExpandedDirs
  },
  { immediate: true }
)

watch(
  () => props.folderPath,
  () => {
    rootExpanded.value = true
    searchQuery.value = ''
  }
)

watch(searchQuery, (query) => emit('search', query))

function closeContextMenu() {
  contextMenu.value.visible = false
}

function openContextMenu(event, file = null) {
  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: Math.min(event.clientX, window.innerWidth - 150),
    y: Math.min(event.clientY, window.innerHeight - 268),
    file
  }
}

function canRunMenuAction(item) {
  if (item.separator) return false
  if (item.needsTarget && !contextMenu.value.file) return false
  if (item.needsMarkdown && contextMenu.value.file?.type === 'directory') return false
  return true
}

function runMenuAction(item) {
  if (!canRunMenuAction(item)) return

  emit('folder-action', {
    action: item.action,
    file: contextMenu.value.file
  })
  closeContextMenu()
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeContextMenu()
}

function startResize(event) {
  if (event.button !== 0) return
  event.preventDefault()
  emit('resize-start', event)
}

onMounted(() => {
  window.addEventListener('pointerdown', closeContextMenu)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', closeContextMenu)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <aside class="file-sidebar" :aria-label="sidebarLabel">
    <header class="file-sidebar-header">
      <label class="file-sidebar-search">
        <svg class="file-sidebar-search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8"></circle>
          <path d="m16 16 5 5"></path>
        </svg>
        <input v-model="searchQuery" type="search" placeholder="搜索笔记、记事和画布..." aria-label="搜索文件" />
        <button v-if="searchQuery" class="file-sidebar-search-clear" type="button" aria-label="清除搜索" @click="searchQuery = ''">×</button>
      </label>

    </header>

    <div class="file-sidebar-list" @contextmenu="openContextMenu($event)">
      <button v-if="showRoot" class="folder-root" type="button" :title="folderPath || folderName" @click="rootExpanded = !rootExpanded">
        <svg class="tree-chevron" :class="{ expanded: rootExpanded }" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4 6 4 4 4-4"></path>
        </svg>
        <svg class="folder-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.5 6.5h6l2 2h9v9.8a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2z"></path>
          <path d="M3.5 8.5h17"></path>
        </svg>
        <span class="folder-directory-name">{{ folderName }}</span>
      </button>

      <div v-if="rootExpanded && visibleFileNodes.length === 0" class="empty-folder">{{ searchQuery ? '没有匹配的文件' : '没有 Markdown 文件' }}</div>

      <template v-else>
        <template v-for="node in visibleFileNodes" :key="node.type === 'directory' ? node.path : node.file.filePath">
          <button
            v-if="node.type === 'directory'"
            class="folder-directory"
            type="button"
            :title="node.path"
            :style="{ paddingLeft: `${14 + node.level * 14}px` }"
            @click="toggleDir(node)"
            @contextmenu.stop="openContextMenu($event, { type: 'directory', filePath: node.path, fileName: node.name })"
          >
            <svg class="tree-chevron" :class="{ expanded: isDirExpanded(node.path) }" viewBox="0 0 16 16" aria-hidden="true">
              <path d="m4 6 4 4 4-4"></path>
            </svg>
            <svg class="folder-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.5 6.5h6l2 2h9v9.8a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2z"></path>
              <path d="M3.5 8.5h17"></path>
            </svg>
            <span class="folder-directory-name">{{ node.name }}</span>
          </button>

          <button
            v-else
            class="folder-file"
            :class="{ active: node.file.filePath === activeFilePath }"
            type="button"
            :title="node.file.relativePath"
            :style="{ paddingLeft: `${42 + node.level * 14}px` }"
            @click="emit('open-file', node.file.filePath)"
            @contextmenu.stop="openContextMenu($event, node.file)"
          >
            <span class="folder-file-content">
              <svg class="file-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 3.5h7l4 4v13h-11z"></path>
                <path d="M13.5 3.5v4h4M9 12h6M9 16h6"></path>
              </svg>
              <span class="folder-file-title">
                <span class="folder-file-base">{{ node.file.baseName || node.file.fileName }}</span>
                <span class="folder-file-ext">{{ node.file.extension || '' }}</span>
              </span>
              <span class="folder-file-summary">{{ node.file.summary || node.file.relativePath }}</span>
            </span>
          </button>
        </template>
      </template>

      <div
        v-if="contextMenu.visible"
        class="folder-context-menu"
        :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
        role="menu"
        @pointerdown.stop
      >
        <template v-for="(item, index) in menuItems" :key="item.action || `separator-${index}`">
          <div v-if="item.separator" class="file-menu-separator"></div>
          <button
            v-else
            class="file-menu-item"
            :class="{ danger: item.danger }"
            type="button"
            role="menuitem"
            :disabled="!canRunMenuAction(item)"
            @click="runMenuAction(item)"
          >
            <span>{{ item.label }}</span>
          </button>
        </template>
      </div>
    </div>

    <footer class="file-sidebar-footer">
      <button class="folder-add" type="button" title="新建 Markdown 文件" @click="emit('create-file')">
        +
      </button>
      <span class="folder-footer-name">{{ footerName }}</span>
      <span class="folder-count">{{ markdownFileCount }}</span>
    </footer>

    <div class="file-sidebar-resize-handle" role="separator" aria-orientation="vertical" aria-label="调整侧栏宽度" @pointerdown="startResize"></div>
  </aside>
</template>
