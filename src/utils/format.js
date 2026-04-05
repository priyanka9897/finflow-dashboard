export function fmt(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

export function fmtShort(amount) {
  if (amount >= 1000) return "$" + (amount / 1000).toFixed(1) + "k";
  return "$" + Math.round(amount);
}

export const CHART_COLORS = [
  "#4f8ef7", "#22c97a", "#f25c5c", "#f5a623",
  "#a78bfa", "#22d3ee", "#fb923c", "#f472b6",
];

export function getCatColor(index) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
