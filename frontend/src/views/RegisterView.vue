<script setup>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

const email = ref("");
const password = ref("");

async function register() {

  if (!email.value || !password.value) {
    alert("Completeaza emailul si parola!");
    return;
  }

  if (password.value.length < 6) {
    alert("Parola trebuie sa aiba minim 6 caractere!");
    return;
  }

  try {
    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Cont creat cu succes!");

    email.value = "";
    password.value = "";

  } catch (error) {
    alert("Eroare la creare cont!");
  }
}
</script>

<template>
  <div>
    <h1>Înregistrare</h1>

    <input
      v-model="email"
      type="email"
      placeholder="Email"
    />

    <br /><br />

    <input
      v-model="password"
      type="password"
      placeholder="Parolă"
    />

    <br /><br />

    <button @click="register">
      Creează cont
    </button>
  </div>
</template>