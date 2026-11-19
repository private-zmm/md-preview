<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  status: {
    type: String,
    required: true
  },
  stats: {
    type: String,
    required: true
  },
  outline: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-outline'])
const outlineVisible = ref(false)

function closeOutline() {
  outlineVisible.value = false
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeOutline()
}

onMounted(() => {
  window.addEventListener('pointerdown', closeOutline)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', closeOutline)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <footer class="statusbar">
    <span class="statusbar-message">{{ status }}</span>
    <div class="statusbar-actions">
      <div v-if="outline.length" class="statusbar-outline" @pointerdown.stop>
        <button class="editor-outline-toggle" type="button" :aria-expanded="outlineVisible" @click="outlineVisible = !outlineVisible">
          <span class="editor-outline-toggle-icon" aria-hidden="true">☷</span>
          <span>大纲</span>
        </button>
        <nav v-if="outlineVisible" class="editor-outline-panel" aria-label="文档大纲">
          <button
            v-for="item in outline"
            :key="item.id"
            class="editor-outline-item"
            :class="`level-${item.level}`"
            type="button"
            @click="emit('select-outline', item)"
          >
            {{ item.title }}
          </button>
        </nav>
      </div>
      <span>{{ stats }}</span>
    </div>
  </footer>
</template>
