import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// ← your Firebase web config here
const firebaseConfig = {
  apiKey: "AIzaSyDr3vcP2IsUL8KFVxizgJCZTLTm4OiPbAw",
  authDomain: "echo404-8f287.firebaseapp.com",
  projectId: "echo404-8f287",
  storageBucket: "echo404-8f287.appspot.com",
  messagingSenderId: "444571208682",
  appId: "1:444571208682:web:92d27e0c6261313f7f0093"
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// fire off anonymous sign-in immediately
signInAnonymously(auth).catch(err => {
  console.error("❌ Firebase auth failed:", err);
});
