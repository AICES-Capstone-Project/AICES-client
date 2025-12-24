import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

type ReportKpiCardProps = {
  label: string;
  value: React.ReactNode;
  loading?: boolean;
  hint?: React.ReactNode;

  /** NEW: color tone for value */
  tone?: "default" | "success";
};

export default function ReportKpiCard({
  label,
  value,
  loading,
  hint,
  tone = "default",
}: ReportKpiCardProps) {
  const valueStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 800,
    marginTop: 6,
    lineHeight: 1.1,
    color: tone === "success" ? "var(--aices-green)" : undefined,
  };

  return (
    <Card loading={loading} className="aices-card" style={{ borderRadius: 14 }}>
      <Text type="secondary">{label}</Text>

      <div style={valueStyle}>{value}</div>

      {hint ? (
        <div style={{ marginTop: 10 }}>
          <Text type="secondary">{hint}</Text>
        </div>
      ) : null}
    </Card>
  );
}
