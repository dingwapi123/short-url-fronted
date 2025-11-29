<script setup lang="ts">
defineOptions({ name: 'MyUrlsPage' })
import { ref, onMounted } from 'vue'
import { getAllUrlRecord, type UrlRecord } from '@/api/urlRecord'

const records = ref<UrlRecord[]>([])
const loading = ref(false)
const error = ref('')

async function fetchRecords() {
  loading.value = true
  try {
    const { message, data } = await getAllUrlRecord()
    if (data) {
      // 按时间倒序排列
      records.value = data.sort((a, b) => (b.id > a.id ? 1 : -1))
    } else {
      error.value = message || '获取记录失败'
    }
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  alert('已复制到剪贴板')
}

function openUrl(url: string) {
  window.open(url, '_blank')
}

onMounted(fetchRecords)
</script>

<template>
  <div class="container">
    <h1 class="page-title">个人导航主页</h1>

    <div class="main-card">
      <h2 class="section-title">我的短链接</h2>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="grid-container">
        <div v-for="record in records" :key="record.id" class="url-card">
          <div class="card-header">
            <span class="icon">🔗</span>
            <span class="title" :title="record.originalUrl">
              {{ record.urlCode || 'Short Link' }}
            </span>
          </div>

          <div class="card-body">
            <div class="link-group">
              <div class="link-item original" :title="record.originalUrl">
                {{ record.originalUrl }}
              </div>
              <div class="link-item short" :title="record.shortUrl">
                {{ record.shortUrl }}
              </div>
            </div>

            <div class="action-group">
              <button class="btn btn-outline" @click="copy(record.shortUrl)">复制</button>
              <button class="btn btn-primary" @click="openUrl(record.shortUrl)">打开</button>
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
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

.main-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 32px;
  min-height: 400px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #ff4d4f;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.url-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.url-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #d9d9d9;
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.icon {
  font-size: 18px;
}

.title {
  font-weight: 500;
  color: #333;
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
  background: #f9f9f9;
  border-radius: 4px;
  color: #666;
}

.link-item.short {
  color: #1890ff;
  background: #e6f7ff;
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
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #666;
}

.btn-outline:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

.btn-primary {
  background: #3eb37f;
  color: #fff;
}

.btn-primary:hover {
  background: #359a6d;
}

.footer {
  display: none;
}
</style>
