<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  api: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'status', 'save-image', 'save-server'])
const activeTab = ref('image')
const tabs = [
  { key: 'image', label: '图像设置' },
  { key: 'admin', label: '服务器管理' },
  { key: 'server', label: '服务器连接' }
]

const defaultAdminSettings = {
  mcpApiKey: '',
  mcpUserEmail: '',
  backupEnabled: true,
  backupSchedule: '0 3 * * *',
  s3Configured: false,
  s3: {
    endpoint: '',
    region: 'auto',
    bucket: '',
    accessKeyId: '',
    secretAccessKey: '',
    hasSecret: false,
    prefix: 'mdpreview/backups'
  }
}

function cloneSettings(settings) {
  return JSON.parse(JSON.stringify(settings))
}

const localSettings = ref(cloneSettings(props.settings))
const adminSettings = ref(cloneSettings(defaultAdminSettings))
const adminLoading = ref(false)
const backupLoading = ref(false)

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

  if (activeTab.value === 'admin') {
    saveAdminSettings()
    return
  }

  emit('save-server', cloneSettings(localSettings.value.server))
}

async function loadAdminSettings() {
  if (typeof props.api?.getAdminSettings !== 'function') return
  adminLoading.value = true
  try {
    const payload = await props.api.getAdminSettings()
    adminSettings.value = {
      ...cloneSettings(defaultAdminSettings),
      ...payload,
      s3: {
        ...defaultAdminSettings.s3,
        ...(payload.s3 || {})
      }
    }
  } catch (error) {
    emit('status', `读取服务器管理配置失败：${error.message}`)
  } finally {
    adminLoading.value = false
  }
}

async function saveAdminSettings() {
  if (typeof props.api?.saveAdminSettings !== 'function') {
    emit('status', '请先连接服务器')
    return
  }
  try {
    adminSettings.value = await props.api.saveAdminSettings(cloneSettings(adminSettings.value))
    emit('status', '服务器管理配置已保存')
  } catch (error) {
    emit('status', `保存服务器管理配置失败：${error.message}`)
  }
}

async function createBackup() {
  if (backupLoading.value) return
  if (typeof props.api?.createBackup !== 'function') {
    emit('status', '请先连接服务器')
    return
  }
  backupLoading.value = true
  try {
    const result = await props.api.createBackup()
    emit('status', result.backup?.s3Prefix ? '备份已创建并上传至 S3' : '本地备份已创建')
  } catch (error) {
    emit('status', `创建备份失败：${error.message}`)
  } finally {
    backupLoading.value = false
  }
}

watch(activeTab, (tab) => {
  if (tab === 'admin') loadAdminSettings()
})

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

</script>

<template>
  <section class="settings-page" aria-labelledby="settingsTitle">
    <header class="settings-page-header">
      <div>
        <h1 id="settingsTitle">设置</h1>
        <p>配置图片保存位置和服务器连接。</p>
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

        <section v-else-if="activeTab === 'admin'" class="settings-section">
          <h2>服务器管理</h2>
          <p v-if="adminLoading">正在读取服务器配置...</p>
          <p>这里保存的是服务器端配置，只有管理员账号可以读取和修改。</p>

          <h3>MCP</h3>
          <div class="settings-form-grid">
            <label class="settings-field">
              <span>MCP API Key</span>
              <input
                v-model="adminSettings.mcpApiKey"
                class="settings-input"
                type="password"
                placeholder="留空表示使用登录 JWT"
              />
            </label>
            <label class="settings-field">
              <span>MCP 用户邮箱</span>
              <input v-model.trim="adminSettings.mcpUserEmail" class="settings-input" type="email" />
            </label>
          </div>

          <h3>定时备份</h3>
          <div class="settings-form-grid">
            <label class="settings-check">
              <input v-model="adminSettings.backupEnabled" type="checkbox" />
              <span>启用定时备份</span>
            </label>
            <label class="settings-field">
              <span>Cron 表达式</span>
              <input v-model.trim="adminSettings.backupSchedule" class="settings-input" type="text" placeholder="0 3 * * *" />
            </label>
          </div>

          <h3>S3 / MinIO</h3>
          <div class="settings-form-grid">
            <label class="settings-field">
              <span>Endpoint</span>
              <input v-model.trim="adminSettings.s3.endpoint" class="settings-input" type="url" placeholder="http://minio:9000" />
            </label>
            <label class="settings-field">
              <span>Region</span>
              <input v-model.trim="adminSettings.s3.region" class="settings-input" type="text" />
            </label>
            <label class="settings-field">
              <span>Bucket</span>
              <input v-model.trim="adminSettings.s3.bucket" class="settings-input" type="text" />
            </label>
            <label class="settings-field">
              <span>Access Key ID</span>
              <input v-model.trim="adminSettings.s3.accessKeyId" class="settings-input" type="text" />
            </label>
            <label class="settings-field">
              <span>Secret Access Key</span>
              <input v-model="adminSettings.s3.secretAccessKey" class="settings-input" type="password" placeholder="留空表示保留原值" />
            </label>
            <label class="settings-field">
              <span>备份前缀</span>
              <input v-model.trim="adminSettings.s3.prefix" class="settings-input" type="text" />
            </label>
          </div>

          <div class="settings-panel-actions">
            <button class="settings-secondary" type="button" @click="loadAdminSettings">读取配置</button>
            <button class="settings-secondary" type="button" :disabled="backupLoading" @click="createBackup">{{ backupLoading ? '正在备份…' : '立即备份' }}</button>
          </div>
        </section>

        <section v-else class="settings-section">
          <h2>服务器连接</h2>

          <div class="settings-row">
            <div>
              <h3>连接 Web 服务</h3>
              <p>登录后，桌面端可以直接打开、编辑和保存服务端文档。</p>
            </div>
          </div>

          <div class="settings-form-grid">
            <label class="settings-field">
              <span>服务地址</span>
              <input
                v-model.trim="localSettings.server.serverUrl"
                class="settings-input"
                type="url"
                placeholder="http://localhost:8787"
              />
            </label>
            <label class="settings-field">
              <span>邮箱</span>
              <input v-model.trim="localSettings.server.email" class="settings-input" type="email" />
            </label>
            <label class="settings-field">
              <span>密码</span>
              <input v-model="localSettings.server.password" class="settings-input" type="password" />
            </label>
          </div>

          <div class="settings-panel-actions">
            <button class="settings-secondary" type="button" @click="emit('save-server', cloneSettings(localSettings.server))">
              登录并连接
            </button>
            <button class="settings-secondary" type="button" @click="emit('save-server', { ...cloneSettings(localSettings.server), disconnect: true })">
              断开连接
            </button>
          </div>
        </section>
      </div>
    </div>

    <footer class="settings-page-footer">
      <button class="dialog-button" type="button" @click="emit('close')">返回</button>
      <button class="dialog-button primary settings-save-button" type="button" @click="saveCurrentSettings">
      {{ activeTab === 'image' ? '保存图像设置' : activeTab === 'admin' ? '保存服务器管理配置' : '保存服务器设置' }}
      </button>
    </footer>
  </section>
</template>
