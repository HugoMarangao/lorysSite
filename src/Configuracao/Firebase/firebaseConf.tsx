// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB_crAkeLECpXaWSzyv0Lt5t1fvDMMehcQ",
  authDomain: "lorysmodas-e2d29.firebaseapp.com",
  projectId: "lorysmodas-e2d29",
  storageBucket: "lorysmodas-e2d29.appspot.com",
  messagingSenderId: "101953180934",
  appId: "1:101953180934:web:8633593138d67cd5da7a87",
  measurementId: "G-905NEVR909"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, storage, analytics, app };
