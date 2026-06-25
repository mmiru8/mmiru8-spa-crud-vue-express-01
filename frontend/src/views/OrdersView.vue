<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";import { db } from "../services/firebase";

const orders = ref([]);
const products = ref([]);

const customerName = ref("");
const selectedProductId = ref("");
const quantity = ref("");

async function loadOrders() {
  const querySnapshot = await getDocs(
    collection(db, "orders")
  );

  orders.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function loadProducts() {
  const querySnapshot = await getDocs(
    collection(db, "products")
  );

  products.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function addOrder() {
  if (!customerName.value || !selectedProductId.value || !quantity.value) {
    alert("Completeaza toate campurile!");
    return;
  }

  const selectedProduct = products.value.find(product => {
    return product.id === selectedProductId.value;
  });
if (Number(quantity.value) > Number(selectedProduct.stock)) {
  alert("Nu exista suficient stoc pentru acest produs!");
  return;
}
  await addDoc(collection(db, "orders"), {
    customerName: customerName.value,
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    quantity: Number(quantity.value),
    status: "Noua"
  });

  customerName.value = "";
  selectedProductId.value = "";
  quantity.value = "";

  loadOrders();
}
async function markAsSent(id) {
  await updateDoc(
    doc(db, "orders", id),
    {
      status: "Expediata"
    }
  );

  loadOrders();
}
onMounted(() => {
  loadOrders();
  loadProducts();
});
</script>

<template>
  <div>
    <h1>Comenzi</h1>

    <h3>Adauga comanda</h3>

    <input
      v-model="customerName"
      placeholder="Nume client"
    />

    <select v-model="selectedProductId">
      <option value="">
        Alege produs
      </option>

      <option
        v-for="product in products"
        :key="product.id"
        :value="product.id"
      >
        {{ product.name }}
      </option>
    </select>

    <input
      v-model="quantity"
      type="number"
      placeholder="Cantitate"
    />

    <button @click="addOrder">
      Adauga comanda
    </button>

    <hr />

    <div
      v-for="order in orders"
      :key="order.id"
    >
      <h3>{{ order.customerName }}</h3>
      <p>Produs: {{ order.productName }}</p>
      <p>Cantitate: {{ order.quantity }}</p>

      <button
  v-if="order.status === 'Noua'"
  @click="markAsSent(order.id)"
>
  Marcheaza ca expediata
</button>
      <hr />
    </div>
  </div>
</template>