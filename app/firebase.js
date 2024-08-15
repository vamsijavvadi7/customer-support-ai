// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiDe25EJjXrkxsUmdWV_8nPUc0xOpKoqs",
  authDomain: "chatbot-c1bf3.firebaseapp.com",
  projectId: "chatbot-c1bf3",
  storageBucket: "chatbot-c1bf3.appspot.com",
  messagingSenderId: "451204478250",
  appId: "1:451204478250:web:a069135731e484e6fe9a53"
};


const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
