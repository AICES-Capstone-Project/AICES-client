// src/pages/SystemPages/Reports/InsightsPlus/AiHealth.tsx
import React from "react";
import { Card, Typography, Table, Alert, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SystemAiHealthReport } from "../../../../types/systemReport.types";
import { fmtNumber, fmtPercent, fmtSeconds } from "../components/formatters";

const { Text } = Typography;

export type AiHealthProps = {
  loading: boolean;
  data?: SystemAiHealthReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export default function AiHealth({ loading, data, error }: AiHealthProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="AI Health failed to load"
        description={error}
        style={{ marginBottom: 16 }}
      />
    );
  }

  const columns: ColumnsType<RowItem> = [
    { title: "Metric", dataIndex: "label", key: "label" },
    { title: "Value", dataIndex: "value", key: "value", align: "right" },
  ];

  const healthData: RowItem[] = [
    {
      key: "successRate",
      label: "Success Rate",
      value: <Tag color="green">{fmtPercent(data?.successRate, 2)}</Tag>,
    },
    {
      key: "errorRate",
      label: "Error Rate",
      value: <Tag color="red">{fmtPercent(data?.errorRate, 2)}</Tag>,
    },
    {
      key: "avgTime",
      label: "Average Processing Time",
      value: <Text strong>{fmtSeconds(data?.averageProcessingTimeSeconds)}</Text>,
    },
  ];

  return (
    <Card title="AI Health" loading={loading} className="aices-card">
      <Text strong>Health Overview</Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={healthData}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Error Reasons
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        rowKey={(r) => r.errorType}
        dataSource={data?.errorReasons || []}
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
            title: "Percentage",
            dataIndex: "percentage",
            key: "percentage",
            width: 140,
            align: "right",
            render: (v: number) => <Tag color="gold">{fmtPercent(v, 2)}</Tag>,
          },
        ]}
      />
    </Card>
  );
}
