import { mount } from "@vue/test-utils";
import DashboardMetrics from "../../components/DashboardMetrics.vue";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

describe("components/DashboardMetrics", () => {
  it("renderiza las tarjetas básicas", () => {
    const wrapper = mount(DashboardMetrics, {
      props: {
        items: [],
      },
    });

    expect(wrapper.text()).toContain("Total estimaciones");
    expect(wrapper.text()).toContain("Monto total");
    expect(wrapper.text()).toContain("Promedio");
    expect(wrapper.text()).toContain("Máximo");
    expect(wrapper.text()).toContain("Mínimo");
  });

  it("muestra valores correctos cuando hay datos", () => {
    const items = [{ monto: 1000 }, { monto: 2000 }];
    const wrapper = mount(DashboardMetrics, {
      props: { items },
    });

    expect(wrapper.text()).toContain("2");
    expect(wrapper.text()).toContain(formatCurrency(3000));
    expect(wrapper.text()).toContain(formatCurrency(1500));
    expect(wrapper.text()).toContain(formatCurrency(2000));
    expect(wrapper.text()).toContain(formatCurrency(1000));
  });

  it("muestra ceros cuando no hay datos", () => {
    const wrapper = mount(DashboardMetrics, {
      props: { items: [] },
    });

    expect(wrapper.text()).toContain("0");
    expect(wrapper.text()).toContain(formatCurrency(0));
  });
});
