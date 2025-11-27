<script setup lang="ts"></script>

<template>
  <header class="header">
    <nav class="nav">
      <router-link class="logo" to="/">Short URL</router-link>
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
}
.logo {
  font-weight: 700;
  color: #2fa06e;
  text-decoration: none;
}
</style>
