import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAT8zXaq5kwZbrbIwQnoVBy8CvVjK-KnmY",
  authDomain: "crypto-app-dcd43.firebaseapp.com",
  projectId: "crypto-app-dcd43",
  storageBucket: "crypto-app-dcd43.firebasestorage.app",
  messagingSenderId: "392991695188",
  appId: "1:392991695188:web:f2f8ee83a9ee68ecd668c1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
