<script setup lang="ts"></script>

<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-left">
        <router-link class="logo" to="/">Short URL</router-link>
      </div>
      <div class="nav-right">
        <router-link class="nav-link" to="/">创建</router-link>
        <router-link class="nav-link" to="/my-urls">我的</router-link>
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
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #eee;
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
  color: #3eb37f;
  text-decoration: none;
  font-size: 18px;
}
.nav-right {
  display: flex;
  gap: 20px;
}
.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
.nav-link:hover {
  color: #3eb37f;
}
.nav-link.router-link-active {
  color: #3eb37f;
}
</style>
