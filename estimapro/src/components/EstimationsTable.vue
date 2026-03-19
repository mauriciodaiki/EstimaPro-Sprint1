<template>
  <div style="margin-top: 20px;">
    <h2 style="margin: 0 0 10px;">Estimaciones</h2>

    <div style="display: grid; gap: 8px; margin-bottom: 12px;">
      <input
        v-model.trim="searchText"
        type="text"
        placeholder="Buscar por cliente o proyecto"
        style="width: 100%;"
      />
      <div style="display: flex; gap: 8px;">
        <input
          v-model="minAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto mínimo"
          style="width: 100%;"
        />
        <input
          v-model="maxAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto máximo"
          style="width: 100%;"
        />
      </div>
    </div>

    <p v-if="loading">Cargando estimaciones...</p>
    <p v-else-if="estimations.length === 0">Aún no tienes estimaciones registradas.</p>
    <p v-else-if="filteredEstimations.length === 0">
      No hay resultados con los filtros actuales.
    </p>

    <table v-else style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Cliente</th>
          <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Proyecto</th>
          <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Monto</th>
          <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Descripción</th>
          <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="estimation in filteredEstimations" :key="estimation.id">
          <td style="border-bottom: 1px solid #eee; padding: 8px;">{{ estimation.clientName }}</td>
          <td style="border-bottom: 1px solid #eee; padding: 8px;">{{ estimation.projectName }}</td>
          <td style="border-bottom: 1px solid #eee; padding: 8px;">{{ formatCurrency(estimation.amount) }}</td>
          <td style="border-bottom: 1px solid #eee; padding: 8px;">{{ estimation.description }}</td>
          <td style="border-bottom: 1px solid #eee; padding: 8px;">
            <button
              type="button"
              @click="emit('edit', estimation.id)"
              :disabled="deleteLoadingId === estimation.id"
              style="margin-right: 8px;"
            >
              Editar
            </button>
            <button
              type="button"
              @click="emit('delete', estimation.id)"
              :disabled="deleteLoadingId === estimation.id"
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

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(amount ?? 0));
</script>
