<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "../stores/authStore";

const products = ref([]);
const search = ref("");
const sortOption = ref("");

const newName = ref("");
const newPrice = ref("");
const newStock = ref("");
const newCategory = ref("");

const editId = ref(null);
const editName = ref("");
const editPrice = ref("");
const editStock = ref("");
const editCategory = ref("");

const authStore = useAuthStore();
const adminEmail = "admin@test.com";

const selectedProduct = ref(null);
const customerName = ref("");
const address = ref("");
const phone = ref("");
const quantity = ref(1);

function isAdmin() {
  return authStore.user &&
         authStore.user.email === adminEmail;
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

function filteredProducts() {
  let result = products.value.filter(product =>
    product.name.toLowerCase().includes(
      search.value.toLowerCase()
    )
  );

  if (sortOption.value === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sortOption.value === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sortOption.value === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

function totalProducts() {
  return filteredProducts().length;
}

function totalStock() {
  return products.value.reduce((total, product) => {
    return total + Number(product.stock);
  }, 0);
}

function averagePrice() {

  if (products.value.length === 0) {
    return 0;
  }

  const total = products.value.reduce((sum, product) => {
    return sum + Number(product.price);
  }, 0);

  return (total / products.value.length).toFixed(2);

}

async function addProduct() {
  if (!newName.value || !newPrice.value || newStock.value === "" || !newCategory.value) {
    alert("Completeaza toate campurile!");
    return;
  }

  if (Number(newPrice.value) <= 0) {
  alert("Pretul trebuie sa fie mai mare decat 0!");
  return;
}

if (Number(newStock.value) < 0) {
  alert("Stocul nu poate fi negativ!");
  return;
}

await addDoc(collection(db, "products"), {
  name: newName.value,
  price: Number(newPrice.value),
  category: newCategory.value,
  stock: Number(newStock.value),
  createdAt: serverTimestamp()
});


  newName.value = "";
  newPrice.value = "";
  newStock.value = "";
  newCategory.value = "";

}

async function deleteProduct(id) {
  if (!confirm("Sigur doresti sa stergi produsul?")) {
    return;
  }

  await deleteDoc(
    doc(db, "products", id)
  );

}

function editProduct(product) {
  editId.value = product.id;
  editName.value = product.name;
  editPrice.value = product.price;
  editStock.value = product.stock;
  editCategory.value = product.category;
}

async function updateProduct() {
if (!editName.value || !editPrice.value || editStock.value === "" || !editCategory.value) {
    alert("Completeaza toate campurile!");
  return;
}

if (Number(editPrice.value) <= 0) {
  alert("Pretul trebuie sa fie mai mare decat 0!");
  return;
}

if (Number(editStock.value) < 0) {
  alert("Stocul nu poate fi negativ!");
  return;
}
  await updateDoc(
    doc(db, "products", editId.value),
    {
      name: editName.value,
      price: Number(editPrice.value),
      stock: Number(editStock.value),
      category: editCategory.value
    }
  );

  editId.value = null;
  editName.value = "";
  editPrice.value = "";
  editStock.value = "";
  editCategory.value = "";

}
function cancelEdit() {
  editId.value = null;
  editName.value = "";
  editPrice.value = "";
  editStock.value = "";
  editCategory.value = "";
}
function openOrderForm(product) {
  selectedProduct.value = product;
}

async function sendOrder() {
  if (!authStore.user) {
  alert("Trebuie sa fii autentificat pentru a trimite comanda!");
  return;
}
  if (!customerName.value || !address.value || !phone.value || !quantity.value) {
    alert("Completeaza toate campurile pentru comanda!");
    return;
  }
  if (Number(quantity.value) <= 0) {
  alert("Cantitatea trebuie sa fie mai mare decat 0!");
  return;
}

if (phone.value.length < 10) {
  alert("Numarul de telefon trebuie sa aiba minim 10 cifre!");
  return;
}
  if (Number(quantity.value) > Number(selectedProduct.value.stock)) {
    alert("Nu exista suficient stoc pentru acest produs!");
    return;
  }

await addDoc(collection(db, "orders"), {
  customerEmail: authStore.user.email,
  customerName: customerName.value,
  address: address.value,
  phone: phone.value,
  productId: selectedProduct.value.id,
  productName: selectedProduct.value.name,
  quantity: Number(quantity.value),
  status: "Noua",
  createdAt: serverTimestamp()
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
  authStore.listenToAuthChanges();
});
</script>

<template>
<div class="page">
  
  <h1>Produse Unghii</h1>

    <input
      v-model="search"
      placeholder="Cauta produs..."
    />

    <select v-model="sortOption">
      <option value="">Fara sortare</option>
      <option value="price-asc">Pret crescator</option>
      <option value="price-desc">Pret descrescator</option>
      <option value="name-asc">Nume A-Z</option>
    </select>

    <p v-if="authStore.user">
      Utilizator: {{ authStore.user.email }}
    </p>

    <p v-if="isAdmin()">
      Cont administrator
    </p>

   <p v-if="isAdmin()">
  Total produse: {{ totalProducts() }}
</p>

<p v-if="isAdmin()">
  Total stoc: {{ totalStock() }}
</p>



<div v-if="isAdmin()">
      <h3>Adauga produs</h3>

      <input v-model="newName" placeholder="Nume produs" />
      <input v-model="newPrice" type="number" placeholder="Pret" />
      <input v-model="newStock" type="number" placeholder="Stoc" />
      <input v-model="newCategory" placeholder="Categorie" />

      <button @click="addProduct">
        Adauga
      </button>
    </div>

<div v-if="isAdmin() && editId">
  <h3>Editeaza produs</h3>

  <input v-model="editName" placeholder="Nume produs" />
  <input v-model="editPrice" type="number" placeholder="Pret" />
  <input v-model="editStock" type="number" placeholder="Stoc" />
  <input v-model="editCategory" placeholder="Categorie" />

  <button @click="updateProduct">
    Salveaza modificarile
  </button>

  <button @click="cancelEdit">
    Anuleaza
  </button>
</div>
    <div v-if="selectedProduct && authStore.user && !isAdmin()">
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
      <p v-if="filteredProducts().length === 0">
        Nu exista produse.
      </p>
    <div
      v-for="product in filteredProducts()"
      :key="product.id"
      class="product-card"
    >
      <h3 class="title">
        {{ product.name }}
      </h3>

      <p><strong>Pret:</strong> {{ product.price }} lei</p>

      <p>
        <strong>Categorie:</strong> {{ product.category }}
      </p>

      <p v-if="isAdmin()">
        Stoc: {{ product.stock }}
      </p>

      <button
        v-if="authStore.user && !isAdmin() && product.stock > 0"
        @click="openOrderForm(product)"
      >
        Comanda
      </button>

      <p v-if="authStore.user && !isAdmin() && product.stock <= 0">
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
    </div>
  </div>
</template>
