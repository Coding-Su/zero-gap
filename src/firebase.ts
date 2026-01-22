import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9VxcNeEJYBat_C8ceP7ay4nJasi12rk0",
  authDomain: "potens-8aae8.firebaseapp.com",
  projectId: "potens-8aae8",
  storageBucket: "potens-8aae8.firebasestorage.app",
  messagingSenderId: "918274641487",
  appId: "1:918274641487:web:8ba28bcde45d75dd13643a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);