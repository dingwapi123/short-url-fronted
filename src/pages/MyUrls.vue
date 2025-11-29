<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllUrlRecord, deleteUrlRecord, type UrlRecord } from '@/api/urlRecord'

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

async function handleDelete(id: number) {
  if (!confirm('确定要删除这个短链接吗？')) return

  try {
    await deleteUrlRecord(id)
    // Remove from local list
    urls.value = urls.value.filter((u) => u.id !== id)
  } catch (err: any) {
    alert(err.message || '删除失败')
  }
}

onMounted(() => {
  fetchUrls()
})
</script>

<template>
  <div class="max-w-[1200px] mx-auto my-10 px-5 font-sans">
    <h1 class="text-[28px] font-semibold text-foreground mb-6 text-center">我的链接</h1>

    <div class="bg-card rounded-xl shadow-sm p-8 min-h-[400px] transition-colors duration-300">
      <div v-if="loading" class="text-center p-10 text-foreground/60">加载中...</div>

      <div v-else-if="error" class="text-center p-10 text-red-500 opacity-100">
        {{ error }}
      </div>

      <div v-else-if="urls.length === 0" class="text-center p-10 text-foreground/60">暂无记录</div>

      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 mb-8">
        <div
          v-for="url in urls"
          :key="url.id"
          class="bg-card border border-border rounded-lg p-4 transition-all duration-300 flex flex-col hover:shadow-md hover:border-border hover:-translate-y-0.5"
        >
          <div class="flex items-start gap-2.5 mb-3 pb-3 border-b border-border">
            <span class="text-xl leading-none pt-0.5">🔗</span>
            <div class="overflow-hidden">
              <div
                class="font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis text-base mb-0.5"
                :title="url.title || url.urlCode"
              >
                {{ url.title || url.urlCode }}
              </div>
              <div
                v-if="url.description"
                class="text-xs text-foreground/60 whitespace-nowrap overflow-hidden text-ellipsis"
                :title="url.description"
              >
                {{ url.description }}
              </div>
              <div
                v-if="url.category"
                class="inline-block text-[11px] mt-1 px-1.5 py-0.5 bg-foreground/10 text-foreground rounded opacity-80"
              >
                {{ url.category }}
              </div>
            </div>
            <button
              class="bg-transparent border-none text-foreground/40 cursor-pointer p-1 rounded ml-auto transition-all duration-200 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
              @click="handleDelete(url.id)"
              title="删除"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>

          <div class="flex-1 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <div
                class="text-[13px] leading-normal whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1 bg-background rounded text-foreground/80 transition-colors duration-300"
                :title="url.originalUrl"
              >
                {{ url.originalUrl }}
              </div>
              <div
                class="text-[13px] leading-normal whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1 bg-primary/10 rounded text-primary opacity-100 transition-colors duration-300"
              >
                {{ url.shortUrl }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-auto">
              <button
                class="h-9 rounded-md border border-border cursor-pointer text-sm transition-all duration-200 font-medium bg-transparent text-foreground hover:text-primary hover:border-primary"
                @click="copyUrl(url.shortUrl)"
              >
                复制
              </button>
              <button
                class="h-9 rounded-md border-none cursor-pointer text-sm transition-all duration-200 font-medium bg-primary text-primary-foreground hover:opacity-90"
                @click="openUrl(url.shortUrl)"
              >
                访问
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
