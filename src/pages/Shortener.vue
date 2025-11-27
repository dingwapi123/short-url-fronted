<script setup lang="ts">
defineOptions({ name: 'UrlShortenerPage' })
import { ref, computed } from 'vue'
import { createUrlRecord, type UrlRecord } from '@/api/urlRecord'

const originalUrl = ref('')
const urlCode = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<UrlRecord | null>(null)
const showAdvanced = ref(false)

/**
 * 计算原始链接长度，用于 UI 显示
 * @returns 链接字符长度
 */
const originalUrlLen = computed(() => originalUrl.value.trim().length)

/**
 * 清空原始链接输入框
 */
function clearOriginal() {
  originalUrl.value = ''
}

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

/**
 * 在新窗口/当前窗口打开链接
 * @param url 要打开的链接
 */
function open(url: string) {
  window.open(url, '_blank')
}

const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/v1'

/**
 * 基于短码构造可访问的后端跳转链接
 * @param code 短码
 */
function buildAccessibleUrl(code: string) {
  return `${apiBase}/${code}`
}

/**
 * 截断过长字符串，中间打点
 * @param text 输入字符串
 * @param max 保留的最大展示长度
 * @returns 处理后的短展示字符串
 */
function displayTruncated(text: string, max = 96) {
  const s = String(text ?? '')
  if (s.length <= max) return s
  const head = s.slice(0, Math.floor(max * 0.6))
  const tail = s.slice(-Math.floor(max * 0.3))
  return `${head}…${tail}`
}
</script>

<template>
  <div class="container">
    <div class="form-card">
      <div class="form-head">
        <h1>短链接生成器</h1>
        <p class="tip">支持很长的 URL，粘贴后可上下拖拽调整输入框高度</p>
      </div>

      <form class="form" @submit.prevent="submit">
        <label class="label">原始链接</label>
        <textarea
          class="input input--textarea"
          v-model="originalUrl"
          rows="4"
          placeholder="https://example.com/very/long/url"
          required
        />
        <div class="input-tools">
          <span v-if="originalUrlLen" class="counter">长度：{{ originalUrlLen }}</span>
          <button type="button" class="ghost" @click="clearOriginal" v-if="originalUrlLen">
            清空
          </button>
        </div>

        <div class="adv">
          <button type="button" class="link" @click="showAdvanced = !showAdvanced">
            {{ showAdvanced ? '隐藏' : '显示' }}高级选项
          </button>
        </div>

        <div v-show="showAdvanced">
          <label class="label">自定义短码（可选）</label>
          <input class="input" type="text" v-model="urlCode" placeholder="如: my-code" />
        </div>

        <button class="btn" type="submit" :disabled="loading">
          <span v-if="!loading">创建短链</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
    </div>

    <div v-if="error" class="alert alert--error">{{ error }}</div>

    <div v-if="result" class="result-card">
      <div class="result-head">
        <span class="badge">创建成功</span>
        <h2 class="short">{{ buildAccessibleUrl(result.urlCode) }}</h2>
      </div>

      <div class="grid">
        <div class="item">
          <div class="label">可直接访问短链</div>
          <div class="mono truncate" :title="buildAccessibleUrl(result.urlCode)">
            {{ buildAccessibleUrl(result.urlCode) }}
          </div>
          <div class="actions">
            <button class="primary" @click="open(buildAccessibleUrl(result.urlCode))">打开</button>
            <button class="ghost" @click="copy(buildAccessibleUrl(result.urlCode))">复制</button>
          </div>
        </div>

        <div class="item">
          <div class="label">后端返回短链</div>
          <div class="mono truncate" :title="result.shortUrl">{{ result.shortUrl }}</div>
          <div class="actions">
            <button class="ghost" @click="copy(result.shortUrl)">复制</button>
          </div>
        </div>

        <div class="item">
          <div class="label">原始链接</div>
          <div class="mono truncate" :title="result.originalUrl">
            {{ displayTruncated(result.originalUrl) }}
          </div>
          <div class="actions">
            <button class="ghost" @click="copy(result.originalUrl)">复制原始链接</button>
          </div>
        </div>

        <div class="item">
          <div class="label">使用前端域名跳转</div>
          <router-link class="mono" :to="`/${result.urlCode}`">/{{ result.urlCode }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 860px;
  margin: 32px auto;
  padding: 0 20px;
}
.form-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: 20px;
}
.form-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
h1 {
  font-size: 22px;
  margin: 0 0 8px;
}
.tip {
  color: #777;
  font-size: 13px;
}
.form {
  display: grid;
  gap: 12px;
}
.label {
  font-size: 13px;
  color: #444;
}
.input {
  height: 40px;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  outline: none;
  background: #fafafa;
}
.input--textarea {
  height: auto;
  min-height: 96px;
  resize: vertical;
  line-height: 1.5;
}
.input:focus {
  border-color: #42b883;
  background: #fff;
}
.input-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.counter {
  color: #999;
  font-size: 12px;
}
.ghost {
  background: transparent;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 6px;
  height: 30px;
  padding: 0 10px;
  cursor: pointer;
}
.adv {
  margin-top: 2px;
}
.link {
  border: none;
  background: none;
  color: #42b883;
  cursor: pointer;
}
.btn {
  height: 42px;
  background: linear-gradient(135deg, #42b883, #2fa06e);
  border: none;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ffffff80;
  border-top-color: #fff;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.alert {
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 8px;
}
.alert--error {
  background: #fde8e7;
  color: #a94442;
  border: 1px solid #f5c6c6;
}

.result-card {
  margin-top: 18px;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  background: #fff;
}
.result-head {
  padding: 16px 16px 0;
}
.badge {
  display: inline-block;
  font-size: 12px;
  color: #2fa06e;
  background: #e8f7f0;
  border: 1px solid #d5f0e3;
  border-radius: 999px;
  padding: 2px 8px;
}
.short {
  margin: 10px 0 12px;
  padding: 0 16px 0 0;
  font-size: 18px;
  word-break: break-all;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 0 16px 16px;
}
.item {
  border-top: 1px dashed #eee;
  padding-top: 12px;
}
.label {
  font-size: 12px;
  color: #666;
}
.mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.primary {
  height: 32px;
  padding: 0 12px;
  border: none;
  color: #fff;
  background: #3da46d;
  border-radius: 6px;
  cursor: pointer;
}
.ghost {
  height: 32px;
}
</style>
