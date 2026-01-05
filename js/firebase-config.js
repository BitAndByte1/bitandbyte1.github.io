import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA9qrSotTbXsO5SnyaxQblVh8h3ieApYtU",
    authDomain: "bitnbyte-f0d63.firebaseapp.com",
    projectId: "bitnbyte-f0d63",
    storageBucket: "bitnbyte-f0d63.firebasestorage.app",
    messagingSenderId: "352018846884",
    appId: "1:352018846884:web:3041ecd7dc07cba32a4231"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
