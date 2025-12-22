import React from "react";
import { Card } from "antd";

type ReportChartCardProps = {
  title: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
};

export default function ReportChartCard({
  title,
  extra,
  loading,
  children,
}: ReportChartCardProps) {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      className="aices-card"
      style={{ borderRadius: 16 }}
    >
      {children}
    </Card>
  );
}
