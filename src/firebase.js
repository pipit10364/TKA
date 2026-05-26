import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCq2Iy_ocfp-523Ry2nWNB9BULlqR6a0Cs",
  authDomain: "tka-bio.firebaseapp.com",
  projectId: "tka-bio",
  storageBucket: "tka-bio.firebasestorage.app",
  messagingSenderId: "822269231290",
  appId: "1:822269231290:web:b04016da39a4fd1af90283",
  measurementId: "G-QYRQ28EGWQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
