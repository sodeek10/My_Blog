// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKXbOVOj2T3RpCTesbbB2xTSXQuoZBuXs",
  authDomain: "midel-solutions.firebaseapp.com",
  projectId: "midel-solutions",
  storageBucket: "midel-solutions.firebasestorage.app",
  messagingSenderId: "564034901205",
  appId: "1:564034901205:web:4914e03e66df8ee6f8fe5c",
  measurementId: "G-JP8TW2NX5H",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
