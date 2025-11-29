<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllUrlRecord, type UrlRecord } from '@/api/urlRecord'

const urls = ref<UrlRecord[]>([])
const loading = ref(true)
const error = ref('')

async function fetchUrls() {
  try {
    loading.value = true
    const res = await getAllUrlRecord()
    if (res.data) {
      urls.value = res.data.reverse() // Show newest first
    }
  } catch (err: any) {
    error.value = err.message || '获取链接列表失败'
  } finally {
    loading.value = false
  }
}

function copyUrl(url: string) {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      // Could add a toast notification here if available
      alert('复制成功')
    })
    .catch(() => {
      alert('复制失败，请手动复制')
    })
}

function openUrl(url: string) {
  window.open(url, '_blank')
}

onMounted(() => {
  fetchUrls()
})
</script>

<template>
  <div class="container">
    <h1 class="page-title">我的链接</h1>

    <div class="main-card">
      <h2 class="section-title">历史记录</h2>

      <div v-if="loading" class="loading">加载中...</div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else-if="urls.length === 0" class="loading">暂无记录</div>

      <div v-else class="grid-container">
        <div v-for="url in urls" :key="url.id" class="url-card">
          <div class="card-header">
            <span class="icon">🔗</span>
            <span class="title">{{ url.urlCode }}</span>
          </div>

          <div class="card-body">
            <div class="link-group">
              <div class="link-item" :title="url.originalUrl">
                {{ url.originalUrl }}
              </div>
              <div class="link-item short">
                {{ url.shortUrl }}
              </div>
            </div>

            <div class="action-group">
              <button class="btn btn-outline" @click="copyUrl(url.shortUrl)">复制</button>
              <button class="btn btn-primary" @click="openUrl(url.shortUrl)">访问</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 24px;
  text-align: center;
}

.main-card {
  background: var(--card);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 32px;
  min-height: 400px;
  transition: background-color 0.3s;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 24px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  color: var(--foreground);
  opacity: 0.6;
}

.error {
  color: #ff4d4f;
  opacity: 1;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.url-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.url-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--border);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.icon {
  font-size: 18px;
}

.title {
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-item {
  font-size: 13px;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px 8px;
  background: var(--background);
  border-radius: 4px;
  color: var(--foreground);
  opacity: 0.8;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.link-item.short {
  color: var(--primary);
  background: color-mix(in srgb, var(--primary), transparent 90%);
  opacity: 1;
}

.action-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: auto;
}

.btn {
  height: 36px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
}

.btn-outline:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
}

.btn-primary:hover {
  opacity: 0.9;
}

.footer {
  display: none;
}
</style>
