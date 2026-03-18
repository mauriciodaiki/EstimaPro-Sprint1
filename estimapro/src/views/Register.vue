<template>
  <div style="padding: 24px;">
    <h1>Registro</h1>

    <form @submit.prevent="handleRegister">
      <div style="margin-bottom: 12px;">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          :disabled="loading"
          required
        />
      </div>

      <div style="margin-bottom: 12px;">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          :disabled="loading"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Creando cuenta..." : "Crear cuenta" }}
      </button>
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
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { register } = useAuth();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const getRegisterErrorMessage = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "Ese email ya está registrado.";
    case "auth/invalid-email":
      return "El formato del email no es válido.";
    case "auth/weak-password":
      return "La contraseña es demasiado débil.";
    case "auth/network-request-failed":
      return "No se pudo conectar. Revisa tu conexión e intenta de nuevo.";
    default:
      return "No se pudo crear la cuenta. Intenta nuevamente.";
  }
};

const handleRegister = async () => {
  if (loading.value) return;

  error.value = "";
  loading.value = true;

  if (password.value.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres.";
    loading.value = false;
    return;
  }

  try {
    const cred = await register(email.value, password.value);

    // Firestore básico (coincide con tu sprint)
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email.value,
      createdAt: serverTimestamp(),
    });

    router.push("/dashboard");
  } catch (e) {
    error.value = getRegisterErrorMessage(e?.code);
  } finally {
    loading.value = false;
  }
};
</script>
