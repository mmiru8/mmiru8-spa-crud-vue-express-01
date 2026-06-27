<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "../stores/authStore";

const orders = ref([]);
const products = ref([]);

const authStore = useAuthStore();
const adminEmail = "admin@test.com";

const customerName = ref("");
const selectedProductId = ref("");
const quantity = ref("");

function isAdmin() {
  return authStore.user &&
         authStore.user.email === adminEmail;
}

function loadOrders() {
  onSnapshot(
    collection(db, "orders"),
    (querySnapshot) => {
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
  );
}

function loadProducts() {
  onSnapshot(
    collection(db, "products"),
    (querySnapshot) => {
      products.value = querySnapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category
        };
      });
    }
  );
}

async function addOrder() {
  if (!customerName.value || !selectedProductId.value || !quantity.value) {
    alert("Completeaza toate campurile!");
    return;
  }
  if (Number(quantity.value) <= 0) {
  alert("Cantitatea trebuie sa fie mai mare decat 0!");
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
}

async function markAsSent(id) {
  await updateDoc(
    doc(db, "orders", id),
    {
      status: "Expediata"
    }
  );
}

onMounted(() => {
  loadOrders();
  loadProducts();
  authStore.listenToAuthChanges();
});
</script>

<template>
  <div>
    <h1>Comenzi</h1>

    <p v-if="authStore.user">
      Utilizator: {{ authStore.user.email }}
    </p>

    <p v-if="isAdmin()">
      Cont administrator
    </p>

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
