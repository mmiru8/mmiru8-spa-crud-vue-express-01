<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

const email = ref("");
const password = ref("");

async function login() {

  if (!email.value || !password.value) {
    alert("Completeaza emailul si parola!");
    return;
  }

  try {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Autentificare reusita!");

    email.value = "";
    password.value = "";

  } catch (error) {
    alert("Email sau parola incorecta!");
  }
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
