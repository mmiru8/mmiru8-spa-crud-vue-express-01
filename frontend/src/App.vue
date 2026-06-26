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
      <h1>Product Order Manager</h1>

      <nav class="nav">
        <RouterLink to="/">Produse</RouterLink>
        <RouterLink to="/orders">Comenzi</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>

        <span v-if="authStore.user">
          {{ authStore.user.email }}
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
  flex-wrap: wrap;
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
@media (max-width: 600px) {
  .app {
    padding: 10px;
  }

  .header h1 {
    font-size: 22px;
  }

  .nav {
    flex-direction: column;
    gap: 8px;
  }

  .nav a,
  .nav button,
  .nav span {
    width: 100%;
  }
}
</style>