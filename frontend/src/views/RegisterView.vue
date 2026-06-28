<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

const email = ref("");
const password = ref("");

const authStore = useAuthStore();

async function register() {
  if (!email.value || !password.value) {
    alert("Completeaza emailul si parola!");
    return;
  }

  if (password.value.length < 6) {
    alert("Parola trebuie sa aiba minim 6 caractere!");
    return;
  }

  await authStore.register(email.value, password.value);

  if (authStore.errorMessage) {
    alert(authStore.errorMessage);
    return;
  }

  alert("Cont creat cu succes!");

  email.value = "";
  password.value = "";
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Înregistrare</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Parolă"
      />

      <button @click="register">
        Creează cont
      </button>
    </div>
  </div>
</template>
