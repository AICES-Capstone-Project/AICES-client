// src/pages/SystemPages/Reports/components/formatters.ts

export const fmtPercent = (v?: number, digits = 0) => {
  // input expected 0..100 (vd: 46.43)
  if (typeof v !== "number") return "--";
  return `${v.toFixed(digits)}%`;
};

export const fmtPercent01 = (v?: number, digits = 0) => {
  // input expected 0..1 (vd: 0.4643)
  if (typeof v !== "number") return "--";
  return `${(v * 100).toFixed(digits)}%`;
};

export const fmtPercentAuto = (v?: number, digits = 0) => {
  // heuristic: <= 1 => treat as 0..1, else treat as 0..100
  if (typeof v !== "number") return "--";
  const pct = v <= 1 ? v * 100 : v;
  return `${pct.toFixed(digits)}%`;
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

export const fmtSeconds = (s?: number) => {
  if (typeof s !== "number") return "--";
  if (s < 1) return `${Math.round(s * 1000)} ms`;
  return `${s.toFixed(1)}s`;
};
