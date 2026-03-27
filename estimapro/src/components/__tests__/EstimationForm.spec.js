import { mount } from "@vue/test-utils";
import EstimationForm from "../EstimationForm.vue";

const createWrapper = (props = {}) =>
  mount(EstimationForm, {
    props: {
      loading: false,
      modelValue: null,
      ...props,
    },
  });

describe("EstimationForm", () => {
  it("muestra errores y bloquea envío cuando hay campos inválidos", async () => {
    const wrapper = createWrapper();

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("submit")).toBeFalsy();
    expect(wrapper.text()).toContain("El nombre del cliente es obligatorio.");
    expect(wrapper.text()).toContain("El nombre del proyecto es obligatorio.");
    expect(wrapper.text()).toContain("El monto es obligatorio.");
    expect(wrapper.text()).toContain("La descripción es obligatoria.");
  });

  it("bloquea envío cuando amount es menor o igual a 0", async () => {
    const wrapper = createWrapper();

    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Cliente Test");
    await inputs[1].setValue("Proyecto Test");
    await inputs[2].setValue("0");
    await wrapper.find("textarea").setValue("Descripción válida");

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("submit")).toBeFalsy();
    expect(wrapper.text()).toContain("El monto debe ser mayor que 0.");
  });

  it("emite submit con datos válidos", async () => {
    const wrapper = createWrapper();

    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("  Cliente Uno  ");
    await inputs[1].setValue("  Proyecto Uno  ");
    await inputs[2].setValue("1500");
    await wrapper.find("textarea").setValue("  Descripción de prueba  ");

    await wrapper.find("form").trigger("submit.prevent");

    const emitted = wrapper.emitted("submit");
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toEqual({
      clientName: "Cliente Uno",
      projectName: "Proyecto Uno",
      amount: 1500,
      description: "Descripción de prueba",
    });
  });
});
