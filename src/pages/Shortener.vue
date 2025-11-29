<script setup lang="ts">
import { ref } from 'vue'
import { createUrlRecord, type UrlRecord } from '@/api/urlRecord'
import { useToast } from '@/composables/useToast'

const originalUrl = ref('')
const customAlias = ref('')
const title = ref('')
const description = ref('')
const category = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<UrlRecord | null>(null)
const showAdvanced = ref(false)

const { showToast } = useToast()

async function handleSubmit() {
  if (!originalUrl.value) return
  if (!title.value.trim()) {
    error.value = '请输入标题'
    return
  }

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
        showToast('已复制到剪贴板', 'success')
      })
      .catch(() => {
        showToast('复制失败', 'error')
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
  <div class="bg-base-200 min-h-screen w-full">
    <div class="max-w-[860px] mx-auto py-10 px-5 font-sans">
      <!-- 创建卡片 -->
      <div
        v-if="!result"
        class="card bg-base-100 border border-base-300 shadow-sm p-5 transition-all duration-300"
      >
        <div class="flex items-baseline justify-between mb-4">
          <h1 class="text-2xl m-0 font-normal">创建短链接</h1>
          <span class="text-base-content/60 text-sm">快速生成简短易记的链接</span>
        </div>

        <div class="grid gap-4">
          <div class="form-control">
            <div class="label">
              <span class="label-text">原始链接<span class="text-error">*</span></span>
            </div>
            <textarea
              v-model="originalUrl"
              class="textarea textarea-bordered h-24 w-full text-base"
              placeholder="请输入需要缩短的长链接 (http:// or https://)..."
              :disabled="loading"
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <span class="text-base-content/50 text-xs">{{ originalUrl.length }} 字符</span>
              <button v-if="originalUrl" class="btn btn-ghost btn-xs" @click="clearForm">
                清空
              </button>
            </div>
          </div>

          <div class="form-control">
            <div class="label py-1">
              <span class="label-text">标题 <span class="text-error">*</span></span>
            </div>
            <input
              v-model="title"
              type="text"
              class="input input-bordered w-full"
              placeholder="给链接起个名字..."
              :disabled="loading"
            />
          </div>

          <div>
            <button
              class="btn btn-ghost btn-sm p-0 hover:bg-transparent text-primary"
              @click="showAdvanced = !showAdvanced"
            >
              {{ showAdvanced ? '收起高级选项' : '展开高级选项' }}
            </button>

            <div v-if="showAdvanced" class="mt-3 grid gap-3">
              <div class="form-control">
                <div class="label py-1">
                  <span class="label-text">自定义后缀 (可选)</span>
                </div>
                <input
                  v-model="customAlias"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="例如: my-link"
                  :disabled="loading"
                />
              </div>

              <div class="form-control">
                <div class="label py-1">
                  <span class="label-text">分类 (可选)</span>
                </div>
                <input
                  v-model="category"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="例如: 工作, 个人, 营销..."
                  :disabled="loading"
                />
              </div>

              <div class="form-control">
                <div class="label py-1">
                  <span class="label-text">描述 (可选)</span>
                </div>
                <br />
                <textarea
                  v-model="description"
                  class="textarea textarea-bordered h-20 w-full"
                  placeholder="备注用途..."
                  :disabled="loading"
                ></textarea>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-error text-sm py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ error }}</span>
          </div>

          <button
            class="btn btn-primary w-full text-base font-medium"
            @click="handleSubmit"
            :disabled="loading || !originalUrl || !title"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <span v-else>生成短链</span>
          </button>
        </div>
      </div>

      <!-- 结果 -->
      <div
        v-if="result"
        class="card bg-base-100 border border-base-300 shadow-sm transition-all duration-300"
      >
        <div class="card-body p-5">
          <div class="flex items-center gap-2 mb-2">
            <div class="badge badge-primary badge-outline">创建成功</div>
          </div>
          <div class="text-xl break-all text-primary font-bold mb-4">{{ result.shortUrl }}</div>

          <div class="grid grid-cols-2 gap-4 border-t border-dashed border-base-300 pt-4">
            <div>
              <div class="text-xs text-base-content/60 mb-1">原始链接</div>
              <div class="font-mono text-sm truncate" :title="result.originalUrl">
                {{ result.originalUrl }}
              </div>
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-1">创建时间</div>
              <div class="font-mono text-sm">{{ result.createdAt || '刚刚' }}</div>
            </div>
            <div v-if="result.title" class="col-span-2">
              <div class="text-xs text-base-content/60 mb-1">标题</div>
              <div class="font-mono text-sm truncate">{{ result.title }}</div>
            </div>
          </div>

          <div class="card-actions justify-start mt-4">
            <button class="btn btn-primary btn-sm" @click="copyResult">复制链接</button>
            <button class="btn btn-outline btn-sm" @click="clearForm">继续创建</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
