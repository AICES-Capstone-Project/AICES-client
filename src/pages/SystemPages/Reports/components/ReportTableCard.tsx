// src/pages/SystemPages/Reports/components/ReportTableCard.tsx
import React from "react";
import { Card } from "antd";

type ReportTableCardProps = {
  title: React.ReactNode;
  loading?: boolean;
  extra?: React.ReactNode;
  children: React.ReactNode;
};

export default function ReportTableCard({
  title,
  loading,
  extra,
  children,
}: ReportTableCardProps) {
  return (
    <Card
      title={title}
      loading={loading}
      className="aices-card"
      style={{ borderRadius: 16 }}
      bodyStyle={{ paddingTop: 8 }}
      extra={extra}
    >
      {children}
    </Card>
  );
}
