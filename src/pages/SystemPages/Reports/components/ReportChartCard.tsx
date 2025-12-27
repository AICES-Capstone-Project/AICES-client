import React from "react";
import { Card } from "antd";

type ReportChartCardProps = {
  title: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;

  /** UI-only: ẩn header để tránh trùng title */
  hideTitle?: boolean;

  /** UI-only: tuỳ chỉnh padding body */
  bodyPadding?: number;
};

export default function ReportChartCard({
  title,
  extra,
  loading,
  children,
  hideTitle = false,
  bodyPadding = 16,
}: ReportChartCardProps) {
  return (
    <Card
      bordered={false}
      loading={loading}
      title={hideTitle ? undefined : title}
      extra={hideTitle ? undefined : extra}
      style={{
        borderRadius: 16,
        boxShadow: "none",
        background: "transparent",
      }}
      styles={{
        header: {
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(0,0,0,0.02)",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          marginBottom: 0,
        },
        body: {
          padding: bodyPadding,
        },
      }}
    >
      {children}
    </Card>
  );
}
