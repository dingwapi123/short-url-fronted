<script setup lang="ts">
defineOptions({ name: 'UrlRedirectPage' })
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOriginUrl } from '@/api/urlRecord'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const origin = ref('')

/**
 * 根据路由参数短码查询原始链接并跳转
 * - 获取 `urlCode`
 * - 请求后端获取原始链接
 * - 使用 `window.location.href` 跳转
 */
async function redirect() {
  loading.value = true
  error.value = ''
  origin.value = ''

  const code = String(route.params.urlCode || '')
  if (!code) {
    error.value = '无效的短码'
    loading.value = false
    return
  }

  try {
    const { data } = await getOriginUrl(code)
    if (!data) {
      throw new Error('未获取到原始链接')
    }
    origin.value = data
    window.location.href = data
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  redirect()
})
</script>

<template>
  <div class="bg-base-200 min-h-screen w-full">
    <div class="max-w-[720px] mx-auto py-10 px-5 font-sans">
      <h1 class="text-3xl font-bold text-base-content mb-8 text-center">正在跳转</h1>
      <p v-if="loading">请稍候…</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <p v-else>
        如果没有自动跳转，
        <a :href="origin" target="_self" rel="noopener">点击这里</a>
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
.error {
  color: #e74c3c;
}
</style>
