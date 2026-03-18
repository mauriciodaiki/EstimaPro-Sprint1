<template>
  <div style="padding: 24px;">
    <h1>Dashboard</h1>
    <p>Sesión iniciada correctamente.</p>

    <p v-if="userEmail"><strong>Usuario:</strong> {{ userEmail }}</p>

    <button @click="handleLogout" :disabled="loading" style="margin-top: 16px;">
      {{ loading ? "Cerrando sesión..." : "Cerrar sesión" }}
    </button>

    <p v-if="error" style="color: red; margin-top: 12px;">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { user, isAuthReady, logout } = useAuth();
const loading = ref(false);
const error = ref("");
const userEmail = computed(() => user.value?.email ?? "");

const stopAuthWatch = watch(
  [isAuthReady, user],
  ([ready, currentUser]) => {
    if (ready && !currentUser) {
      router.push("/login");
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  stopAuthWatch();
});

const getLogoutErrorMessage = (code) => {
  switch (code) {
    case "auth/network-request-failed":
      return "No se pudo cerrar sesión por un problema de red. Intenta de nuevo.";
    default:
      return "No se pudo cerrar sesión. Intenta nuevamente.";
  }
};

const handleLogout = async () => {
  if (loading.value) return;

  error.value = "";
  loading.value = true;

  try {
    await logout();
    router.push("/login");
  } catch (e) {
    error.value = getLogoutErrorMessage(e?.code);
  } finally {
    loading.value = false;
  }
};
</script>
