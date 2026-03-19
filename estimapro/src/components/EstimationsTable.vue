<template>
  <div
    style="
      margin-top: 20px;
      border: 1px solid #374151;
      border-radius: 10px;
      padding: 16px;
      background: #1f2937;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      color: #e5e7eb;
    "
  >
    <h2 style="margin: 0 0 10px;">Estimaciones</h2>

    <div style="display: grid; gap: 8px; margin-bottom: 12px;">
      <input
        v-model.trim="searchText"
        type="text"
        placeholder="Buscar por cliente o proyecto"
        style="
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          background: #111827;
          color: #f3f4f6;
          border: 1px solid #374151;
        "
      />
      <div style="display: flex; gap: 8px;">
        <input
          v-model="minAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto mínimo"
          style="
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            background: #111827;
            color: #f3f4f6;
            border: 1px solid #374151;
          "
        />
        <input
          v-model="maxAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto máximo"
          style="
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            background: #111827;
            color: #f3f4f6;
            border: 1px solid #374151;
          "
        />
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <small style="color: #cbd5e1;">{{ filteredEstimations.length }} resultado(s)</small>
        <button
          type="button"
          @click="clearFilters"
          :disabled="!searchText && !minAmount && !maxAmount"
          style="background: #e5e7eb; border: 1px solid #cbd5e1; padding: 8px 10px; color: #111827;"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <p
      v-if="loading"
      style="
        margin: 0;
        padding: 12px;
        border-radius: 8px;
        background: #0f172a;
        border: 1px solid #334155;
      "
    >
      Cargando estimaciones...
    </p>
    <p
      v-else-if="estimations.length === 0"
      style="
        margin: 0;
        padding: 12px;
        border-radius: 8px;
        background: #0f172a;
        border: 1px dashed #334155;
      "
    >
      Aún no tienes estimaciones registradas.
    </p>
    <p v-else-if="filteredEstimations.length === 0">
      No hay resultados con los filtros actuales.
    </p>

    <table v-else style="width: 100%; border-collapse: collapse; border: 1px solid #374151;">
      <thead>
        <tr style="background: #111827;">
          <th style="text-align: left; border-bottom: 1px solid #374151; padding: 10px;">Cliente</th>
          <th style="text-align: left; border-bottom: 1px solid #374151; padding: 10px;">Proyecto</th>
          <th style="text-align: left; border-bottom: 1px solid #374151; padding: 10px;">Monto</th>
          <th style="text-align: left; border-bottom: 1px solid #374151; padding: 10px;">Descripción</th>
          <th style="text-align: left; border-bottom: 1px solid #374151; padding: 10px;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="estimation in filteredEstimations" :key="estimation.id">
          <td style="border-bottom: 1px solid #374151; padding: 10px;">{{ estimation.clientName }}</td>
          <td style="border-bottom: 1px solid #374151; padding: 10px;">{{ estimation.projectName }}</td>
          <td style="border-bottom: 1px solid #374151; padding: 10px;">{{ formatCurrency(estimation.amount) }}</td>
          <td style="border-bottom: 1px solid #374151; padding: 10px;">{{ estimation.description }}</td>
          <td style="border-bottom: 1px solid #374151; padding: 10px;">
            <button
              type="button"
              @click="emit('edit', estimation.id)"
              :disabled="deleteLoadingId === estimation.id"
              style="
                margin-right: 8px;
                background: #175cd3;
                color: white;
                border: none;
                padding: 8px 10px;
                font-weight: 600;
              "
            >
              Editar
            </button>
            <button
              type="button"
              @click="emit('delete', estimation.id)"
              :disabled="deleteLoadingId === estimation.id"
              style="
                background: #b42318;
                color: white;
                border: none;
                padding: 8px 10px;
                font-weight: 600;
              "
            >
              {{ deleteLoadingId === estimation.id ? "Eliminando..." : "Eliminar" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  estimations: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  deleteLoadingId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["edit", "delete"]);
const searchText = ref("");
const minAmount = ref("");
const maxAmount = ref("");

const parseAmountFilter = (value) => {
  if (value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const filteredEstimations = computed(() => {
  const search = searchText.value.toLowerCase();
  const min = parseAmountFilter(minAmount.value);
  const max = parseAmountFilter(maxAmount.value);

  return props.estimations.filter((estimation) => {
    const client = String(estimation.clientName ?? "").toLowerCase();
    const project = String(estimation.projectName ?? "").toLowerCase();
    const amount = Number(estimation.amount ?? 0);

    const textMatch = !search || client.includes(search) || project.includes(search);
    const minMatch = min === null || amount >= min;
    const maxMatch = max === null || amount <= max;

    return textMatch && minMatch && maxMatch;
  });
});

const clearFilters = () => {
  searchText.value = "";
  minAmount.value = "";
  maxAmount.value = "";
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(amount ?? 0));
</script>
