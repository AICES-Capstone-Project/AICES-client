// src/pages/SystemPages/Reports/components/formatters.ts
export const fmtPercent = (v?: number) => {
  if (typeof v !== "number") return "--";
  return `${Math.round(v * 100)}%`;
};

export const fmtNumber = (v?: number) =>
  typeof v === "number" ? v.toLocaleString() : "--";

export const fmtMoney = (v?: number) => {
  if (typeof v !== "number") return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(v);
};

export const fmtMs = (ms?: number) => {
  if (typeof ms !== "number") return "--";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};
