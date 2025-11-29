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
  <header class="header">
    <nav class="nav">
      <div class="nav-left">
        <router-link class="logo" to="/">Short URL</router-link>
      </div>
      <div class="nav-right">
        <!-- Navigation Links: "我的" before "创建" -->
        <router-link class="nav-link" to="/my-urls">我的</router-link>
        <router-link class="nav-link" to="/">创建</router-link>

        <!-- Theme Toggle Button -->
        <button
          class="theme-toggle"
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

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: saturate(180%) blur(8px);
  background-color: color-mix(in srgb, var(--background), transparent 20%);
  border-bottom: 1px solid var(--border);
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.nav {
  max-width: 1000px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  font-size: 18px;
}

.nav-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: var(--foreground);
  opacity: 0.7;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition:
    color 0.2s,
    opacity 0.2s;
}

.nav-link:hover {
  color: var(--primary);
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--primary);
  opacity: 1;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--foreground);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.theme-toggle:hover {
  color: var(--primary);
  background-color: color-mix(in srgb, var(--primary), transparent 90%);
}
</style>
