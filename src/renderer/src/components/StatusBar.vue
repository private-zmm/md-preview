<script setup>
defineProps({
  status: {
    type: String,
    required: true
  },
  stats: {
    type: String,
    required: true
  }
})
</script>

<template>
  <footer class="statusbar">
    <span>{{ status }}</span>
    <span>{{ stats }}</span>
  </footer>
</template>
