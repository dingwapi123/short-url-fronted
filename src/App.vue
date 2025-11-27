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
  border-bottom: 1px solid #eee;
}
.nav {
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 16px;
}
.logo {
  font-weight: 600;
  color: #42b883;
  text-decoration: none;
}
</style>
