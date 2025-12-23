// src/pages/SystemPages/Reports/Jobs/Effectiveness/JobsEffectiveness.tsx

import { Card, Typography, Table, Alert, Tag } from "antd";
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
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      align: "right",
    },
  ];

  const tableData: RowItem[] = [
    {
      key: "avgResumes",
      label: "Average Resumes per Job",
      value: (
        <Text strong>{fmtNumber(data?.averageResumesPerJob)}</Text>
      ),
    },
    {
      key: "qualifiedRate",
      label: "Qualified Rate",
      value: (
        <Tag color="blue">{fmtPercent(data?.qualifiedRate)}</Tag>
      ),
    },
    {
      key: "successRate",
      label: "Success Hiring Rate",
      value: (
        <Tag color="green">{fmtPercent(data?.successHiringRate)}</Tag>
      ),
    },
  ];

  return (
    <Card title="Effectiveness" loading={loading} className="aices-card">
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={tableData}
        rowKey="key"
      />
    </Card>
  );
}
