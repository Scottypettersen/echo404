// src/firebase.js
import { initializeApp }    from "firebase/app";
import { getFirestore }     from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIza…",
  authDomain: "echo404-8f287.firebaseapp.com",
  projectId: "echo404-8f287",
  storageBucket: "echo404-8f287.appspot.com",
  messagingSenderId: "444571208682",
  appId: "1:444571208682:web:92d27e0c6261313f7f0093"
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// A promise that resolves once we have an anonymous user
export const authReady = new Promise((resolve, reject) => {
  const unsub = onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        resolve(user);
        unsub();
      } else {
        // if user == null, we’re signed out; keep listening
      }
    },
    (error) => {
      console.error("Auth listener error", error);
      reject(error);
    }
  );
});

// Kick off anonymous sign-in immediately
signInAnonymously(auth).catch(err => {
  console.error("Anonymous sign-in failed", err);
});
