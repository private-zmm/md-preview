<script setup>
import FileMenu from './FileMenu.vue'
import ParagraphMenu from './ParagraphMenu.vue'
import FormatMenu from './FormatMenu.vue'
import ThemeMenu from './ThemeMenu.vue'

defineProps({
  isDirty: {
    type: Boolean,
    required: true
  },
  view: {
    type: String,
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
  'update:view',
  'update:theme'
])
</script>

<template>
  <header class="topbar">
    <nav class="menu-actions" aria-label="应用菜单">
      <FileMenu
        @create="emit('create')"
        @open="emit('open')"
        @open-folder="emit('open-folder')"
        @open-remote-folder="emit('open-remote-folder')"
        @save="emit('save')"
        @save-as="emit('save-as')"
        @export="emit('export', $event)"
        @settings="emit('settings')"
      />
      <ParagraphMenu @command="emit('paragraph-command', $event)" />
      <FormatMenu @command="emit('format-command', $event)" />
      <ThemeMenu :theme="theme" @update:theme="emit('update:theme', $event)" />
      <span class="dirty-dot" :class="{ 'is-visible': isDirty }" aria-hidden="true"></span>
    </nav>

    <nav class="actions" aria-label="视图操作">
      <div class="segmented" role="group" aria-label="视图切换">
        <button
          v-for="viewMode in ['source', 'split', 'preview']"
          :key="viewMode"
          class="segment"
          :class="{ active: view === viewMode }"
          type="button"
          @click="emit('update:view', viewMode)"
        >
          {{ { source: '源码', split: '分屏', preview: '预览' }[viewMode] }}
        </button>
      </div>
    </nav>
  </header>
</template>
