<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  html: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['status'])
const api = window.mdPreview
const previewRef = ref(null)
const imageMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  src: '',
  link: ''
})

function decorateLinks() {
  document.querySelectorAll('.markdown-body a[href]').forEach((link) => {
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noreferrer')
  })
}

function closeImageMenu() {
  imageMenu.value.visible = false
}

function openImageMenu(event) {
  const image = event.target?.closest?.('img')
  if (!image || !previewRef.value?.contains(image)) return

  event.preventDefault()
  imageMenu.value = {
    visible: true,
    x: Math.min(event.clientX, window.innerWidth - 150),
    y: Math.min(event.clientY, window.innerHeight - 86),
    src: image.currentSrc || image.src,
    link: image.dataset.originalSrc || image.currentSrc || image.src
  }
}

async function copyImage() {
  const source = imageMenu.value.src
  closeImageMenu()

  try {
    if (typeof api?.copyImageToClipboard !== 'function') {
      emit('status', '复制图片功能需要重启应用后生效')
      return
    }

    await api.copyImageToClipboard(source)
    emit('status', '图片已复制到剪贴板')
  } catch (error) {
    emit('status', `复制图片失败：${error.message}`)
  }
}

async function copyImageLink() {
  const source = imageMenu.value.link
  closeImageMenu()

  try {
    if (typeof api?.copyTextToClipboard !== 'function') {
      emit('status', '复制链接功能需要重启应用后生效')
      return
    }

    await api.copyTextToClipboard(source)
    emit('status', '图片链接已复制')
  } catch (error) {
    emit('status', `复制链接失败：${error.message}`)
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeImageMenu()
}

onMounted(() => {
  window.addEventListener('pointerdown', closeImageMenu)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', closeImageMenu)
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.html,
  async () => {
    await nextTick()
    decorateLinks()
    closeImageMenu()
  },
  { immediate: true }
)

function scrollToOutline(item) {
  const headings = previewRef.value?.querySelectorAll?.('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6')
  const heading = headings?.[item?.headingIndex]
  if (!heading) return

  heading.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

defineExpose({
  scrollToOutline
})
</script>

<template>
  <div ref="previewRef" class="pane preview-pane" @contextmenu="openImageMenu">
    <article class="markdown-body" v-html="html"></article>

    <div
      v-if="imageMenu.visible"
      class="image-context-menu"
      :style="{ left: `${imageMenu.x}px`, top: `${imageMenu.y}px` }"
      role="menu"
      @pointerdown.stop
    >
      <button class="file-menu-item" type="button" role="menuitem" @click="copyImage">
        <span>复制图片</span>
      </button>
      <button class="file-menu-item" type="button" role="menuitem" @click="copyImageLink">
        <span>复制链接</span>
      </button>
    </div>
  </div>
</template>
