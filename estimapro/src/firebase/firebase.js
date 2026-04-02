import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ Sustituye estos valores por los de tu proyecto Firebase (Console > Project settings > Web app)
const firebaseConfig = {
  apiKey: "AIzaSyDV-vf8e2VK8JpvcH9oDBiDtu0OQd3ST7c",
  authDomain: "estimapro-78dbd.firebaseapp.com",
  projectId: "estimapro-78dbd",
  storageBucket: "estimapro-78dbd.firebasestorage.app",
  messagingSenderId: "133744025435",
  appId: "1:133744025435:web:13139c8b3a5dde1d34447e",
  measurementId: "G-1RH6474Q5E"
};

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"];
const missingConfigKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key]);

if (missingConfigKeys.length > 0) {
  console.error("[Firebase][config] Faltan claves de configuración:", missingConfigKeys);
} else {
  console.info("[Firebase][config] Proyecto activo:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
