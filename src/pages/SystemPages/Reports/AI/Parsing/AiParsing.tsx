// src/pages/SystemPages/Reports/AI/Parsing/AiParsing.tsx
import React from "react";
import { Typography, Table, Alert } from "antd";
import ReportTableCard from "../../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type { SystemAiParsingReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent, fmtMs } from "../../components/formatters";

const { Text } = Typography;

export type AiParsingProps = {
  loading: boolean;
  data?: SystemAiParsingReport;
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

export default function AiParsing({ loading, data, error }: AiParsingProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="AI Parsing Quality failed to load"
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
      key: "total",
      label: "Total Resumes",
      value: <Text>{fmtNumber(data?.totalResumes)}</Text>,
    },
    {
      key: "success",
      label: "Successfully Parsed",
      value: <Text>{fmtNumber(data?.successfulParsing)}</Text>,
    },
    {
      key: "failed",
      label: "Failed Parsing",
      value: <Text>{fmtNumber(data?.failedParsing)}</Text>,
    },
    {
      key: "avgTime",
      label: "Average Processing Time",
      value: <Text>{fmtMs(data?.averageProcessingTimeMs)}</Text>,
    },
  ];

  return (
    <ReportTableCard title="Parsing Quality" hideTitle loading={loading}>
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
        Common Errors
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        rowKey={(r) => r.errorType}
        dataSource={data?.commonErrors || []}
        columns={[
          { title: "Error Type", dataIndex: "errorType", key: "errorType" },
          {
            title: "Count",
            dataIndex: "count",
            key: "count",
            width: 120,
            align: "right",
            render: (v: number) => fmtNumber(v),
          },
          {
            title: "Rate",
            dataIndex: "percentage",
            key: "percentage",
            width: 120,
            align: "right",
            render: (v: number) => (
              <Text>{fmtPercent(ratioToPercent(v))}</Text>
            ),
          },
        ]}
      />
    </ReportTableCard>
  );
}
