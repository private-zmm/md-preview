<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'toggle-menu',
  'close-menu',
  'create',
  'open',
  'open-folder',
  'open-remote-folder',
  'save',
  'save-as',
  'export',
  'settings'
])

const menuGroups = [
  [
    { label: '新建', shortcut: 'Ctrl+N', event: 'create' },
    { label: '打开...', shortcut: 'Ctrl+O', event: 'open' },
    { label: '打开文件夹...', shortcut: 'Ctrl+Shift+O', event: 'open-folder' },
    { label: '打开远程文件夹...', event: 'open-remote-folder' }
  ],
  [
    { label: '保存', shortcut: 'Ctrl+S', event: 'save' },
    { label: '另存为...', shortcut: 'Ctrl+Shift+S', event: 'save-as' }
  ]
]

function toggleMenu() {
  emit('toggle-menu')
}

function runMenuAction(eventName) {
  emit(eventName)
  emit('close-menu')
}

function runExport(format) {
  emit('export', format)
  emit('close-menu')
}
</script>

<template>
  <div class="popup-menu-wrap">
    <button
      class="menu-button menu-bar-button"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    >
      文件(F)
    </button>

    <div v-if="isOpen" class="file-popover" role="menu">
      <template v-for="(group, groupIndex) in menuGroups" :key="groupIndex">
        <div v-if="groupIndex > 0" class="file-menu-separator"></div>
        <button
          v-for="item in group"
          :key="item.event"
          class="file-menu-item"
          type="button"
          role="menuitem"
          @click="runMenuAction(item.event)"
        >
          <span>{{ item.label }}</span>
          <span class="file-menu-shortcut">{{ item.shortcut }}</span>
        </button>
      </template>
      <div class="file-menu-separator"></div>
      <div class="file-submenu-wrap">
        <button class="file-menu-item" type="button" role="menuitem" aria-haspopup="menu">
          <span>导出</span>
          <span class="file-menu-arrow">›</span>
        </button>
        <div class="file-submenu" role="menu" aria-label="导出格式">
          <button class="file-menu-item" type="button" role="menuitem" @click="runExport('pdf')">
            <span>PDF</span>
          </button>
          <button class="file-menu-item" type="button" role="menuitem" @click="runExport('html')">
            <span>HTML</span>
          </button>
          <button class="file-menu-item" type="button" role="menuitem" @click="runExport('png')">
            <span>图像 PNG</span>
          </button>
        </div>
      </div>
      <div class="file-menu-separator"></div>
      <button class="file-menu-item" type="button" role="menuitem" @click="runMenuAction('settings')">
        <span>设置...</span>
      </button>
    </div>
  </div>
</template>
