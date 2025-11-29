<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllUrlRecord, deleteUrlRecord, type UrlRecord } from '@/api/urlRecord'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'

const urls = ref<UrlRecord[]>([])
const loading = ref(true)
const error = ref('')

const { showToast } = useToast()
const { showConfirm } = useConfirm()

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
      showToast('复制成功', 'success')
    })
    .catch(() => {
      showToast('复制失败，请手动复制', 'error')
    })
}

function openUrl(url: string) {
  window.open(url, '_blank')
}

async function handleDelete(id: number) {
  const confirmed = await showConfirm('确定要删除这个短链接吗？', '删除确认')
  if (!confirmed) return

  try {
    await deleteUrlRecord(id)
    // Remove from local list
    urls.value = urls.value.filter((u) => u.id !== id)
    showToast('删除成功', 'success')
  } catch (err) {
    showToast(err instanceof Error ? err.message : '删除失败', 'error')
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
          <router-link to="/shortener" class="btn btn-primary mt-4">去创建</router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="url in urls"
            :key="url.id"
            class="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 border border-base-200 group"
          >
            <div class="card-body p-6">
              <!-- Header Area -->
              <div class="flex justify-between items-start mb-1 min-h-[5rem]">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5">
                    <h2
                      class="card-title text-xl font-bold text-base-content truncate"
                      :title="url.title || url.urlCode"
                    >
                      {{ url.title || url.urlCode }}
                    </h2>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <div
                      v-if="url.category"
                      class="self-start badge badge-neutral text-neutral-content border-none rounded-md h-6 px-2 text-xs font-normal"
                    >
                      {{ url.category }}
                    </div>
                    <p
                      v-if="url.description"
                      class="text-sm text-base-content/60 truncate w-full"
                      :title="url.description"
                    >
                      {{ url.description }}
                    </p>
                    <!-- Placeholder to maintain height if empty -->
                    <div v-else-if="!url.category" class="h-5"></div>
                  </div>
                </div>

                <button
                  class="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-error -mr-2 -mt-2"
                  @click="handleDelete(url.id)"
                  title="删除"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <!-- URL Display Area -->
              <div class="space-y-3 py-3">
                <!-- Original URL -->
                <div
                  class="bg-base-300 p-3.5 rounded-lg flex items-center justify-between group/origin cursor-pointer hover:bg-base-200 transition-colors h-[3.5rem]"
                  @click="copyUrl(url.originalUrl)"
                  title="点击复制原链接"
                >
                  <div class="font-bold text-sm truncate select-all tracking-wide flex-1 mr-2">
                    {{ url.originalUrl }}
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 text-base-content/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Short URL -->
                <div
                  class="bg-primary/5 border border-primary/10 p-3.5 rounded-lg flex items-center justify-between group/url cursor-pointer hover:bg-primary/10 transition-colors h-[3.5rem]"
                  @click="copyUrl(url.shortUrl)"
                  title="点击复制短链接"
                >
                  <span
                    class="text-primary font-bold text-sm truncate select-all tracking-wide flex-1 mr-2"
                    >{{ url.shortUrl }}</span
                  >
                  <div class="flex items-center gap-1 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 text-base-content/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="card-actions grid grid-cols-2 gap-4 mt-auto pt-2">
                <button
                  class="btn btn-outline btn-primary h-10 min-h-0 text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  @click="openUrl(url.shortUrl)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  访问
                </button>
                <button
                  class="btn btn-primary h-10 min-h-0 text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform text-white shadow-primary/20 shadow-lg"
                  @click="copyUrl(url.shortUrl)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
