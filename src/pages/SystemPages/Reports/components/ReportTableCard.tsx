import React from "react";
import { Card } from "antd";

type ReportTableCardProps = {
  title: React.ReactNode;
  loading?: boolean;
  extra?: React.ReactNode;
  children: React.ReactNode;

  /** UI-only: ẩn header để tránh trùng title */
  hideTitle?: boolean;

  /** UI-only: padding body (mặc định gọn cho table) */
  bodyPadding?: number;
};

export default function ReportTableCard({
  title,
  loading,
  extra,
  children,
  hideTitle = false,
  bodyPadding = 12,
}: ReportTableCardProps) {
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
          paddingTop: bodyPadding, // thay cho bodyStyle={{ paddingTop: 8 }}
        },
      }}
    >
      {children}
    </Card>
  );
}
