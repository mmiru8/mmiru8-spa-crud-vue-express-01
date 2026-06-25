<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const products = ref([]);

const newName = ref("");
const newPrice = ref("");
const newStock = ref("");

const currentUser = ref(null);
const adminEmail = "admin@test.com";

const editId = ref(null);
const editName = ref("");
const editPrice = ref("");
const editStock = ref("");

function isAdmin() {
  return currentUser.value &&
         currentUser.value.email === adminEmail;
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

async function addProduct() {
  if (!newName.value || !newPrice.value || !newStock.value) {
    alert("Completeaza toate campurile!");
    return;
  }

  await addDoc(collection(db, "products"), {
    name: newName.value,
    price: Number(newPrice.value),
    stock: Number(newStock.value)
  });

  newName.value = "";
  newPrice.value = "";
  newStock.value = "";

  loadProducts();
}

async function deleteProduct(id) {
  await deleteDoc(
    doc(db, "products", id)
  );

  loadProducts();
}
function editProduct(product) {
  editId.value = product.id;
  editName.value = product.name;
  editPrice.value = product.price;
  editStock.value = product.stock;
}
async function updateProduct() {
  await updateDoc(
    doc(db, "products", editId.value),
    {
      name: editName.value,
      price: Number(editPrice.value),
      stock: Number(editStock.value)
    }
  );

  editId.value = null;
  editName.value = "";
  editPrice.value = "";
  editStock.value = "";

  loadProducts();
}
onMounted(() => {
  loadProducts();

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
});
</script>

<template>
  <div>
    <h1>Produse Unghii</h1>

    <p v-if="currentUser">
      Utilizator: {{ currentUser.email }}
    </p>

    <p v-if="isAdmin()">
      Cont administrator
    </p>

    <div v-if="isAdmin()">
      <h3>Adauga produs</h3>

      <input v-model="newName" placeholder="Nume produs" />
      <input v-model="newPrice" type="number" placeholder="Pret" />
      <input v-model="newStock" type="number" placeholder="Stoc" />

      <button @click="addProduct">
        Adauga
      </button>
    </div>

    <div v-if="isAdmin() && editId">
      <h3>Editeaza produs</h3>

      <input v-model="editName" placeholder="Nume produs" />
      <input v-model="editPrice" type="number" placeholder="Pret" />
      <input v-model="editStock" type="number" placeholder="Stoc" />

      <button @click="updateProduct">
        Salveaza modificarile
      </button>
    </div>

    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>Pret: {{ product.price }} lei</p>
      <p>Stoc: {{ product.stock }}</p>

      <button
        v-if="isAdmin()"
        @click="editProduct(product)"
      >
        Editeaza
      </button>

      <button
        v-if="isAdmin()"
        @click="deleteProduct(product.id)"
      >
        Sterge
      </button>

      <hr />
    </div>
  </div>
</template>