<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

const email = ref("");
const password = ref("");

const authStore = useAuthStore();

async function login() {
  if (!email.value || !password.value) {
    alert("Completeaza emailul si parola!");
    return;
  }

  await authStore.login(email.value, password.value);

  if (authStore.errorMessage) {
    alert(authStore.errorMessage);
    return;
  }

  alert("Autentificare reusita!");

  email.value = "";
  password.value = "";
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Autentificare</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Parola"
      />

      <button @click="login">
        Intră în cont
      </button>
    </div>
  </div>
</template>
