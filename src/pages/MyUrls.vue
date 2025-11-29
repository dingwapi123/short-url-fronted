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
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取链接列表失败'
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
  } catch (err) {
    alert(err instanceof Error ? err.message : '删除失败')
  }
}

onMounted(() => {
  fetchUrls()
})
</script>

<template>
  <div class="bg-base-200 min-h-screen w-full">
    <div class="max-w-[1200px] mx-auto py-10 px-5 font-sans">
      <h1 class="text-3xl font-bold text-base-content mb-8 text-center">我的链接</h1>

      <div class="card-body">
        <div v-if="loading" class="flex justify-center items-center h-64">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="error" class="alert alert-error">
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

        <div v-else-if="urls.length === 0" class="text-center p-10 text-base-content/60">
          <p>暂无记录</p>
          <router-link to="/" class="btn btn-primary mt-4">去创建</router-link>
        </div>

        <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          <div
            v-for="url in urls"
            :key="url.id"
            class="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div class="card-body p-5">
              <div class="flex items-start justify-between border-b border-base-300 pb-3 mb-3">
                <div class="flex items-start gap-3 overflow-hidden">
                  <span class="text-2xl pt-0.5">🔗</span>
                  <div class="overflow-hidden">
                    <div
                      class="font-bold text-base-content truncate text-lg"
                      :title="url.title || url.urlCode"
                    >
                      {{ url.title || url.urlCode }}
                    </div>
                    <div
                      v-if="url.description"
                      class="text-xs text-base-content/60 truncate"
                      :title="url.description"
                    >
                      {{ url.description }}
                    </div>
                    <div v-if="url.category" class="badge badge-ghost badge-sm mt-1">
                      {{ url.category }}
                    </div>
                  </div>
                </div>
                <button
                  class="btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-error"
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

              <div class="flex flex-col gap-3 mb-4">
                <div
                  class="bg-base-200 p-2 rounded text-xs truncate text-base-content/80"
                  :title="url.originalUrl"
                >
                  {{ url.originalUrl }}
                </div>
                <div class="bg-primary/10 p-2 rounded text-xs truncate text-primary font-medium">
                  {{ url.shortUrl }}
                </div>
              </div>

              <div class="card-actions justify-end mt-auto">
                <button class="btn btn-sm flex-1" @click="openUrl(url.shortUrl)">访问</button>
                <button class="btn btn-sm flex-1" @click="copyUrl(url.shortUrl)">复制</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
