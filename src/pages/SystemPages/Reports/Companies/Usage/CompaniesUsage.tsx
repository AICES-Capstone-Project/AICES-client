// src/pages/SystemPages/Reports/Companies/Usage/CompaniesUsage.tsx
import React from "react";
import { Typography, Table, Alert } from "antd";
import ReportTableCard from "../../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type { SystemCompaniesUsageReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent } from "../../components/formatters";

const { Text } = Typography;

export type CompaniesUsageProps = {
  loading: boolean;
  data?: SystemCompaniesUsageReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

// Swagger-driven: kpis are ratios (0..1) -> convert to percent
const ratioToPercent = (v?: number) =>
  typeof v === "number" ? v * 100 : undefined;

export default function CompaniesUsage({
  loading,
  data,
  error,
}: CompaniesUsageProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Companies Usage failed to load"
        description={error}
        style={{ marginBottom: 16 }}
      />
    );
  }

  const columns: ColumnsType<RowItem> = [
    { title: "Metric", dataIndex: "label", key: "label", width: "60%" },
    { title: "Value", dataIndex: "value", key: "value", align: "right" },
  ];

  // UI-only change: remove colored Tags -> plain black Text
  const usageData: RowItem[] = [
    {
      key: "registered",
      label: "Registered Only Companies",
      value: <Text>{fmtNumber(data?.registeredOnly)}</Text>,
    },
    {
      key: "engaged",
      label: "Engaged Companies",
      value: <Text>{fmtNumber(data?.engagedCompanies)}</Text>,
    },
    {
      key: "frequent",
      label: "Frequent Companies",
      value: <Text>{fmtNumber(data?.frequentCompanies)}</Text>,
    },
  ];

  const kpiData: RowItem[] = [
    {
      key: "activeRate",
      label: "Active Rate",
      value: <Text>{fmtPercent(ratioToPercent(data?.kpis?.activeRate))}</Text>,
    },
    {
      key: "aiUsageRate",
      label: "AI Usage Rate",
      value: <Text>{fmtPercent(ratioToPercent(data?.kpis?.aiUsageRate))}</Text>,
    },
    {
      key: "returningRate",
      label: "Returning Rate",
      value: (
        <Text>{fmtPercent(ratioToPercent(data?.kpis?.returningRate))}</Text>
      ),
    },
  ];

  return (
    <ReportTableCard title="Usage" hideTitle loading={loading}>
      <Text strong>Company Usage Overview</Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        columns={columns}
        dataSource={usageData}
        pagination={false}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        KPI Rates
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        columns={columns}
        dataSource={kpiData}
        pagination={false}
        rowKey="key"
      />
    </ReportTableCard>
  );
}
