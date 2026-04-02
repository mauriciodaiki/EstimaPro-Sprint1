const normalize = (value) => String(value ?? "").toLowerCase().trim();

export const applyEstimationFilters = (estimaciones, filters) => {
  const search = normalize(filters.search);
  const min = filters.minMonto === "" ? null : Number(filters.minMonto);
  const max = filters.maxMonto === "" ? null : Number(filters.maxMonto);

  return estimaciones.filter((item) => {
    const cliente = normalize(item.cliente);
    const proyecto = normalize(item.proyecto);
    const monto = Number(item.monto) || 0;

    const matchesSearch =
      search.length === 0 || cliente.includes(search) || proyecto.includes(search);

    const matchesMin = min === null || monto >= min;
    const matchesMax = max === null || monto <= max;

    return matchesSearch && matchesMin && matchesMax;
  });
};
