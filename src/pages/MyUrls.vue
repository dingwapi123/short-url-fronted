<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllUrlRecord, deleteUrlRecord, updateUrlRecord, type UrlRecord } from '@/api/urlRecord'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'

const urls = ref<UrlRecord[]>([])
const loading = ref(true)
const error = ref('')

const editModalOpen = ref(false)
const editingUrl = ref<UrlRecord | null>(null)
const editForm = ref({
  title: '',
  category: '',
  description: '',
  urlCode: '',
})
const updating = ref(false)

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

function openEditModal(url: UrlRecord) {
  editingUrl.value = url
  editForm.value = {
    title: url.title || '',
    category: url.category || '',
    description: url.description || '',
    urlCode: url.urlCode || '',
  }
  editModalOpen.value = true
}

async function handleUpdate() {
  if (!editingUrl.value) return

  if (!editForm.value.title.trim()) {
    showToast('标题不能为空', 'error')
    return
  }

  if (!editForm.value.urlCode.trim()) {
    showToast('自定义后缀不能为空', 'error')
    return
  }

  try {
    updating.value = true
    const res = await updateUrlRecord(editingUrl.value.id, {
      title: editForm.value.title,
      category: editForm.value.category,
      description: editForm.value.description,
      urlCode: editForm.value.urlCode,
    })

    if (res.data) {
      // Update local list
      const index = urls.value.findIndex((u) => u.id === editingUrl.value!.id)
      if (index !== -1) {
        urls.value[index] = { ...urls.value[index], ...res.data }
      }
      showToast('修改成功', 'success')
      editModalOpen.value = false
    }
  } catch (err) {
    showToast(err instanceof Error ? err.message : '修改失败', 'error')
  } finally {
    updating.value = false
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
              <div class="flex justify-between items-start mb-1 relative">
                <div class="flex-1 min-w-0 mr-8">
                  <div class="flex items-center gap-2 mb-1.5">
                    <h2
                      class="card-title text-xl font-bold text-base-content truncate"
                      :title="url.title"
                    >
                      {{ url.title }}
                    </h2>
                  </div>
                </div>

                <button
                  class="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-error -mr-2 -mt-2 absolute top-0 right-0"
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

              <!-- description Area -->
              <div class="flex justify-end mb-2 min-h-[2.5rem]">
                <p
                  v-if="url.description"
                  class="text-sm text-base-content/60 line-clamp-2 w-full break-all whitespace-pre-wrap"
                  :title="url.description"
                >
                  {{ url.description }}
                </p>
              </div>

              <!-- Category Badge Area (Right Aligned) -->
              <div class="flex justify-end mb-2 h-6">
                <div
                  v-if="url.category"
                  class="badge badge-neutral text-neutral-content border-none rounded-md h-6 px-2 text-xs font-normal"
                >
                  {{ url.category }}
                </div>
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
                  @click="openEditModal(url)"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  修改
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editModalOpen" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">修改短链接信息</h3>

        <div class="form-control w-full mb-3">
          <label class="label">
            <span class="label-text">标题</span>
          </label>
          <input
            v-model="editForm.title"
            type="text"
            class="input input-bordered w-full"
            placeholder="请输入标题"
          />
        </div>

        <div class="form-control w-full mb-3">
          <label class="label">
            <span class="label-text">自定义后缀 (urlCode)</span>
          </label>
          <input
            v-model="editForm.urlCode"
            type="text"
            class="input input-bordered w-full"
            placeholder="请输入自定义后缀"
          />
        </div>

        <div class="form-control w-full mb-3">
          <label class="label">
            <span class="label-text">分类</span>
          </label>
          <input
            v-model="editForm.category"
            type="text"
            class="input input-bordered w-full"
            placeholder="请输入分类"
          />
        </div>

        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">描述</span>
          </label>
          <br />
          <textarea
            v-model="editForm.description"
            class="textarea textarea-bordered w-full h-24"
            placeholder="请输入描述"
          ></textarea>
        </div>

        <div class="modal-action">
          <button class="btn" @click="editModalOpen = false" :disabled="updating">取消</button>
          <button class="btn btn-primary" @click="handleUpdate" :disabled="updating">
            <span v-if="updating" class="loading loading-spinner"></span>
            保存
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="editModalOpen = false">close</button>
      </form>
    </div>
  </div>
</template>
