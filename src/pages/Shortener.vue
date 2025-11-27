<script setup lang="ts">
defineOptions({ name: 'UrlShortenerPage' })
import { ref } from 'vue'
import { createUrlRecord, type UrlRecord } from '@/api/urlRecord'

const originalUrl = ref('')
const urlCode = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<UrlRecord | null>(null)

/**
 * 提交表单，创建短链记录
 * - 校验输入
 * - 调用后端接口
 * - 展示返回结果或错误
 */
async function submit() {
  error.value = ''
  result.value = null

  const url = originalUrl.value.trim()
  const code = urlCode.value.trim()

  if (!url) {
    error.value = '请输入原始链接'
    return
  }

  loading.value = true
  try {
    const { message, data } = await createUrlRecord(url, code || undefined)
    if (!data) {
      error.value = message || '创建失败'
      return
    }
    result.value = data
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

/**
 * 复制文本到剪贴板
 * @param text 需要复制的字符串
 */
function copy(text: string) {
  navigator.clipboard.writeText(text)
}

const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/v1'

/**
 * 基于短码构造可访问的后端跳转链接
 * @param code 短码
 */
function buildAccessibleUrl(code: string) {
  return `${apiBase}/${code}`
}
</script>

<template>
  <div class="container">
    <h1>短链接生成器</h1>
    <form class="form" @submit.prevent="submit">
      <label class="label">原始链接</label>
      <input
        class="input"
        type="url"
        v-model="originalUrl"
        placeholder="https://example.com/very/long/url"
        required
      />

      <label class="label">自定义短码（可选）</label>
      <input class="input" type="text" v-model="urlCode" placeholder="如: my-code" />

      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? '创建中…' : '创建短链' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="result" class="result">
      <h2>创建成功</h2>
      <p>
        后端返回短链：
        <a :href="result.shortUrl" target="_blank" rel="noopener">{{ result.shortUrl }}</a>
        <button class="link-btn" @click="copy(result.shortUrl)">复制</button>
      </p>
      <p>
        可直接访问短链：
        <a :href="buildAccessibleUrl(result.urlCode)" target="_blank" rel="noopener">
          {{ buildAccessibleUrl(result.urlCode) }}
        </a>
        <button class="link-btn" @click="copy(buildAccessibleUrl(result.urlCode))">复制</button>
      </p>
      <p>
        使用本前端域名跳转：
        <router-link :to="`/${result.urlCode}`">/{{ result.urlCode }}</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 40px auto;
  padding: 0 16px;
}
h1 {
  font-size: 24px;
  margin-bottom: 16px;
}
.form {
  display: grid;
  gap: 10px;
}
.label {
  font-size: 14px;
  color: #555;
}
.input {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}
.input:focus {
  border-color: #42b883;
}
.btn {
  height: 40px;
  background: #42b883;
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #e74c3c;
  margin-top: 12px;
}
.result {
  margin-top: 20px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
}
.link-btn {
  margin-left: 8px;
  height: 26px;
}
</style>
