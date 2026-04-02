const CSV_HEADERS = ["Cliente", "Proyecto", "Monto", "Descripción", "Fecha"];

const escapeCell = (value) => {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
};

const formatMonto = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "0";
  return numeric.toFixed(2);
};

const toDateFromTimestamp = (timestamp) => {
  if (!timestamp) return null;

  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }

  if (timestamp instanceof Date) {
    return timestamp;
  }

  if (typeof timestamp === "number" || typeof timestamp === "string") {
    const parsed = new Date(timestamp);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof timestamp === "object" && "seconds" in timestamp) {
    const parsed = new Date(timestamp.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

const formatFecha = (item) => {
  const source = item.createdAt ?? item.updatedAt ?? null;
  const parsed = toDateFromTimestamp(source);

  if (!parsed) return "Sin fecha";

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
};

export const buildEstimacionesCsv = (estimaciones) => {
  const rows = estimaciones.map((item) => [
    item.cliente ?? "",
    item.proyecto ?? "",
    formatMonto(item.monto),
    item.descripcion ?? "",
    formatFecha(item),
  ]);

  const body = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  return `${CSV_HEADERS.join(",")}\n${body}`;
};

const buildFilename = () => {
  const stamp = new Date().toISOString().replaceAll(":", "-").slice(0, 19);
  return `estimaciones-${stamp}.csv`;
};

export const downloadCsv = (content, filename = buildFilename()) => {
  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const exportEstimacionesCsv = (estimaciones) => {
  const csv = buildEstimacionesCsv(estimaciones);
  downloadCsv(csv);
};
