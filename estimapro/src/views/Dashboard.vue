<template>
  <div style="padding: 24px;">
    <h1>Dashboard</h1>
    <p>Sesión iniciada correctamente.</p>

    <p v-if="userEmail"><strong>Usuario:</strong> {{ userEmail }}</p>

    <button @click="handleLogout" style="margin-top: 16px;">
      Cerrar sesión
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const router = useRouter();
const userEmail = ref("");

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) return router.push("/login");
    userEmail.value = user.email ?? "";
  });
});

const handleLogout = async () => {
  await signOut(auth);
  router.push("/login");
};
</script>