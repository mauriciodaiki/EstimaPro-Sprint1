import { applyEstimationFilters } from "../../utils/filters";

const baseItems = [
  { id: "1", cliente: "Acme", proyecto: "Portal Web", monto: 1000 },
  { id: "2", cliente: "Beta", proyecto: "App Móvil", monto: 2500 },
  { id: "3", cliente: "Gamma", proyecto: "Mantenimiento", monto: 700 },
];

describe("utils/filters", () => {
  it("filtra por texto en cliente o proyecto", () => {
    const result = applyEstimationFilters(baseItems, {
      search: "beta",
      minMonto: "",
      maxMonto: "",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filtra por monto mínimo", () => {
    const result = applyEstimationFilters(baseItems, {
      search: "",
      minMonto: 1000,
      maxMonto: "",
    });

    expect(result.map((item) => item.id)).toEqual(["1", "2"]);
  });

  it("filtra por monto máximo", () => {
    const result = applyEstimationFilters(baseItems, {
      search: "",
      minMonto: "",
      maxMonto: 1000,
    });

    expect(result.map((item) => item.id)).toEqual(["1", "3"]);
  });

  it("combina filtros de texto y rango de monto", () => {
    const result = applyEstimationFilters(baseItems, {
      search: "app",
      minMonto: 2000,
      maxMonto: 3000,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("retorna vacío cuando no hay coincidencias", () => {
    const result = applyEstimationFilters(baseItems, {
      search: "inexistente",
      minMonto: "",
      maxMonto: "",
    });

    expect(result).toEqual([]);
  });
});
