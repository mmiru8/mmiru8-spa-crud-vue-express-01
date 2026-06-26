<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const orders = ref([]);
const products = ref([]);

const currentUser = ref(null);
const adminEmail = "admin@test.com";

const customerName = ref("");
const selectedProductId = ref("");
const quantity = ref("");

function isAdmin() {
  return currentUser.value &&
         currentUser.value.email === adminEmail;
}

async function loadOrders() {
  const querySnapshot = await getDocs(
    collection(db, "orders")
  );

  orders.value = querySnapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      customerName: data.customerName,
      productId: data.productId,
      productName: data.productName,
      quantity: data.quantity,
      status: data.status
    };
  });
}

async function loadProducts() {
  const querySnapshot = await getDocs(
    collection(db, "products")
  );

  products.value = querySnapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      stock: data.stock
    };
  });
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

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
});
</script>

<template>
  <div>
    <h1>Comenzi</h1>

    <div v-if="isAdmin()">
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
    </div>

    <hr />

    <div
      v-for="order in orders"
      :key="order.id"
      class="order-card"
    >
      <h3>{{ order.customerName }}</h3>

      <p>Produs: {{ order.productName }}</p>

      <p>Cantitate: {{ order.quantity }}</p>

      <p>Status: {{ order.status }}</p>

      <button
        v-if="isAdmin() && order.status === 'Noua'"
        @click="markAsSent(order.id)"
      >
        Marcheaza ca expediata
      </button>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 6px;
}

input,
select {
  padding: 8px;
  margin: 5px 0;
  width: 250px;
}

button {
  padding: 6px 12px;
  margin: 3px;
  cursor: pointer;
  border-radius: 5px;
}

@media (max-width: 600px) {
  input,
  select,
  button {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>