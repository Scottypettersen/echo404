// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore }   from "firebase/firestore";

// ← copy/paste your own values here
const firebaseConfig = {
  apiKey: "AIzaSyDr3vcP2IsUL8KFVxizgJCZTLTm4OiPbAw",
  authDomain: "echo404-8f287.firebaseapp.com",
  projectId: "echo404-8f287",
  storageBucket: "echo404-8f287.appspot.com",
  messagingSenderId: "444571208682",
  appId: "1:444571208682:web:92d27e0c6261313f7f0093"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
