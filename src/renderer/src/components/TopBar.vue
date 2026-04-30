<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import FileMenu from './FileMenu.vue'
import ParagraphMenu from './ParagraphMenu.vue'
import FormatMenu from './FormatMenu.vue'
import ThemeMenu from './ThemeMenu.vue'

defineProps({
  isDirty: {
    type: Boolean,
    required: true
  },
  theme: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'create',
  'open',
  'open-folder',
  'open-remote-folder',
  'save',
  'save-as',
  'export',
  'settings',
  'paragraph-command',
  'format-command',
  'update:theme'
])

const activeMenu = ref(null)
const menuActionsRef = ref(null)

function toggleMenu(menuName) {
  activeMenu.value = activeMenu.value === menuName ? null : menuName
}

function closeMenus() {
  activeMenu.value = null
}

function handleWindowPointerDown(event) {
  if (menuActionsRef.value?.contains(event.target)) return
  closeMenus()
}

function handleWindowKeydown(event) {
  if (event.key === 'Escape') closeMenus()
}

onMounted(() => {
  window.addEventListener('pointerdown', handleWindowPointerDown)
  window.addEventListener('keydown', handleWindowKeydown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', handleWindowPointerDown)
  window.removeEventListener('keydown', handleWindowKeydown)
})
</script>

<template>
  <header class="topbar">
    <nav ref="menuActionsRef" class="menu-actions" aria-label="应用菜单">
      <FileMenu
        :is-open="activeMenu === 'file'"
        @toggle-menu="toggleMenu('file')"
        @close-menu="closeMenus"
        @create="emit('create')"
        @open="emit('open')"
        @open-folder="emit('open-folder')"
        @open-remote-folder="emit('open-remote-folder')"
        @save="emit('save')"
        @save-as="emit('save-as')"
        @export="emit('export', $event)"
        @settings="emit('settings')"
      />
      <ParagraphMenu
        :is-open="activeMenu === 'paragraph'"
        @toggle-menu="toggleMenu('paragraph')"
        @close-menu="closeMenus"
        @command="emit('paragraph-command', $event)"
      />
      <FormatMenu
        :is-open="activeMenu === 'format'"
        @toggle-menu="toggleMenu('format')"
        @close-menu="closeMenus"
        @command="emit('format-command', $event)"
      />
      <ThemeMenu
        :is-open="activeMenu === 'theme'"
        :theme="theme"
        @toggle-menu="toggleMenu('theme')"
        @close-menu="closeMenus"
        @update:theme="emit('update:theme', $event)"
      />
      <span class="dirty-dot" :class="{ 'is-visible': isDirty }" aria-hidden="true"></span>
    </nav>

    <nav class="actions" aria-label="窗口操作"></nav>
  </header>
</template>
