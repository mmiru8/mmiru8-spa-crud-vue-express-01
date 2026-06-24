<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const products = ref([]);

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));

  products.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

onMounted(() => {
  loadProducts();
});
</script>

<template>
  <div>
    <h1>Produse Unghii</h1>

    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>Pret: {{ product.price }} lei</p>
      <p>Stoc: {{ product.stock }}</p>
      <hr />
    </div>
  </div>
</template>