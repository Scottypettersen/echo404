// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "firebase/app-check";

// — your web app’s config from the console —
const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// (Optional) Protect with App Check
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("YOUR_RECAPTCHA_SITE_KEY"),
  isTokenAutoRefreshEnabled: true
});

// Export the Firestore instance
export const db = getFirestore(app);
