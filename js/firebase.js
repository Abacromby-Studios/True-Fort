// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_NKYwvwLg2KQOB--RX05rimEiEkcSpho",
  authDomain: "true-fort.firebaseapp.com",
  projectId: "true-fort",
  storageBucket: "true-fort.firebasestorage.app",
  messagingSenderId: "750729345906",
  appId: "1:750729345906:web:7ab18054f7be68f7327beb",
  measurementId: "G-WRFK68BCSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
