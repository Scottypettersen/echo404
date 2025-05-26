// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// ← your web app config from the console
const firebaseConfig = {
  apiKey: "AIza…",
  authDomain: "echo404-8f287.firebaseapp.com",
  projectId: "echo404-8f287",
  storageBucket: "echo404-8f287.appspot.com",
  messagingSenderId: "444571208682",
  appId: "1:444571208682:web:92d27e0c6261313f7f0093"
};

const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// Ensure every user is signed in anonymously (so we get a stable uid)
signInAnonymously(auth).catch(console.error);
