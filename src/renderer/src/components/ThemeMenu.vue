<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { themes } from '../constants/themes'

defineProps({
  theme: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:theme'])
const isOpen = ref(false)
const menuRef = ref(null)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function selectTheme(theme) {
  emit('update:theme', theme)
  isOpen.value = false
}

function handlePointerDown(event) {
  if (!isOpen.value || menuRef.value?.contains(event.target)) return
  isOpen.value = false
}

function handleKeydown(event) {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  window.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', handlePointerDown)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="menuRef" class="popup-menu-wrap">
    <button
      class="menu-button"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    >
      主题(T)
    </button>

    <div v-if="isOpen" class="theme-popover" role="menu">
      <button
        v-for="(label, value) in themes"
        :key="value"
        class="theme-option"
        type="button"
        role="menuitemradio"
        :aria-checked="theme === value"
        @click="selectTheme(value)"
      >
        <span class="theme-check">{{ theme === value ? '✓' : '' }}</span>
        <span>{{ label }}</span>
      </button>
    </div>
  </div>
</template>
