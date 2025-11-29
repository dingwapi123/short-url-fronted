<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function initTheme() {
  // 1. Check local storage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // 2. Check system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  initTheme()
  // Listen for system changes if no user preference is saved
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
      applyTheme()
    }
  })
})
</script>

<template>
  <header
    class="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b border-border transition-colors duration-300"
  >
    <nav class="max-w-[1000px] mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center">
        <router-link class="font-bold text-primary text-lg no-underline" to="/"
          >Short URL</router-link
        >
      </div>
      <div class="flex gap-5 items-center">
        <!-- Navigation Links: "我的" before "创建" -->
        <router-link
          class="text-sm font-medium text-foreground/70 no-underline transition-all hover:text-primary hover:opacity-100 [&.router-link-active]:text-primary [&.router-link-active]:opacity-100"
          to="/"
          >我的</router-link
        >
        <router-link
          class="text-sm font-medium text-foreground/70 no-underline transition-all hover:text-primary hover:opacity-100 [&.router-link-active]:text-primary [&.router-link-active]:opacity-100"
          to="/shortener"
          >创建</router-link
        >

        <!-- Theme Toggle Button -->
        <button
          class="bg-transparent border-none cursor-pointer text-foreground p-1 rounded flex items-center justify-center transition-colors hover:text-primary hover:bg-primary/10"
          @click="toggleTheme"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <!-- Sun Icon -->
          <svg
            v-if="!isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Moon Icon -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>
