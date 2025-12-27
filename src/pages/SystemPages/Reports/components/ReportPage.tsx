import React from "react";
import { Card } from "antd";

type ReportPageProps = {
  children: React.ReactNode;
};

export default function ReportPage({ children }: ReportPageProps) {
  return (
    <Card
      bordered={false}
      className="aices-card"
      style={{
        borderRadius: 16,
        boxShadow: "none",
      }}
      styles={{
        body: {
          padding: 20,
        },
      }}
    >
      {children}
    </Card>
  );
}
