<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'status', 'save-image', 'save-remote'])
const activeTab = ref('image')
const tabs = [
  { key: 'image', label: '图像设置' },
  { key: 'remote', label: '远程设置' }
]

function cloneSettings(settings) {
  return JSON.parse(JSON.stringify(settings))
}

const localSettings = ref(cloneSettings(props.settings))

watch(
  () => props.settings,
  (settings) => {
    localSettings.value = cloneSettings(settings)
  },
  { deep: true }
)

function saveCurrentSettings() {
  if (activeTab.value === 'image') {
    emit('save-image', cloneSettings(localSettings.value.image))
    return
  }

  emit('save-remote', cloneSettings(localSettings.value.remote))
}

async function chooseLocalImagePath() {
  const api = window.mdPreview
  if (typeof api?.chooseFolder !== 'function') return

  const result = await api.chooseFolder('选择本地图片保存路径')
  if (result?.canceled) return

  localSettings.value.image.imageSavePath = result.folderPath
}

async function testConnection(provider, settings, successMessage) {
  const api = window.mdPreview

  if (typeof api?.testSyncConnection !== 'function') {
    emit('status', '测试连接功能需要重启应用后生效')
    return
  }

  try {
    await api.testSyncConnection({
      provider,
      settings: cloneSettings(settings)
    })
    emit('status', successMessage)
  } catch (error) {
    emit('status', `远程服务器连接失败：${error.message}`)
  }
}

function testImageS3() {
  testConnection(
    's3',
    {
      s3: localSettings.value.image.s3
    },
    '图片 S3 连接成功'
  )
}

function testRemoteWebDav() {
  testConnection(
    'webdav',
    {
      webdav: localSettings.value.remote.webdav
    },
    'WebDAV 连接成功'
  )
}
</script>

<template>
  <section class="settings-page" aria-labelledby="settingsTitle">
    <header class="settings-page-header">
      <div>
        <h1 id="settingsTitle">设置</h1>
        <p>配置图片保存位置和远程 WebDAV 文件夹。</p>
      </div>
      <button class="settings-secondary" type="button" @click="emit('close')">返回</button>
    </header>

    <div class="settings-page-body">
      <aside class="settings-tabs" aria-label="设置分类">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="settings-tab"
          :class="{ active: activeTab === tab.key }"
          type="button"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </aside>

      <div class="settings-panel">
        <section v-if="activeTab === 'image'" class="settings-section">
          <h2>图像设置</h2>

          <div class="settings-row">
            <div>
              <h3>本地文件插入图片</h3>
              <p>粘贴图片时，可保存到本地路径或上传到 S3。</p>
            </div>
            <select v-model="localSettings.image.imageProvider" class="settings-input">
              <option value="local">本地路径</option>
              <option value="s3">S3 服务器</option>
            </select>
          </div>

          <div v-if="localSettings.image.imageProvider === 'local'" class="settings-row">
            <div>
              <h3>本地图片路径</h3>
              <p>可填写相对路径，例如 images，也可以选择固定文件夹。</p>
            </div>
            <div class="settings-inline">
              <input
                v-model.trim="localSettings.image.imageSavePath"
                class="settings-input"
                type="text"
                placeholder="images"
              />
              <button class="settings-secondary" type="button" @click="chooseLocalImagePath">选择</button>
            </div>
          </div>

          <div v-else>
            <div class="settings-form-grid">
              <label class="settings-field">
                <span>Endpoint</span>
                <input
                  v-model.trim="localSettings.image.s3.endpoint"
                  class="settings-input"
                  type="url"
                  placeholder="https://s3.example.com"
                />
              </label>
              <label class="settings-field">
                <span>公开访问地址</span>
                <input
                  v-model.trim="localSettings.image.s3.publicBaseUrl"
                  class="settings-input"
                  type="url"
                  placeholder="https://cdn.example.com/bucket"
                />
              </label>
              <label class="settings-field">
                <span>Region</span>
                <input v-model.trim="localSettings.image.s3.region" class="settings-input" type="text" />
              </label>
              <label class="settings-field">
                <span>Bucket</span>
                <input v-model.trim="localSettings.image.s3.bucket" class="settings-input" type="text" />
              </label>
              <label class="settings-field">
                <span>Access Key ID</span>
                <input v-model.trim="localSettings.image.s3.accessKeyId" class="settings-input" type="text" />
              </label>
              <label class="settings-field">
                <span>Secret Access Key</span>
                <input v-model="localSettings.image.s3.secretAccessKey" class="settings-input" type="password" />
              </label>
              <label class="settings-field">
                <span>远程前缀</span>
                <input v-model.trim="localSettings.image.s3.prefix" class="settings-input" type="text" />
              </label>
              <label class="settings-field">
                <span>图片目录</span>
                <input
                  v-model.trim="localSettings.image.s3.imagePath"
                  class="settings-input"
                  type="text"
                  placeholder="images"
                />
              </label>
              <label class="settings-check">
                <input v-model="localSettings.image.s3.forcePathStyle" type="checkbox" />
                <span>使用 Path Style 地址</span>
              </label>
            </div>
            <div class="settings-panel-actions">
              <button class="settings-secondary" type="button" @click="testImageS3">测试 S3</button>
            </div>
          </div>
        </section>

        <section v-else class="settings-section">
          <h2>远程设置</h2>

          <div class="settings-row">
            <div>
              <h3>WebDAV 连接</h3>
              <p>文件菜单里的“打开远程文件夹”会使用此连接。</p>
            </div>
            <button class="settings-secondary" type="button" @click="testRemoteWebDav">测试 WebDAV</button>
          </div>

          <div class="settings-form-grid">
            <label class="settings-field">
              <span>服务器地址</span>
              <input
                v-model.trim="localSettings.remote.webdav.url"
                class="settings-input"
                type="url"
                placeholder="https://example.com/dav"
              />
            </label>
            <label class="settings-field">
              <span>图片公开访问地址</span>
              <input
                v-model.trim="localSettings.remote.webdav.publicBaseUrl"
                class="settings-input"
                type="url"
                placeholder="https://cdn.example.com/dav"
              />
            </label>
            <label class="settings-field">
              <span>用户名</span>
              <input v-model.trim="localSettings.remote.webdav.username" class="settings-input" type="text" />
            </label>
            <label class="settings-field">
              <span>密码 / Token</span>
              <input v-model="localSettings.remote.webdav.password" class="settings-input" type="password" />
            </label>
            <label class="settings-field">
              <span>默认远程文件夹</span>
              <input
                v-model.trim="localSettings.remote.webdav.remotePath"
                class="settings-input"
                type="text"
                placeholder="/MdPreview"
              />
            </label>
            <label class="settings-field">
              <span>远程图片目录</span>
              <input
                v-model.trim="localSettings.remote.webdavImagePath"
                class="settings-input"
                type="text"
                placeholder="images"
              />
            </label>
          </div>
        </section>
      </div>
    </div>

    <footer class="settings-page-footer">
      <button class="dialog-button" type="button" @click="emit('close')">返回</button>
      <button class="dialog-button primary settings-save-button" type="button" @click="saveCurrentSettings">
        {{ activeTab === 'image' ? '保存图像设置' : '保存远程设置' }}
      </button>
    </footer>
  </section>
</template>
