import { mount } from "@vue/test-utils";
import EstimationsTable from "../EstimationsTable.vue";

const estimations = [
  {
    id: "1",
    clientName: "Acme",
    projectName: "Web App",
    amount: 1000,
    description: "Landing + panel",
  },
  {
    id: "2",
    clientName: "Beta Corp",
    projectName: "Mobile App",
    amount: 3000,
    description: "App iOS/Android",
  },
];

const createWrapper = (props = {}) =>
  mount(EstimationsTable, {
    props: {
      estimations,
      loading: false,
      deleteLoadingId: "",
      ...props,
    },
  });

describe("EstimationsTable", () => {
  it("renderiza filas básicas del listado", () => {
    const wrapper = createWrapper();
    const rows = wrapper.findAll("tbody tr");

    expect(rows).toHaveLength(2);
    expect(wrapper.text()).toContain("Acme");
    expect(wrapper.text()).toContain("Beta Corp");
  });

  it("filtra por búsqueda en clientName o projectName", async () => {
    const wrapper = createWrapper();
    const searchInput = wrapper.find('input[placeholder="Buscar por cliente o proyecto"]');

    await searchInput.setValue("mobile");

    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(1);
    expect(wrapper.text()).toContain("Beta Corp");
    expect(wrapper.text()).not.toContain("Acme");
  });

  it("filtra por rango de monto", async () => {
    const wrapper = createWrapper();
    const minInput = wrapper.find('input[placeholder="Monto mínimo"]');
    const maxInput = wrapper.find('input[placeholder="Monto máximo"]');

    await minInput.setValue("1500");
    await maxInput.setValue("3500");

    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(1);
    expect(wrapper.text()).toContain("Beta Corp");
    expect(wrapper.text()).not.toContain("Acme");
  });
});
