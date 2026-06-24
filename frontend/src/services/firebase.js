import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNak0Er7s4LKmTuOdlKXJI10KshQpMPKo",
  authDomain: "spa-crud-vue-express-01.firebaseapp.com",
  projectId: "spa-crud-vue-express-01",
  storageBucket: "spa-crud-vue-express-01.firebasestorage.app",
  messagingSenderId: "715630339000",
  appId: "1:715630339000:web:592ab7866443e7ce66e54d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };