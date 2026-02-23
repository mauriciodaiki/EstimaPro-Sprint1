<template>
  <div style="padding: 24px;">
    <h1>Registro</h1>

    <form @submit.prevent="handleRegister">
      <div style="margin-bottom: 12px;">
        <input v-model="email" type="email" placeholder="Email" required />
      </div>

      <div style="margin-bottom: 12px;">
        <input v-model="password" type="password" placeholder="Password" required />
      </div>

      <button type="submit">Crear cuenta</button>
    </form>

    <p v-if="error" style="color: red; margin-top: 12px;">{{ error }}</p>

    <p style="margin-top: 16px;">
      ¿Ya tienes cuenta?
      <router-link to="/login">Inicia sesión</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

const handleRegister = async () => {
  error.value = "";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);

    // Firestore básico (coincide con tu sprint)
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email.value,
      createdAt: serverTimestamp(),
    });

    router.push("/dashboard");
  } catch (e) {
    error.value = e.message;
  }
};
</script>