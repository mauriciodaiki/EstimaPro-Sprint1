// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV-vf8e2VK8JpvcH9oDBiDtu0OQd3ST7c",
  authDomain: "estimapro-78dbd.firebaseapp.com",
  projectId: "estimapro-78dbd",
  storageBucket: "estimapro-78dbd.firebasestorage.app",
  messagingSenderId: "133744025435",
  appId: "1:133744025435:web:13139c8b3a5dde1d34447e",
  measurementId: "G-1RH6474Q5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);