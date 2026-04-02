<template>
  <div class="dashboard">
    <header class="topbar">
      <div>
        <h1>Dashboard de Estimaciones</h1>
        <p v-if="userEmail"><strong>Usuario:</strong> {{ userEmail }}</p>
      </div>
      <div class="topbar-actions">
        <button type="button" @click="handleExportCsv">Exportar CSV</button>
        <button type="button" @click="handleLogout">Cerrar sesión</button>
      </div>
    </header>

    <section class="panel filters">
      <h2>Filtros</h2>
      <div class="filters-grid">
        <label>
          Buscar por cliente/proyecto
          <input
            v-model.trim="filters.search"
            type="text"
            placeholder="Ej. ACME o Remodelación"
          />
        </label>

        <label>
          Monto mínimo
          <input v-model.number="filters.minMonto" type="number" min="0" step="0.01" placeholder="0" />
        </label>

        <label>
          Monto máximo
          <input v-model.number="filters.maxMonto" type="number" min="0" step="0.01" placeholder="100000" />
        </label>

        <div class="filters-actions">
          <button type="button" @click="clearFilters">Limpiar filtros</button>
        </div>
      </div>
      <p v-if="filtersError" class="error">{{ filtersError }}</p>
    </section>

    <p v-if="uiError" class="error">{{ uiError }}</p>
    <p v-if="exportMessage" :class="exportStatusClass">{{ exportMessage }}</p>
    <p v-if="isLoading">Cargando...</p>

    <div class="content-grid">
      <EstimationForm
        :form="formState"
        :is-editing="Boolean(editingId)"
        @submit="handleSubmit"
        @cancel="cancelEdit"
      />

      <EstimationTable
        :items="filteredEstimaciones"
        @edit="startEdit"
        @remove="handleRemove"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import {
  createEstimacion,
  deleteEstimacion,
  listEstimacionesByUser,
  updateEstimacion,
} from "../services/estimacionesService";
import { applyEstimationFilters } from "../utils/filters";
import { exportEstimacionesCsv } from "../utils/exportCsv";
import EstimationForm from "../components/EstimationForm.vue";
import EstimationTable from "../components/EstimationTable.vue";

const router = useRouter();

const userId = ref("");
const userEmail = ref("");
const isLoading = ref(false);
const uiError = ref("");
const editingId = ref("");
const exportMessage = ref("");
const exportStatus = ref("success");

const estimaciones = ref([]);

const formState = reactive({
  cliente: "",
  proyecto: "",
  monto: null,
  estado: "pendiente",
  descripcion: "",
});

const filters = reactive({
  search: "",
  minMonto: "",
  maxMonto: "",
});

const filtersError = computed(() => {
  if (filters.minMonto === "" || filters.maxMonto === "") return "";
  return Number(filters.minMonto) > Number(filters.maxMonto)
    ? "El monto mínimo no puede ser mayor al máximo."
    : "";
});

const filteredEstimaciones = computed(() => {
  if (filtersError.value) return [];
  return applyEstimationFilters(estimaciones.value, filters);
});
const exportStatusClass = computed(() =>
  exportStatus.value === "success" ? "success" : "error"
);

const resetForm = () => {
  formState.cliente = "";
  formState.proyecto = "";
  formState.monto = null;
  formState.estado = "pendiente";
  formState.descripcion = "";
};

const loadEstimaciones = async () => {
  if (!userId.value) return;

  isLoading.value = true;
  uiError.value = "";

  try {
    estimaciones.value = await listEstimacionesByUser(userId.value);
  } catch (error) {
    uiError.value = "No fue posible cargar las estimaciones.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async (payload) => {
  if (!userId.value) return;

  uiError.value = "";

  try {
    if (editingId.value) {
      await updateEstimacion(editingId.value, payload);
    } else {
      await createEstimacion({
        ...payload,
        userId: userId.value,
      });
    }

    await loadEstimaciones();
    cancelEdit();
  } catch (error) {
    uiError.value = "No fue posible guardar la estimación.";
    console.error(error);
  }
};

const startEdit = (item) => {
  editingId.value = item.id;
  formState.cliente = item.cliente;
  formState.proyecto = item.proyecto;
  formState.monto = item.monto;
  formState.estado = item.estado;
  formState.descripcion = item.descripcion;
};

const cancelEdit = () => {
  editingId.value = "";
  resetForm();
};

const handleRemove = async (estimacionId) => {
  if (!window.confirm("¿Eliminar esta estimación?")) return;

  uiError.value = "";

  try {
    await deleteEstimacion(estimacionId);
    await loadEstimaciones();
  } catch (error) {
    uiError.value = "No fue posible eliminar la estimación.";
    console.error(error);
  }
};

const clearFilters = () => {
  filters.search = "";
  filters.minMonto = "";
  filters.maxMonto = "";
};

const handleExportCsv = () => {
  exportMessage.value = "";

  if (filtersError.value) {
    exportStatus.value = "error";
    exportMessage.value = "Corrige los filtros antes de exportar.";
    return;
  }

  if (filteredEstimaciones.value.length === 0) {
    exportStatus.value = "error";
    exportMessage.value = "No hay estimaciones visibles para exportar.";
    return;
  }

  try {
    exportEstimacionesCsv(filteredEstimaciones.value);
    exportStatus.value = "success";
    exportMessage.value = `CSV exportado con ${filteredEstimaciones.value.length} estimaciones.`;
  } catch (error) {
    exportStatus.value = "error";
    exportMessage.value = "No fue posible exportar el archivo CSV.";
    console.error(error);
  }
};

const handleLogout = async () => {
  await signOut(auth);
  router.push("/login");
};

let unsubscribeAuth = null;

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push("/login");
      return;
    }

    userId.value = user.uid;
    userEmail.value = user.email ?? "";
    await loadEstimaciones();
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth();
});
</script>

<style scoped>
.dashboard {
  padding: 24px;
  display: grid;
  gap: 16px;
  color: #101828;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.topbar-actions {
  display: flex;
  gap: 8px;
}

.panel {
  border: 1px solid #d8dee4;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}

.filters-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

label {
  display: grid;
  gap: 6px;
  text-align: left;
}

input {
  border: 1px solid #c8ced6;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
}

.content-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 320px 1fr;
  align-items: start;
}

.filters-actions {
  display: flex;
  align-items: end;
}

.error {
  margin: 0;
  color: #b42318;
}

.success {
  margin: 0;
  color: #067647;
}

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
