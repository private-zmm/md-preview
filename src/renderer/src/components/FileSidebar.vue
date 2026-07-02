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
  outline: {
    type: Array,
    default: () => []
  },
  activeFilePath: {
    type: String,
    default: null
  },
  showFiles: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['create-file', 'open-file', 'folder-action', 'select-outline'])
const activeTab = ref(props.showFiles ? 'files' : 'outline')
const expandedDirs = ref(new Set())
const sidebarLabel = computed(() => (props.showFiles ? 'Markdown 文件夹' : 'Markdown 大纲'))
const footerName = computed(() => props.folderName || '当前文件')
const markdownFileCount = computed(() => props.files.filter((file) => file.type !== 'directory').length)
const fileTree = computed(() => buildFileTree(props.files))
const visibleFileNodes = computed(() => flattenVisibleNodes(fileTree.value))
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
  const separator = basePath.startsWith('webdav://') ? '/' : '\\'
  return `${basePath.replace(/[\\/]$/, '')}${separator}${name}`
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

  for (const path of collectDirectoryPaths(fileTree.value, (item) => item.parentPath === node.parentPath || item.path.startsWith(`${node.path}\\`) || item.path.startsWith(`${node.path}/`))) {
    nextExpandedDirs.delete(path)
  }

  if (!isExpanded) nextExpandedDirs.add(node.path)
  expandedDirs.value = nextExpandedDirs
}

watch(
  () => props.showFiles,
  (showFiles) => {
    activeTab.value = showFiles ? 'files' : 'outline'
  },
  { immediate: true }
)

watch(
  fileTree,
  (nodes) => {
    const existingPaths = new Set(collectDirectoryPaths(nodes))
    expandedDirs.value = new Set([...expandedDirs.value].filter((path) => existingPaths.has(path)))
  },
  { immediate: true }
)

function closeContextMenu() {
  contextMenu.value.visible = false
}

function openContextMenu(event, file = null) {
  if (activeTab.value !== 'files') return

  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: Math.min(event.clientX, window.innerWidth - 150),
    y: Math.min(event.clientY, window.innerHeight - 232),
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
  <aside class="file-sidebar" :class="{ 'outline-only': !showFiles }" :aria-label="sidebarLabel">
    <header class="file-sidebar-header">
      <button
        v-if="showFiles"
        class="file-sidebar-tab"
        :class="{ active: activeTab === 'files' }"
        type="button"
        @click="activeTab = 'files'"
      >
        文件
      </button>
      <button
        class="file-sidebar-tab"
        :class="{ active: activeTab === 'outline' }"
        type="button"
        @click="activeTab = 'outline'"
      >
        大纲
      </button>
    </header>

    <div v-if="activeTab === 'files'" class="file-sidebar-list" @contextmenu="openContextMenu($event)">
      <div v-if="visibleFileNodes.length === 0" class="empty-folder">没有 Markdown 文件</div>

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
            <span class="folder-directory-caret">{{ isDirExpanded(node.path) ? '▾' : '▸' }}</span>
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

    <div v-else class="outline-list">
      <div v-if="outline.length === 0" class="empty-folder">当前文件没有标题</div>

      <button
        v-for="item in outline"
        v-else
        :key="item.id"
        class="outline-item"
        :class="`level-${item.level}`"
        type="button"
        @click="emit('select-outline', item)"
      >
        {{ item.title }}
      </button>
    </div>

    <footer v-if="showFiles" class="file-sidebar-footer">
      <button class="folder-add" type="button" title="新建 Markdown 文件" @click="emit('create-file')">
        +
      </button>
      <span class="folder-footer-name">{{ footerName }}</span>
      <span class="folder-count">{{ markdownFileCount }}</span>
    </footer>
  </aside>
</template>
