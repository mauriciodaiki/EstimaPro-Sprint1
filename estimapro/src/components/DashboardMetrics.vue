<template>
  <section class="metrics-grid">
    <article class="metric-card">
      <p class="metric-label">Total estimaciones</p>
      <p class="metric-value">{{ totalEstimaciones }}</p>
    </article>

    <article class="metric-card">
      <p class="metric-label">Monto total</p>
      <p class="metric-value">{{ formatCurrency(montoTotal) }}</p>
    </article>

    <article class="metric-card">
      <p class="metric-label">Promedio</p>
      <p class="metric-value">{{ formatCurrency(montoPromedio) }}</p>
    </article>

    <article class="metric-card">
      <p class="metric-label">Máximo</p>
      <p class="metric-value">{{ formatCurrency(montoMaximo) }}</p>
    </article>

    <article class="metric-card">
      <p class="metric-label">Mínimo</p>
      <p class="metric-value">{{ formatCurrency(montoMinimo) }}</p>
    </article>
  </section>
</template>

<script setup>
import { computed } from "vue";
import {
  getMontoMaximo,
  getMontoMinimo,
  getMontoPromedio,
  getMontoTotal,
  getTotalEstimaciones,
} from "../utils/metrics";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const totalEstimaciones = computed(() => getTotalEstimaciones(props.items));
const montoTotal = computed(() => getMontoTotal(props.items));
const montoPromedio = computed(() => getMontoPromedio(props.items));
const montoMaximo = computed(() => getMontoMaximo(props.items));
const montoMinimo = computed(() => getMontoMinimo(props.items));

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.metric-card {
  background: #ffffff;
  border: 1px solid #d8dee4;
  border-radius: 10px;
  padding: 12px;
}

.metric-label {
  margin: 0;
  font-size: 12px;
  color: #475467;
}

.metric-value {
  margin: 6px 0 0;
  font-size: 18px;
  font-weight: 700;
  color: #101828;
}
</style>
