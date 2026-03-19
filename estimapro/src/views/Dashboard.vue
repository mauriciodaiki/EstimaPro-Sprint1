<template>
  <div style="padding: 24px; max-width: 980px; margin: 0 auto; color: #e5e7eb;">
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      "
    >
      <div>
        <h1 style="margin: 0; color: #f8fafc;">Dashboard</h1>
        <p style="margin: 6px 0 0; color: #cbd5e1;">Gestiona tus estimaciones en un solo lugar.</p>
      </div>
      <button
        @click="handleLogout"
        :disabled="logoutLoading"
        style="
          background: #b42318;
          color: white;
          border: none;
          font-weight: 600;
          padding: 10px 14px;
        "
      >
        {{ logoutLoading ? "Cerrando sesión..." : "Cerrar sesión" }}
      </button>
    </div>

    <p
      v-if="userEmail"
      style="
        margin: 0 0 14px;
        background: #f5f7ff;
        border: 1px solid #d9e0ff;
        border-radius: 8px;
        padding: 10px 12px;
      "
    >
      <strong>Usuario:</strong> {{ userEmail }}
    </p>

    <p
      v-if="successMessage"
      style="
        margin: 0 0 12px;
        color: #155724;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 8px;
        padding: 10px 12px;
      "
    >
      {{ successMessage }}
    </p>
    <p
      v-if="logoutError"
      style="
        margin: 0 0 12px;
        color: #721c24;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        padding: 10px 12px;
      "
    >
      {{ logoutError }}
    </p>
    <p
      v-if="crudError"
      style="
        margin: 0 0 12px;
        color: #721c24;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        padding: 10px 12px;
      "
    >
      {{ crudError }}
    </p>

    <EstimationForm
      :model-value="activeEstimation"
      :loading="saveLoading"
      @submit="handleSaveEstimation"
      @cancel="cancelEditing"
    />

    <EstimationsTable
      :estimations="estimations"
      :loading="listLoading"
      :delete-loading-id="deleteLoadingId"
      @edit="startEditing"
      @delete="handleDeleteEstimation"
    />
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import EstimationForm from "../components/EstimationForm.vue";
import EstimationsTable from "../components/EstimationsTable.vue";
import {
  createEstimation,
  deleteEstimation,
  listEstimationsByUser,
  updateEstimation,
} from "../services/estimationsService";

const router = useRouter();
const { user, isAuthReady, logout } = useAuth();
const estimations = ref([]);
const editingId = ref("");

const listLoading = ref(false);
const saveLoading = ref(false);
const deleteLoadingId = ref("");

const logoutLoading = ref(false);
const logoutError = ref("");
const crudError = ref("");
const successMessage = ref("");

const userEmail = computed(() => user.value?.email ?? "");
const activeEstimation = computed(
  () => estimations.value.find((item) => item.id === editingId.value) ?? null,
);

let stopAuthWatch = () => {};

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

const getCrudErrorMessage = (code, action) => {
  if (code === "permission-denied") {
    return "No tienes permisos para esta acción.";
  }

  if (code === "unavailable" || code === "auth/network-request-failed") {
    return "No se pudo conectar. Revisa tu conexión e intenta de nuevo.";
  }

  if (action === "load") {
    return "No se pudieron cargar las estimaciones.";
  }

  if (action === "delete") {
    return "No se pudo eliminar la estimación.";
  }

  return "No se pudo guardar la estimación.";
};

const loadEstimations = async () => {
  if (!user.value?.uid) return;
  if (listLoading.value) return;

  listLoading.value = true;
  crudError.value = "";

  try {
    estimations.value = await listEstimationsByUser(user.value.uid);
  } catch (e) {
    crudError.value = getCrudErrorMessage(e?.code, "load");
  } finally {
    listLoading.value = false;
  }
};

stopAuthWatch = watch(
  [isAuthReady, user],
  ([ready, currentUser]) => {
    if (ready && !currentUser) {
      router.push("/login");
      return;
    }

    if (ready && currentUser) {
      void loadEstimations();
    }
  },
  { immediate: true },
);

const handleSaveEstimation = async (formData) => {
  if (!user.value?.uid) return;
  if (saveLoading.value) return;

  saveLoading.value = true;
  crudError.value = "";
  successMessage.value = "";

  try {
    if (editingId.value) {
      await updateEstimation(editingId.value, user.value.uid, formData);
      successMessage.value = "Estimación actualizada correctamente.";
    } else {
      await createEstimation(user.value.uid, formData);
      successMessage.value = "Estimación creada correctamente.";
    }

    editingId.value = "";
    await loadEstimations();
  } catch (e) {
    crudError.value = getCrudErrorMessage(e?.code, "save");
  } finally {
    saveLoading.value = false;
  }
};

const startEditing = (id) => {
  editingId.value = id;
};

const cancelEditing = () => {
  editingId.value = "";
  successMessage.value = "Edición cancelada.";
};

const handleDeleteEstimation = async (id) => {
  if (!user.value?.uid) return;
  if (deleteLoadingId.value) return;

  const estimation = estimations.value.find((item) => item.id === id);
  const label = estimation?.projectName || estimation?.clientName || "esta estimación";
  const confirmed = window.confirm(`¿Deseas eliminar ${label}? Esta acción no se puede deshacer.`);
  if (!confirmed) return;

  deleteLoadingId.value = id;
  crudError.value = "";
  successMessage.value = "";

  try {
    await deleteEstimation(id);

    if (editingId.value === id) {
      editingId.value = "";
    }

    await loadEstimations();
    successMessage.value = "Estimación eliminada correctamente.";
  } catch (e) {
    crudError.value = getCrudErrorMessage(e?.code, "delete");
  } finally {
    deleteLoadingId.value = "";
  }
};

const handleLogout = async () => {
  if (logoutLoading.value) return;

  logoutError.value = "";
  successMessage.value = "";
  logoutLoading.value = true;

  try {
    await logout();
    router.push("/login");
  } catch (e) {
    logoutError.value = getLogoutErrorMessage(e?.code);
  } finally {
    logoutLoading.value = false;
  }
};
</script>
