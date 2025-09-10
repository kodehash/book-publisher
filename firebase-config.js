// Firebase Configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyABnwWAcWN9A_78B1tW-f45Hc1qTEfU6po",
    authDomain: "roughnotes-audiobook.firebaseapp.com",
    projectId: "roughnotes-audiobook",
    storageBucket: "roughnotes-audiobook.firebasestorage.app",
    messagingSenderId: "177601951559",
    appId: "1:177601951559:web:a3e4612dd5ac585d8bfe62",
    measurementId: "G-LMRLPHG7YN"
  };

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export Firebase functions
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseCollection = collection;
window.firebaseAddDoc = addDoc;
window.firebaseGetDocs = getDocs;
window.firebaseQuery = query;
window.firebaseWhere = where;
window.firebaseOrderBy = orderBy;
window.firebaseLimit = limit;
