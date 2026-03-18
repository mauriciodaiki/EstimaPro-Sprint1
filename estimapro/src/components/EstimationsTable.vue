<template>
  <div style="margin-top: 20px;">
    <h2 style="margin: 0 0 10px;">Estimaciones</h2>

    <p v-if="loading">Cargando estimaciones...</p>
    <p v-else-if="estimations.length === 0">Aún no tienes estimaciones registradas.</p>

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
        <tr v-for="estimation in estimations" :key="estimation.id">
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
defineProps({
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

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(amount ?? 0));
</script>
