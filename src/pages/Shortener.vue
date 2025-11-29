<script setup lang="ts">
import { ref } from 'vue'
import { createUrlRecord, type UrlRecord } from '@/api/urlRecord'

const originalUrl = ref('')
const customAlias = ref('')
const title = ref('')
const description = ref('')
const category = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<UrlRecord | null>(null)
const showAdvanced = ref(false)

async function handleSubmit() {
  if (!originalUrl.value) return

  try {
    loading.value = true
    error.value = ''
    result.value = null

    const res = await createUrlRecord(
      originalUrl.value,
      customAlias.value || undefined,
      title.value || undefined,
      description.value || undefined,
      category.value || undefined,
    )
    if (res.data) {
      result.value = res.data
      // Optional: Clear inputs on success?
      // originalUrl.value = ''
      // customAlias.value = ''
    } else {
      error.value = res.message || '创建失败'
    }
  } catch (err: any) {
    error.value = err.message || '发生错误，请重试'
  } finally {
    loading.value = false
  }
}

function copyResult() {
  if (result.value?.shortUrl) {
    navigator.clipboard
      .writeText(result.value.shortUrl)
      .then(() => {
        alert('已复制到剪贴板')
      })
      .catch(() => {
        alert('复制失败')
      })
  }
}

function clearForm() {
  originalUrl.value = ''
  customAlias.value = ''
  title.value = ''
  description.value = ''
  category.value = ''
  error.value = ''
  result.value = null
}
</script>

<template>
  <div class="container">
    <div class="form-card">
      <div class="form-head">
        <h1>创建短链接</h1>
        <span class="tip">快速生成简短易记的链接</span>
      </div>

      <div class="form">
        <div>
          <div class="label" style="margin-bottom: 6px">原始链接</div>
          <textarea
            v-model="originalUrl"
            class="input input--textarea"
            placeholder="请输入需要缩短的长链接 (http:// or https://)..."
            :disabled="loading"
          ></textarea>
          <div class="input-tools">
            <span class="counter">{{ originalUrl.length }} 字符</span>
            <button v-if="originalUrl" class="ghost" @click="clearForm">清空</button>
          </div>
        </div>

        <div class="adv">
          <button class="link" @click="showAdvanced = !showAdvanced">
            {{ showAdvanced ? '收起高级选项' : '展开高级选项' }}
          </button>

          <div v-if="showAdvanced" style="margin-top: 12px; display: grid; gap: 12px">
            <div>
              <div class="label" style="margin-bottom: 6px">自定义后缀 (可选)</div>
              <input
                v-model="customAlias"
                type="text"
                class="input"
                placeholder="例如: my-link"
                :disabled="loading"
              />
            </div>

            <div>
              <div class="label" style="margin-bottom: 6px">标题 (可选)</div>
              <input
                v-model="title"
                type="text"
                class="input"
                placeholder="给链接起个名字..."
                :disabled="loading"
              />
            </div>

            <div>
              <div class="label" style="margin-bottom: 6px">分类 (可选)</div>
              <input
                v-model="category"
                type="text"
                class="input"
                placeholder="例如: 工作, 个人, 营销..."
                :disabled="loading"
              />
            </div>

            <div>
              <div class="label" style="margin-bottom: 6px">描述 (可选)</div>
              <textarea
                v-model="description"
                class="input"
                style="height: 80px; resize: vertical"
                placeholder="备注用途..."
                :disabled="loading"
              ></textarea>
            </div>
          </div>
        </div>

        <div v-if="error" class="alert alert--error">
          {{ error }}
        </div>

        <button class="btn" @click="handleSubmit" :disabled="loading || !originalUrl">
          <span v-if="loading" class="spinner"></span>
          <span v-else>生成短链</span>
        </button>
      </div>
    </div>

    <!-- Result Card -->
    <div v-if="result" class="result-card">
      <div class="result-head">
        <span class="badge">创建成功</span>
        <div class="short">{{ result.shortUrl }}</div>
      </div>

      <div class="grid">
        <div class="item">
          <div class="label">原始链接</div>
          <div class="mono truncate" :title="result.originalUrl">{{ result.originalUrl }}</div>
        </div>
        <div class="item">
          <div class="label">创建时间</div>
          <div class="mono">{{ result.createdAt || '刚刚' }}</div>
        </div>
        <div class="item" v-if="result.title">
          <div class="label">标题</div>
          <div class="mono truncate">{{ result.title }}</div>
        </div>
      </div>

      <div style="padding: 0 16px 16px">
        <div class="actions">
          <button class="primary" @click="copyResult">复制链接</button>
          <button class="ghost" @click="result = null">继续创建</button>
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
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: 20px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
.form-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
h1 {
  font-size: 22px;
  margin: 0 0 8px;
  color: var(--foreground);
}
.tip {
  color: var(--foreground);
  opacity: 0.6;
  font-size: 13px;
}
.form {
  display: grid;
  gap: 12px;
}
.label {
  font-size: 13px;
  color: var(--foreground);
  opacity: 0.8;
}
.input {
  height: 40px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  outline: none;
  background: var(--background);
  color: var(--foreground);
  width: 100%;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}
.input--textarea {
  height: auto;
  min-height: 96px;
  resize: vertical;
  line-height: 1.5;
  font-family: inherit;
}
.input:focus {
  border-color: var(--primary);
  background: var(--card);
}
.input-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}
.counter {
  color: var(--foreground);
  opacity: 0.5;
  font-size: 12px;
}
.ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
  opacity: 0.8;
  border-radius: 6px;
  height: 30px;
  padding: 0 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.ghost:hover {
  border-color: var(--primary);
  color: var(--primary);
  opacity: 1;
}
.adv {
  margin-top: 2px;
}
.link {
  border: none;
  background: none;
  color: var(--primary);
  cursor: pointer;
  padding: 0;
  font-size: 13px;
}
.btn {
  height: 42px;
  background: var(--primary);
  border: none;
  color: var(--primary-foreground);
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn:hover {
  opacity: 0.9;
}
.btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
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
  font-size: 14px;
}
.alert--error {
  background: color-mix(in srgb, #e74c3c, transparent 90%);
  color: #e74c3c;
  border: 1px solid color-mix(in srgb, #e74c3c, transparent 80%);
}

.result-card {
  margin-top: 18px;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  background: var(--card);
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
.result-head {
  padding: 16px 16px 0;
}
.badge {
  display: inline-block;
  font-size: 12px;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary), transparent 90%);
  border: 1px solid color-mix(in srgb, var(--primary), transparent 80%);
  border-radius: 999px;
  padding: 2px 8px;
}
.short {
  margin: 10px 0 12px;
  padding: 0 16px 0 0;
  font-size: 18px;
  word-break: break-all;
  color: var(--primary);
  font-weight: 600;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 0 16px 16px;
}
.grid--one {
  grid-template-columns: 1fr;
}
.item {
  border-top: 1px dashed var(--border);
  padding-top: 12px;
}
.label {
  font-size: 12px;
  color: var(--foreground);
  opacity: 0.6;
}
.mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  color: var(--foreground);
  font-size: 13px;
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
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-size: 13px;
  font-weight: 500;
}
.primary:hover {
  opacity: 0.9;
}
.ghost {
  height: 32px;
}
</style>
