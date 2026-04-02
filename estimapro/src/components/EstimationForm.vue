<template>
  <section class="panel">
    <h2>{{ isEditing ? "Editar estimación" : "Nueva estimación" }}</h2>

    <form @submit.prevent="submit">
      <label>
        Cliente
        <input v-model.trim="localForm.cliente" type="text" placeholder="Cliente" />
      </label>

      <label>
        Proyecto
        <input v-model.trim="localForm.proyecto" type="text" placeholder="Proyecto" />
      </label>

      <label>
        Monto
        <input v-model.number="localForm.monto" type="number" min="1" step="0.01" placeholder="0.00" />
      </label>

      <label>
        Estado
        <select v-model="localForm.estado">
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
        </select>
      </label>

      <label>
        Descripción
        <textarea v-model.trim="localForm.descripcion" rows="3" placeholder="Alcance o notas"></textarea>
      </label>

      <p v-if="localError" class="error">{{ localError }}</p>

      <div class="actions">
        <button type="submit">{{ isEditing ? "Actualizar" : "Guardar" }}</button>
        <button v-if="isEditing" type="button" @click="$emit('cancel')">Cancelar</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, watch, ref, computed } from "vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const localError = ref("");

const localForm = reactive({
  cliente: "",
  proyecto: "",
  monto: null,
  estado: "pendiente",
  descripcion: "",
});

const syncLocalForm = () => {
  localForm.cliente = props.form.cliente ?? "";
  localForm.proyecto = props.form.proyecto ?? "";
  localForm.monto = props.form.monto ?? null;
  localForm.estado = props.form.estado ?? "pendiente";
  localForm.descripcion = props.form.descripcion ?? "";
};

watch(
  () => props.form,
  () => {
    localError.value = "";
    syncLocalForm();
  },
  { deep: true, immediate: true }
);

const invalidMonto = computed(() => localForm.monto === null || Number(localForm.monto) <= 0);

const submit = () => {
  localError.value = "";

  if (!localForm.cliente || !localForm.proyecto) {
    localError.value = "Cliente y proyecto son obligatorios.";
    return;
  }

  if (invalidMonto.value) {
    localError.value = "El monto debe ser mayor a 0.";
    return;
  }

  emit("submit", {
    cliente: localForm.cliente,
    proyecto: localForm.proyecto,
    monto: Number(localForm.monto),
    estado: localForm.estado,
    descripcion: localForm.descripcion,
  });
};
</script>

<style scoped>
.panel {
  border: 1px solid #d8dee4;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}

form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  text-align: left;
}

input,
select,
textarea {
  border: 1px solid #c8ced6;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

.error {
  margin: 0;
  color: #b42318;
}
</style>
