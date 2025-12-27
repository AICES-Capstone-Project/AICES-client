// src/pages/SystemPages/Reports/Jobs/Effectiveness/JobsEffectiveness.tsx
import React from "react";
import { Typography, Table, Alert } from "antd";
import ReportTableCard from "../../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type { SystemJobsEffectivenessReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent } from "../../components/formatters";

const { Text } = Typography;

export type JobsEffectivenessProps = {
  loading: boolean;
  data?: SystemJobsEffectivenessReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

// Swagger-driven: rates are ratios (0..1) -> convert to percent
const ratioToPercent = (v?: number) =>
  typeof v === "number" ? v * 100 : undefined;

export default function JobsEffectiveness({
  loading,
  data,
  error,
}: JobsEffectivenessProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Jobs Effectiveness failed to load"
        description={error}
        style={{ marginBottom: 16 }}
      />
    );
  }

  const columns: ColumnsType<RowItem> = [
    { title: "Metric", dataIndex: "label", key: "label" },
    { title: "Value", dataIndex: "value", key: "value", align: "right" },
  ];

  // UI-only change: remove colored Tags -> plain black Text
  const tableData: RowItem[] = [
    {
      key: "avgResumes",
      label: "Average Resumes per Job",
      value: <Text strong>{fmtNumber(data?.averageResumesPerJob)}</Text>,
    },
    {
      key: "qualifiedRate",
      label: "Qualified Rate",
      value: <Text>{fmtPercent(ratioToPercent(data?.qualifiedRate))}</Text>,
    },
    {
      key: "successRate",
      label: "Success Hiring Rate",
      value: <Text>{fmtPercent(ratioToPercent(data?.successHiringRate))}</Text>,
    },
  ];

  return (
    <ReportTableCard title="Effectiveness" hideTitle loading={loading}>
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={tableData}
        rowKey="key"
      />
    </ReportTableCard>
  );
}
