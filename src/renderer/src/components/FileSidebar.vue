<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  folderName: {
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
const sidebarLabel = computed(() => (props.showFiles ? 'Markdown 文件夹' : 'Markdown 大纲'))
const footerName = computed(() => props.folderName || '当前文件')
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
  { label: '重命名', action: 'rename', needsFile: true },
  { label: '创建副本', action: 'duplicate', needsFile: true },
  { label: '删除', action: 'delete', needsFile: true, danger: true },
  { separator: true },
  { label: '打开文件位置', action: 'show-location', needsFile: true }
]

watch(
  () => props.showFiles,
  (showFiles) => {
    activeTab.value = showFiles ? 'files' : 'outline'
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

function runMenuAction(item) {
  if (item.separator || (item.needsFile && !contextMenu.value.file)) return

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
      <div v-if="files.length === 0" class="empty-folder">没有 Markdown 文件</div>

      <template v-else>
        <button
          v-for="file in files"
          :key="file.filePath"
          class="folder-file"
          :class="{ active: file.filePath === activeFilePath }"
          type="button"
          :title="file.relativePath"
          @click="emit('open-file', file.filePath)"
          @contextmenu.stop="openContextMenu($event, file)"
        >
          <span class="folder-file-title">
            <span class="folder-file-base">{{ file.baseName || file.fileName }}</span>
            <span class="folder-file-ext">{{ file.extension || '' }}</span>
          </span>
          <span class="folder-file-summary">{{ file.summary || file.relativePath }}</span>
        </button>
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
            :disabled="item.needsFile && !contextMenu.file"
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
      <span class="folder-count">{{ files.length }}</span>
    </footer>
  </aside>
</template>
