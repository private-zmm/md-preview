<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  folderName: { type: String, default: '' },
  folderPath: { type: String, default: '' },
  files: { type: Array, default: () => [] },
  sourcePath: { type: String, default: '' },
  initialPath: { type: String, default: '' }
})

const emit = defineEmits(['confirm', 'cancel'])
const selectedPath = ref('')
const expandedPaths = ref(new Set())

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/\/$/, '').toLocaleLowerCase()
}

function isSameOrChildPath(parentPath, childPath) {
  const parent = normalizePath(parentPath)
  const child = normalizePath(childPath)
  return Boolean(parent && child && (parent === child || child.startsWith(`${parent}/`)))
}

function joinPath(basePath, name) {
  return `${String(basePath || '').replace(/[\\/]$/, '')}\\${name}`
}

function createNode(name, path, parentPath = '') {
  return { type: 'directory', name, path, parentPath, children: [], directories: new Map() }
}

function ensureDirectory(root, parts) {
  let current = root
  parts.forEach((part) => {
    if (!current.directories.has(part)) {
      const node = createNode(part, joinPath(current.path, part), current.path)
      current.directories.set(part, node)
      current.children.push(node)
    }
    current = current.directories.get(part)
  })
  return current
}

const directoryTree = computed(() => {
  const root = createNode(props.folderPath === 'server://workspace' ? '服务器根目录' : props.folderName || '当前文件夹', props.folderPath)
  for (const file of props.files) {
    const relativePath = String(file.relativePath || file.fileName || file.filePath || '').replace(/\\/g, '/')
    const parts = relativePath.split('/').filter(Boolean)
    if (file.type === 'directory') {
      ensureDirectory(root, parts)
    } else {
      ensureDirectory(root, parts.slice(0, -1))
    }
  }

  function sortDirectories(node) {
    node.children.sort((left, right) => left.name.localeCompare(right.name))
    node.children.forEach(sortDirectories)
    return node.children
  }

  sortDirectories(root)
  return root
})

const visibleDirectories = computed(() => {
  const result = []
  const walk = (nodes, level = 0) => {
    for (const node of nodes) {
      result.push({ ...node, level })
      if (expandedPaths.value.has(node.path)) walk(node.children, level + 1)
    }
  }
  if (directoryTree.value) walk([directoryTree.value])
  return result
})

function isDisabled(node) {
  return node.path !== props.folderPath && isSameOrChildPath(props.sourcePath, node.path)
}

function toggle(node, event) {
  event.stopPropagation()
  const next = new Set(expandedPaths.value)
  if (next.has(node.path)) next.delete(node.path)
  else next.add(node.path)
  expandedPaths.value = next
}

function choose(node) {
  if (isDisabled(node)) return
  selectedPath.value = node.path
}

function reset() {
  selectedPath.value = props.initialPath || props.folderPath
  const next = new Set()
  const collect = (node) => {
    if (!node) return
    next.add(node.path)
    node.children.forEach(collect)
  }
  collect(directoryTree.value)
  expandedPaths.value = next
}

function confirm() {
  if (!selectedPath.value) return
  emit('confirm', selectedPath.value)
}

watch(() => props.open, (open) => {
  if (open) reset()
})
</script>

<template>
  <div v-if="open" class="dialog-backdrop" role="presentation" @click.self="emit('cancel')">
    <section class="folder-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="folderPickerTitle" tabindex="-1" @keydown.esc.prevent="emit('cancel')">
      <h2 id="folderPickerTitle">移动到目录</h2>
      <p class="folder-picker-hint">请选择目标文件夹</p>
      <div class="folder-picker-tree" role="tree">
        <button
          v-for="node in visibleDirectories"
          :key="node.path"
          class="folder-picker-row"
          :class="{ selected: normalizePath(node.path) === normalizePath(selectedPath), disabled: isDisabled(node) }"
          :style="{ paddingLeft: `${10 + node.level * 18}px` }"
          type="button"
          role="treeitem"
          :aria-selected="normalizePath(node.path) === normalizePath(selectedPath)"
          :disabled="isDisabled(node)"
          @click="choose(node)"
        >
          <svg class="tree-chevron" :class="{ expanded: expandedPaths.has(node.path) }" viewBox="0 0 16 16" aria-hidden="true" @click="toggle(node, $event)">
            <path d="m4 6 4 4 4-4"></path>
          </svg>
          <svg class="folder-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.5 6.5h6l2 2h9v9.8a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2z"></path>
            <path d="M3.5 8.5h17"></path>
          </svg>
          <span class="folder-directory-name">{{ node.name }}</span>
        </button>
        <div v-if="visibleDirectories.length === 0" class="folder-picker-empty">没有可用文件夹</div>
      </div>
      <div class="input-dialog-actions">
        <button class="dialog-button" type="button" @click="emit('cancel')">取消</button>
        <button class="dialog-button primary" type="button" :disabled="!selectedPath" @click="confirm">确定</button>
      </div>
    </section>
  </div>
</template>
