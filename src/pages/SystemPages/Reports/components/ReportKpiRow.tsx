import React from "react";
import { Row, Col } from "antd";

type ReportKpiRowProps = {
  children: React.ReactNode;
  cols?: { xs?: number; sm?: number; md?: number; lg?: number };
  gutter?: [number, number];
};

export default function ReportKpiRow({
  children,
  cols = { xs: 24, sm: 12, md: 6 },
  gutter = [16, 16],
}: ReportKpiRowProps) {
  const items = React.Children.toArray(children);

  return (
    <Row gutter={gutter}>
      {items.map((child, idx) => (
        <Col key={idx} xs={cols.xs} sm={cols.sm} md={cols.md} lg={cols.lg}>
          {child}
        </Col>
      ))}
    </Row>
  );
}
