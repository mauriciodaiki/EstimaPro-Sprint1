<template>
  <div style="padding: 24px;">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
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
        {{ loading ? "Entrando..." : "Entrar" }}
      </button>
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
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const getLoginErrorMessage = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email o contraseña incorrectos.";
    case "auth/invalid-email":
      return "El formato del email no es válido.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta de nuevo en unos minutos.";
    case "auth/network-request-failed":
      return "No se pudo conectar. Revisa tu conexión e intenta de nuevo.";
    default:
      return "No se pudo iniciar sesión. Intenta nuevamente.";
  }
};

const handleLogin = async () => {
  if (loading.value) return;

  error.value = "";
  loading.value = true;

  try {
    await login(email.value, password.value);
    router.push("/dashboard");
  } catch (e) {
    error.value = getLoginErrorMessage(e?.code);
  } finally {
    loading.value = false;
  }
};
</script>
