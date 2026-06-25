import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const errorMessage = ref("");

  function listenToAuthChanges() {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });
  }

  async function register(email, password) {
    try {
      errorMessage.value = "";
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      errorMessage.value = "Nu s-a putut crea contul.";
    }
  }

  async function login(email, password) {
    try {
      errorMessage.value = "";
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      errorMessage.value = "Email sau parola incorecta.";
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return {
    user,
    errorMessage,
    listenToAuthChanges,
    register,
    login,
    logout
  };
});