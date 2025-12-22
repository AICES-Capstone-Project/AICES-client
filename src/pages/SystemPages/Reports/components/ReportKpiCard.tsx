import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

type ReportKpiCardProps = {
  label: string;
  value: React.ReactNode;
  loading?: boolean;
  hint?: React.ReactNode;
};

export default function ReportKpiCard({ label, value, loading, hint }: ReportKpiCardProps) {
  return (
    <Card loading={loading} className="aices-card" style={{ borderRadius: 14 }}>
      <Text type="secondary">{label}</Text>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, lineHeight: 1.1 }}>
        {value}
      </div>
      {hint ? (
        <div style={{ marginTop: 10 }}>
          <Text type="secondary">{hint}</Text>
        </div>
      ) : null}
    </Card>
  );
}
