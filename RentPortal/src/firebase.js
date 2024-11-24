// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8Z6UbfCurdxqonH2aScHP9iBMpUwEXQc",
  authDomain: "rental-portal-8c099.firebaseapp.com",
  projectId: "rental-portal-8c099",
  storageBucket: "rental-portal-8c099.firebasestorage.app",
  messagingSenderId: "605200317332",
  appId: "1:605200317332:web:57525fa71ebd3012b06d81",
  measurementId: "G-QLL4C4SJLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
