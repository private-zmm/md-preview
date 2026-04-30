<script setup>
defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['save', 'discard', 'cancel'])
</script>

<template>
  <div v-if="open" class="dialog-backdrop" role="presentation">
    <section class="unsaved-dialog" role="dialog" aria-modal="true" aria-labelledby="unsavedTitle">
      <h2 id="unsavedTitle">保存</h2>
      <p>是否保存更改？</p>
      <p>如果不保存，您的更改将会丢失。</p>

      <div class="unsaved-actions">
        <button class="dialog-button primary" type="button" @click="emit('save')">保存</button>
        <button class="dialog-button" type="button" @click="emit('discard')">丢弃</button>
        <button class="dialog-button cancel" type="button" @click="emit('cancel')">取消</button>
      </div>
    </section>
  </div>
</template>
