import {
  getMontoMaximo,
  getMontoMinimo,
  getMontoPromedio,
  getMontoTotal,
  getTotalEstimaciones,
} from "../../utils/metrics";

const sampleItems = [
  { monto: 1000 },
  { monto: 2500.5 },
  { monto: 499.5 },
];

describe("utils/metrics", () => {
  it("calcula total de estimaciones", () => {
    expect(getTotalEstimaciones(sampleItems)).toBe(3);
  });

  it("calcula monto total", () => {
    expect(getMontoTotal(sampleItems)).toBe(4000);
  });

  it("calcula monto promedio", () => {
    expect(getMontoPromedio(sampleItems)).toBeCloseTo(1333.3333, 4);
  });

  it("calcula monto máximo", () => {
    expect(getMontoMaximo(sampleItems)).toBe(2500.5);
  });

  it("calcula monto mínimo", () => {
    expect(getMontoMinimo(sampleItems)).toBe(499.5);
  });

  it("maneja array vacío devolviendo ceros", () => {
    expect(getTotalEstimaciones([])).toBe(0);
    expect(getMontoTotal([])).toBe(0);
    expect(getMontoPromedio([])).toBe(0);
    expect(getMontoMaximo([])).toBe(0);
    expect(getMontoMinimo([])).toBe(0);
  });
});
