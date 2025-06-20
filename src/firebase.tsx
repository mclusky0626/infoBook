// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmWel9QO52BJ44CZBk29ZxvEANH8yqFgU",
  authDomain: "baegeoninfo.firebaseapp.com",
  projectId: "baegeoninfo",
  storageBucket: "baegeoninfo.firebasestorage.app",
  messagingSenderId: "494085418811",
  appId: "1:494085418811:web:d2a7f7d845bfdb975ed11e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);