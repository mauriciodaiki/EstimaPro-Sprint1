<template>
  <div
    style="
      border: 1px solid #374151;
      border-radius: 10px;
      padding: 16px;
      margin-top: 20px;
      background: #1f2937;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      color: #e5e7eb;
    "
  >
    <h2 style="margin: 0;">{{ isEditing ? "Editar estimación" : "Nueva estimación" }}</h2>
    <p style="margin: 6px 0 14px; color: #cbd5e1; font-size: 14px;">
      Completa los datos principales para guardar la estimación.
    </p>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 6px; font-weight: 600;">Cliente</label>
        <input
          v-model="form.clientName"
          type="text"
          placeholder="Cliente"
          :disabled="loading"
          @blur="validateField('clientName')"
          style="
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            background: #111827;
            color: #f3f4f6;
            border: 1px solid #374151;
          "
        />
        <p v-if="errors.clientName" style="color: red; margin: 6px 0 0;">
          {{ errors.clientName }}
        </p>
      </div>

      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 6px; font-weight: 600;">Proyecto</label>
        <input
          v-model="form.projectName"
          type="text"
          placeholder="Proyecto"
          :disabled="loading"
          @blur="validateField('projectName')"
          style="
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            background: #111827;
            color: #f3f4f6;
            border: 1px solid #374151;
          "
        />
        <p v-if="errors.projectName" style="color: red; margin: 6px 0 0;">
          {{ errors.projectName }}
        </p>
      </div>

      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 6px; font-weight: 600;">Monto</label>
        <input
          v-model="form.amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Monto"
          :disabled="loading"
          @blur="validateField('amount')"
          style="
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            background: #111827;
            color: #f3f4f6;
            border: 1px solid #374151;
          "
        />
        <p v-if="errors.amount" style="color: red; margin: 6px 0 0;">
          {{ errors.amount }}
        </p>
      </div>

      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 6px; font-weight: 600;">Descripción</label>
        <textarea
          v-model="form.description"
          placeholder="Descripción"
          :disabled="loading"
          @blur="validateField('description')"
          rows="3"
          style="
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            background: #111827;
            color: #f3f4f6;
            border: 1px solid #374151;
          "
        />
        <p v-if="errors.description" style="color: red; margin: 6px 0 0;">
          {{ errors.description }}
        </p>
      </div>

      <div style="display: flex; gap: 8px;">
        <button
          type="submit"
          :disabled="loading"
          style="
            background: #175cd3;
            color: white;
            border: none;
            font-weight: 600;
            padding: 10px 14px;
          "
        >
          {{ loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear" }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          @click="emit('cancel')"
          :disabled="loading"
          style="
            background: #f5f5f5;
            color: #111827;
            border: 1px solid #cbd5e1;
            font-weight: 600;
            padding: 10px 14px;
          "
        >
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
  amount: "",
  description: "",
});

const form = reactive(emptyForm());
const errors = reactive({
  clientName: "",
  projectName: "",
  amount: "",
  description: "",
});

const isEditing = computed(() => Boolean(props.modelValue?.id));

function clearErrors() {
  errors.clientName = "";
  errors.projectName = "";
  errors.amount = "";
  errors.description = "";
}

watch(
  () => props.modelValue,
  (value) => {
    const source = value ?? emptyForm();
    form.clientName = source.clientName ?? "";
    form.projectName = source.projectName ?? "";
    form.amount = source.amount === 0 ? "0" : String(source.amount ?? "");
    form.description = source.description ?? "";
    clearErrors();
  },
  { immediate: true },
);

const validateField = (fieldName) => {
  if (fieldName === "clientName") {
    errors.clientName = form.clientName.trim()
      ? ""
      : "El nombre del cliente es obligatorio.";
  }

  if (fieldName === "projectName") {
    errors.projectName = form.projectName.trim()
      ? ""
      : "El nombre del proyecto es obligatorio.";
  }

  if (fieldName === "description") {
    errors.description = form.description.trim()
      ? ""
      : "La descripción es obligatoria.";
  }

  if (fieldName === "amount") {
    if (form.amount === "" || form.amount === null) {
      errors.amount = "El monto es obligatorio.";
      return;
    }

    const numericAmount = Number(form.amount);

    if (!Number.isFinite(numericAmount)) {
      errors.amount = "El monto debe ser numérico.";
      return;
    }

    if (numericAmount <= 0) {
      errors.amount = "El monto debe ser mayor que 0.";
      return;
    }

    errors.amount = "";
  }
};

const validateForm = () => {
  validateField("clientName");
  validateField("projectName");
  validateField("amount");
  validateField("description");

  return (
    !errors.clientName &&
    !errors.projectName &&
    !errors.amount &&
    !errors.description
  );
};

const handleSubmit = () => {
  if (props.loading) return;
  if (!validateForm()) return;

  emit("submit", {
    clientName: form.clientName.trim(),
    projectName: form.projectName.trim(),
    amount: Number(form.amount),
    description: form.description.trim(),
  });
};
</script>
