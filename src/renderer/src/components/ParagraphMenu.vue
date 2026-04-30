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
    { label: '一级标题', shortcut: 'Ctrl+1', command: 'heading-1' },
    { label: '二级标题', shortcut: 'Ctrl+2', command: 'heading-2' },
    { label: '三级标题', shortcut: 'Ctrl+3', command: 'heading-3' },
    { label: '四级标题', shortcut: 'Ctrl+4', command: 'heading-4' },
    { label: '五级标题', shortcut: 'Ctrl+5', command: 'heading-5' },
    { label: '六级标题', shortcut: 'Ctrl+6', command: 'heading-6' }
  ],
  [{ label: '段落', shortcut: 'Ctrl+0', command: 'paragraph' }],
  [
    { label: '提升标题级别', shortcut: 'Ctrl+=', command: 'heading-up' },
    { label: '降低标题级别', shortcut: 'Ctrl+-', command: 'heading-down' }
  ],
  [
    { label: '引用', shortcut: 'Ctrl+Shift+Q', command: 'quote' },
    { label: '有序列表', shortcut: 'Ctrl+Shift+[', command: 'ordered-list' },
    { label: '无序列表', shortcut: 'Ctrl+Shift+]', command: 'unordered-list' },
    { label: '任务列表', shortcut: 'Ctrl+Shift+X', command: 'task-list' }
  ],
  [
    { label: '在上方插入段落', command: 'paragraph-before' },
    { label: '在下方插入段落', command: 'paragraph-after' }
  ],
  [
    {
      label: '表格',
      children: [
        { label: '插入表格', shortcut: 'Ctrl+T', command: 'table-insert' },
        { separator: true },
        { label: '上方插入行', command: 'table-row-before' },
        { label: '下方插入行', shortcut: 'Ctrl+Enter', command: 'table-row-after' },
        { separator: true },
        { label: '左侧插入列', command: 'table-column-before' },
        { label: '右侧插入列', command: 'table-column-after' },
        { separator: true },
        { label: '删除行', command: 'table-row-delete' },
        { label: '删除列', command: 'table-column-delete' },
        { separator: true },
        { label: '删除表格', command: 'table-delete' }
      ]
    },
    { label: '代码块', shortcut: 'Ctrl+Shift+K', command: 'code-block' },
    { label: '水平分割线', command: 'divider' }
  ]
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
      段落(P)
    </button>

    <div v-if="isOpen" class="editor-popover paragraph-popover" role="menu">
      <template v-for="(group, groupIndex) in menuGroups" :key="groupIndex">
        <div v-if="groupIndex > 0" class="file-menu-separator"></div>
        <div
          v-for="item in group"
          :key="item.command || item.label"
          class="paragraph-menu-row"
          :class="{ 'has-submenu': item.children }"
        >
          <button
            class="file-menu-item"
            type="button"
            role="menuitem"
            @mousedown.prevent
            @click="item.children ? null : runCommand(item.command)"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.children" class="file-menu-arrow">›</span>
            <span v-else class="file-menu-shortcut">{{ item.shortcut }}</span>
          </button>

          <div v-if="item.children" class="editor-submenu table-submenu" role="menu">
            <template
              v-for="(child, childIndex) in item.children"
              :key="child.command || child.label || `separator-${childIndex}`"
            >
              <div v-if="child.separator" class="file-menu-separator"></div>
              <button
                v-else
                class="file-menu-item"
                type="button"
                role="menuitem"
                @mousedown.prevent
                @click="runCommand(child.command)"
              >
                <span>{{ child.label }}</span>
                <span class="file-menu-shortcut">{{ child.shortcut }}</span>
              </button>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
