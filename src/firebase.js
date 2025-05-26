// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore }   from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "firebase/auth";

// ← your web app config from the console
const firebaseConfig = {
  apiKey:           "AIza…",
  authDomain:       "echo404-8f287.firebaseapp.com",
  projectId:        "echo404-8f287",
  storageBucket:    "echo404-8f287.appspot.com",
  messagingSenderId:"444571208682",
  appId:            "1:444571208682:web:92d27e0c6261313f7f0093"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// 1️⃣ Ensure anonymous sign-in so we get a stable auth.uid
signInAnonymously(auth).catch(err => {
  console.error("Anonymous auth failed:", err);
});

// 2️⃣ (Optional) Listen for state changes to know when uid is available
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("🔑 Signed in anonymously with uid:", user.uid);
  } else {
    console.log("🚪 Signed out or auth unavailable");
  }
});
