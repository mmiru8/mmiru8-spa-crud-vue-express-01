<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Product Order Manager</h1>

      <nav class="nav">
        <RouterLink to="/">Produse</RouterLink>
        <RouterLink to="/orders">Comenzi</RouterLink>
      </nav>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  padding-bottom: 15px;
}

.nav {
  display: flex;
  gap: 15px;
}

.nav a {
  color: #333;
  text-decoration: none;
}

.nav a.router-link-active {
  font-weight: bold;
}

.main {
  margin-top: 20px;
}
</style>