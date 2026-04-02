const toMonto = (item) => {
  const amount = Number(item?.monto);
  return Number.isFinite(amount) ? amount : 0;
};

const toSafeItems = (items) => (Array.isArray(items) ? items : []);

const getMontos = (items = []) => toSafeItems(items).map((item) => toMonto(item));

export const getTotalEstimaciones = (items = []) => toSafeItems(items).length;

export const getMontoTotal = (items = []) =>
  getMontos(items).reduce((acc, amount) => acc + amount, 0);

export const getMontoPromedio = (items = []) => {
  const safeItems = toSafeItems(items);
  if (safeItems.length === 0) return 0;
  return getMontoTotal(safeItems) / safeItems.length;
};

export const getMontoMaximo = (items = []) => {
  if (toSafeItems(items).length === 0) return 0;
  return Math.max(...getMontos(items));
};

export const getMontoMinimo = (items = []) => {
  if (toSafeItems(items).length === 0) return 0;
  return Math.min(...getMontos(items));
};
