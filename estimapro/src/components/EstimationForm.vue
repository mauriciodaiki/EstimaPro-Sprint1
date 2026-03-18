<template>
  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-top: 20px;">
    <h2 style="margin-top: 0;">{{ isEditing ? "Editar estimación" : "Nueva estimación" }}</h2>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 10px;">
        <input
          v-model="form.clientName"
          type="text"
          placeholder="Cliente"
          :disabled="loading"
          required
          style="width: 100%;"
        />
      </div>

      <div style="margin-bottom: 10px;">
        <input
          v-model="form.projectName"
          type="text"
          placeholder="Proyecto"
          :disabled="loading"
          required
          style="width: 100%;"
        />
      </div>

      <div style="margin-bottom: 10px;">
        <input
          v-model.number="form.amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto"
          :disabled="loading"
          required
          style="width: 100%;"
        />
      </div>

      <div style="margin-bottom: 10px;">
        <textarea
          v-model="form.description"
          placeholder="Descripción"
          :disabled="loading"
          rows="3"
          style="width: 100%;"
        />
      </div>

      <div style="display: flex; gap: 8px;">
        <button type="submit" :disabled="loading">
          {{ loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear" }}
        </button>
        <button v-if="isEditing" type="button" @click="emit('cancel')" :disabled="loading">
          Cancelar edición
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const emptyForm = () => ({
  clientName: "",
  projectName: "",
  amount: 0,
  description: "",
});

const form = reactive(emptyForm());

const isEditing = computed(() => Boolean(props.modelValue?.id));

watch(
  () => props.modelValue,
  (value) => {
    const source = value ?? emptyForm();
    form.clientName = source.clientName ?? "";
    form.projectName = source.projectName ?? "";
    form.amount = Number(source.amount ?? 0);
    form.description = source.description ?? "";
  },
  { immediate: true },
);

const handleSubmit = () => {
  emit("submit", {
    clientName: form.clientName,
    projectName: form.projectName,
    amount: form.amount,
    description: form.description,
  });
};
</script>
