// src/pages/SystemPages/Reports/AI/Scoring/AiScoring.tsx
import React from "react";
import { Typography, Table, Alert } from "antd";
import ReportTableCard from "../../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type { SystemAiScoringReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent, fmtMs } from "../../components/formatters";

const { Text } = Typography;

export type AiScoringProps = {
  loading: boolean;
  data?: SystemAiScoringReport;
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

export default function AiScoring({ loading, data, error }: AiScoringProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="AI Scoring Distribution failed to load"
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
  const overviewData: RowItem[] = [
    {
      key: "successRate",
      label: "Success Rate",
      value: <Text>{fmtPercent(ratioToPercent(data?.successRate))}</Text>,
    },
    {
      key: "avgTime",
      label: "Average Processing Time",
      value: <Text>{fmtMs(data?.averageProcessingTimeMs)}</Text>,
    },
    {
      key: "totalScored",
      label: "Total Resumes Scored",
      value: <Text>{fmtNumber(data?.statistics?.totalScored)}</Text>,
    },
    {
      key: "avgScore",
      label: "Average Score",
      value: <Text>{fmtNumber(data?.statistics?.averageScore)}</Text>,
    },
    {
      key: "medianScore",
      label: "Median Score",
      value: <Text>{fmtNumber(data?.statistics?.medianScore)}</Text>,
    },
  ];

  const distributionData: RowItem[] = [
    {
      key: "high",
      label: "High Score",
      value: <Text>{fmtPercent(ratioToPercent(data?.scoreDistribution?.high))}</Text>,
    },
    {
      key: "medium",
      label: "Medium Score",
      value: (
        <Text>{fmtPercent(ratioToPercent(data?.scoreDistribution?.medium))}</Text>
      ),
    },
    {
      key: "low",
      label: "Low Score",
      value: <Text>{fmtPercent(ratioToPercent(data?.scoreDistribution?.low))}</Text>,
    },
  ];

  return (
    <ReportTableCard title="Scoring Distribution" hideTitle loading={loading}>
      <Text strong>Overview</Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={overviewData}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Score Distribution
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={distributionData}
        rowKey="key"
      />
    </ReportTableCard>
  );
}
