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
const search = ref("");

const newName = ref("");
const newPrice = ref("");
const newStock = ref("");

const editId = ref(null);
const editName = ref("");
const editPrice = ref("");
const editStock = ref("");

const currentUser = ref(null);
const adminEmail = "admin@test.com";

const selectedProduct = ref(null);
const customerName = ref("");
const address = ref("");
const phone = ref("");
const quantity = ref(1);

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

function filteredProducts() {
  return products.value.filter(product =>
    product.name.toLowerCase().includes(
      search.value.toLowerCase()
    )
  );
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
  if (!confirm("Sigur doresti sa stergi produsul?")) {
    return;
  }

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

function openOrderForm(product) {
  selectedProduct.value = product;
}

async function sendOrder() {
  if (!customerName.value || !address.value || !phone.value || !quantity.value) {
    alert("Completeaza toate campurile pentru comanda!");
    return;
  }

  if (Number(quantity.value) > Number(selectedProduct.value.stock)) {
    alert("Nu exista suficient stoc pentru acest produs!");
    return;
  }

  await addDoc(collection(db, "orders"), {
    customerEmail: currentUser.value.email,
    customerName: customerName.value,
    address: address.value,
    phone: phone.value,
    productId: selectedProduct.value.id,
    productName: selectedProduct.value.name,
    quantity: Number(quantity.value),
    status: "Noua"
  });
await updateDoc(
  doc(db, "products", selectedProduct.value.id),
  {
    stock: Number(selectedProduct.value.stock) - Number(quantity.value)
  }
);
  alert("Comanda a fost trimisa!");

  selectedProduct.value = null;
  customerName.value = "";
  address.value = "";
  phone.value = "";
  quantity.value = 1;
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
<input
  v-model="search"
  placeholder="Cauta produs..."
/>

<br /><br />
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

    <div v-if="selectedProduct && currentUser && !isAdmin()">
      <h3>Formular comanda</h3>

      <p>Produs ales: {{ selectedProduct.name }}</p>

      <input v-model="customerName" placeholder="Nume complet" />
      <input v-model="address" placeholder="Adresa livrare" />
      <input v-model="phone" placeholder="Telefon" />
      <input v-model="quantity" type="number" placeholder="Cantitate" />

      <button @click="sendOrder">
        Trimite comanda
      </button>
    </div>

<div
  v-for="product in filteredProducts()"
  :key="product.id"
  class="product-card"
>
  <h3 class="title">
    {{ product.name }}
  </h3>

<p><strong>Pret:</strong> {{ product.price }} lei</p>
      <p v-if="isAdmin()">
        Stoc: {{ product.stock }}
      </p>

<button
  v-if="currentUser && !isAdmin() && product.stock > 0"
  @click="openOrderForm(product)"
>
  Comanda
</button>

<p v-if="currentUser && !isAdmin() && product.stock <= 0">
  Stoc epuizat
</p>

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
<style scoped>
.title {
  margin-top: 0;
  margin-bottom: 10px;
}

.product-card {
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
  margin: 3px;
  cursor: pointer;
}
button {
  padding: 6px 12px;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 5px;
}
</style>