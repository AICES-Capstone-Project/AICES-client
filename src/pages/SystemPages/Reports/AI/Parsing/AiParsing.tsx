// src/pages/SystemPages/Reports/AI/Parsing/AiParsing.tsx
import React from "react";
import { Typography, Table, Alert, Tag } from "antd";
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

  const overviewData: RowItem[] = [
    {
      key: "successRate",
      label: "Success Rate",
      value: (
        <Tag color="green">{fmtPercent(ratioToPercent(data?.successRate))}</Tag>
      ),
    },
    {
      key: "total",
      label: "Total Resumes",
      value: fmtNumber(data?.totalResumes),
    },
    {
      key: "success",
      label: "Successfully Parsed",
      value: fmtNumber(data?.successfulParsing),
    },
    {
      key: "failed",
      label: "Failed Parsing",
      value: <Tag color="red">{fmtNumber(data?.failedParsing)}</Tag>,
    },
    {
      key: "avgTime",
      label: "Average Processing Time",
      value: fmtMs(data?.averageProcessingTimeMs),
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
        },
        {
          title: "Rate",
          dataIndex: "percentage",
          key: "percentage",
          width: 120,
          align: "right",
          render: (v: number) => fmtPercent(ratioToPercent(v)),
        },
      ]}
    />
  </ReportTableCard>
);

}
