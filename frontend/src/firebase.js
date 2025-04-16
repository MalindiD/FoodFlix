// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAp7FE-5KnU50jvJq4GbvjbbGC1QnOlisw",
    authDomain: "foodflix-43157.firebaseapp.com",
    projectId: "foodflix-43157",
    storageBucket: "foodflix-43157.firebasestorage.app",
    messagingSenderId: "1091975203996",
    appId: "1:1091975203996:web:0a8388b6cf6a66ba9e3159",
    measurementId: "G-5NB0VTNF5K"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
