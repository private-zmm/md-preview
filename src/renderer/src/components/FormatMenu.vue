<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['command', 'toggle-menu', 'close-menu'])

const menuGroups = [
  [
    { label: '加粗', shortcut: 'Ctrl+B', command: 'bold' },
    { label: '斜体', shortcut: 'Ctrl+I', command: 'italic' },
    { label: '下划线', shortcut: 'Ctrl+U', command: 'underline' },
    { label: '代码', shortcut: 'Ctrl+Shift+`', command: 'inline-code' }
  ],
  [
    { label: '删除线', shortcut: 'Alt+Shift+5', command: 'strike' },
    { label: '注释', command: 'comment' }
  ],
  [{ label: '超链接', shortcut: 'Ctrl+K', command: 'link' }],
  [{ label: '清除样式', shortcut: 'Ctrl+\\', command: 'clear-format' }]
]

function toggleMenu() {
  emit('toggle-menu')
}

function runCommand(command) {
  emit('command', command)
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
      @mousedown.prevent
      @click="toggleMenu"
    >
      格式(O)
    </button>

    <div v-if="isOpen" class="editor-popover format-popover" role="menu">
      <template v-for="(group, groupIndex) in menuGroups" :key="groupIndex">
        <div v-if="groupIndex > 0" class="file-menu-separator"></div>
        <button
          v-for="item in group"
          :key="item.command"
          class="file-menu-item"
          type="button"
          role="menuitem"
          @mousedown.prevent
          @click="runCommand(item.command)"
        >
          <span>{{ item.label }}</span>
          <span class="file-menu-shortcut">{{ item.shortcut }}</span>
        </button>
      </template>
    </div>
  </div>
</template>
