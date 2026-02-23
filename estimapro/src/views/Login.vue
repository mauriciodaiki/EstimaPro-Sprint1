<template>
  <div style="padding: 24px;">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <div style="margin-bottom: 12px;">
        <input v-model="email" type="email" placeholder="Email" required />
      </div>

      <div style="margin-bottom: 12px;">
        <input v-model="password" type="password" placeholder="Password" required />
      </div>

      <button type="submit">Entrar</button>
    </form>

    <p v-if="error" style="color: red; margin-top: 12px;">{{ error }}</p>

    <p style="margin-top: 16px;">
      ¿No tienes cuenta?
      <router-link to="/register">Regístrate</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (e) {
    error.value = e.message;
  }
};
</script>