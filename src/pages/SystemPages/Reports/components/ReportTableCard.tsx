import React from "react";
import { Card } from "antd";

type ReportTableCardProps = {
  title: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
};

export default function ReportTableCard({
  title,
  extra,
  loading,
  children,
}: ReportTableCardProps) {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      className="aices-card"
      style={{ borderRadius: 16 }}
      bodyStyle={{ paddingTop: 8 }}
    >
      {children}
    </Card>
  );
}
