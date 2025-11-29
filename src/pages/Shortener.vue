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
  <div class="max-w-[860px] mx-auto my-8 px-5">
    <div
      class="bg-card border border-border rounded-xl shadow-sm p-5 transition-colors duration-300"
    >
      <div class="flex items-baseline justify-between mb-2">
        <h1 class="text-[22px] m-0 mb-2 text-foreground font-normal">创建短链接</h1>
        <span class="text-foreground/60 text-[13px]">快速生成简短易记的链接</span>
      </div>

      <div class="grid gap-3">
        <div>
          <div class="text-[13px] text-foreground/80 mb-1.5">原始链接</div>
          <textarea
            v-model="originalUrl"
            class="h-auto min-h-[96px] resize-y leading-relaxed font-inherit p-2.5 border border-border rounded-lg outline-none bg-background text-foreground w-full transition-colors duration-200 focus:border-primary focus:bg-card"
            placeholder="请输入需要缩短的长链接 (http:// or https://)..."
            :disabled="loading"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <span class="text-foreground/50 text-xs">{{ originalUrl.length }} 字符</span>
            <button
              v-if="originalUrl"
              class="bg-transparent border border-border text-foreground/80 rounded-md h-[30px] px-2.5 cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary hover:opacity-100"
              @click="clearForm"
            >
              清空
            </button>
          </div>
        </div>

        <div class="mt-0.5">
          <button
            class="border-none bg-none text-primary cursor-pointer p-0 text-[13px]"
            @click="showAdvanced = !showAdvanced"
          >
            {{ showAdvanced ? '收起高级选项' : '展开高级选项' }}
          </button>

          <div v-if="showAdvanced" class="mt-3 grid gap-3">
            <div>
              <div class="text-[13px] text-foreground/80 mb-1.5">自定义后缀 (可选)</div>
              <input
                v-model="customAlias"
                type="text"
                class="h-10 p-2.5 border border-border rounded-lg outline-none bg-background text-foreground w-full transition-colors duration-200 focus:border-primary focus:bg-card"
                placeholder="例如: my-link"
                :disabled="loading"
              />
            </div>

            <div>
              <div class="text-[13px] text-foreground/80 mb-1.5">标题 (可选)</div>
              <input
                v-model="title"
                type="text"
                class="h-10 p-2.5 border border-border rounded-lg outline-none bg-background text-foreground w-full transition-colors duration-200 focus:border-primary focus:bg-card"
                placeholder="给链接起个名字..."
                :disabled="loading"
              />
            </div>

            <div>
              <div class="text-[13px] text-foreground/80 mb-1.5">分类 (可选)</div>
              <input
                v-model="category"
                type="text"
                class="h-10 p-2.5 border border-border rounded-lg outline-none bg-background text-foreground w-full transition-colors duration-200 focus:border-primary focus:bg-card"
                placeholder="例如: 工作, 个人, 营销..."
                :disabled="loading"
              />
            </div>

            <div>
              <div class="text-[13px] text-foreground/80 mb-1.5">描述 (可选)</div>
              <textarea
                v-model="description"
                class="h-20 resize-y p-2.5 border border-border rounded-lg outline-none bg-background text-foreground w-full transition-colors duration-200 focus:border-primary focus:bg-card"
                placeholder="备注用途..."
                :disabled="loading"
              ></textarea>
            </div>
          </div>
        </div>

        <div
          v-if="error"
          class="mt-4 p-2.5 rounded-lg text-sm bg-red-500/10 text-red-500 border border-red-500/20"
        >
          {{ error }}
        </div>

        <button
          class="h-[42px] bg-primary border-none text-primary-foreground rounded-lg cursor-pointer transition-opacity duration-200 font-medium flex items-center justify-center hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
          @click="handleSubmit"
          :disabled="loading || !originalUrl"
        >
          <span
            v-if="loading"
            class="w-[18px] h-[18px] rounded-full border-2 border-white/50 border-t-white inline-block animate-spin"
          ></span>
          <span v-else>生成短链</span>
        </button>
      </div>
    </div>

    <!-- Result Card -->
    <div
      v-if="result"
      class="mt-[18px] border border-border rounded-xl shadow-sm bg-card transition-colors duration-300"
    >
      <div class="p-4 pb-0">
        <span
          class="inline-block text-xs text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5"
          >创建成功</span
        >
        <div class="my-2.5 mr-4 text-lg break-all text-primary font-semibold">
          {{ result.shortUrl }}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 p-4 pb-4">
        <div class="border-t border-dashed border-border pt-3">
          <div class="text-xs text-foreground/60 mb-1">原始链接</div>
          <div class="font-mono text-foreground text-[13px] truncate" :title="result.originalUrl">
            {{ result.originalUrl }}
          </div>
        </div>
        <div class="border-t border-dashed border-border pt-3">
          <div class="text-xs text-foreground/60 mb-1">创建时间</div>
          <div class="font-mono text-foreground text-[13px]">{{ result.createdAt || '刚刚' }}</div>
        </div>
        <div class="border-t border-dashed border-border pt-3" v-if="result.title">
          <div class="text-xs text-foreground/60 mb-1">标题</div>
          <div class="font-mono text-foreground text-[13px] truncate">{{ result.title }}</div>
        </div>
      </div>

      <div class="px-4 pb-4">
        <div class="flex gap-2 mt-2">
          <button
            class="h-8 px-3 border-none text-primary-foreground bg-primary rounded-md cursor-pointer transition-opacity duration-200 text-[13px] font-medium hover:opacity-90"
            @click="copyResult"
          >
            复制链接
          </button>
          <button
            class="h-8 px-3 bg-transparent border border-border text-foreground/80 rounded-md cursor-pointer transition-all duration-200 text-[13px] hover:border-primary hover:text-primary hover:opacity-100"
            @click="result = null"
          >
            继续创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
