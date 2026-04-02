<template>
  <section class="panel">
    <div class="header">
      <h2>Estimaciones</h2>
      <span>{{ items.length }} registros</span>
    </div>

    <div v-if="items.length === 0" class="empty">No hay estimaciones para mostrar.</div>

    <table v-else>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Proyecto</th>
          <th>Monto</th>
          <th>Estado</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.cliente }}</td>
          <td>{{ item.proyecto }}</td>
          <td>{{ formatCurrency(item.monto) }}</td>
          <td>
            <span :class="['status', `status-${item.estado}`]">{{ item.estado }}</span>
          </td>
          <td>{{ item.descripcion || "-" }}</td>
          <td class="actions-cell">
            <button type="button" @click="$emit('edit', item)">Editar</button>
            <button type="button" class="danger" @click="$emit('remove', item.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["edit", "remove"]);

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
</script>

<style scoped>
.panel {
  border: 1px solid #d8dee4;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  border-bottom: 1px solid #e6ebf1;
  padding: 10px 8px;
  font-size: 14px;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.status {
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  text-transform: capitalize;
}

.status-pendiente {
  background: #fff6e5;
  color: #8a5b00;
}

.status-aprobada {
  background: #ecfdf3;
  color: #067647;
}

.status-rechazada {
  background: #fef3f2;
  color: #b42318;
}

.empty {
  border: 1px dashed #c8ced6;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  color: #475467;
}

.danger {
  background: #fee4e2;
  border-color: #fda29b;
}
</style>
