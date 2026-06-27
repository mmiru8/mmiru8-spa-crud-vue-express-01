<script setup>
import { RouterLink, RouterView } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();

onMounted(() => {
  authStore.listenToAuthChanges();
});

async function logout() {
  await authStore.logout();
  alert("Te-ai deconectat.");
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Manistyle</h1>

      <nav class="nav">
        <RouterLink to="/">Produse</RouterLink>
        <RouterLink to="/orders">Comenzi</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>

<span v-if="authStore.user">
  👤 {{ authStore.user.email }}
</span>

        <button
          v-if="authStore.user"
          @click="logout"
        >
          Logout
        </button>
      </nav>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
