// استيراد Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// قم بنسخ بيانات مشروعك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCnfXLXugc-9Idf7lmky1Rl3pykmKvsWyQ",
  authDomain: "withyou-3b6bf.firebaseapp.com",
  projectId: "withyou-3b6bf",
  storageBucket: "withyou-3b6bf.appspot.com", // ✅ Corrected storageBucket
  messagingSenderId: "443446009491",
  appId: "1:443446009491:web:4ceb4188916d282b577766",
  measurementId: "G-E4BS8ECDB2",
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// ✅ Optional: Only use analytics if running in a browser
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

// تهيئة الخدمات (المصادقة، قاعدة البيانات، التخزين)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
