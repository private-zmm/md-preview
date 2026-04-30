<script setup>
import { themes } from '../constants/themes'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  theme: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:theme', 'toggle-menu', 'close-menu'])

function toggleMenu() {
  emit('toggle-menu')
}

function selectTheme(theme) {
  emit('update:theme', theme)
  emit('close-menu')
}
</script>

<template>
  <div class="popup-menu-wrap">
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
