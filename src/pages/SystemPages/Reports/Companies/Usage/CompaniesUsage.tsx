// src/pages/SystemPages/Reports/Companies/Usage/CompaniesUsage.tsx

import { Card, Typography, Table, Alert, Tag } from "antd";
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
    {
      title: "Metric",
      dataIndex: "label",
      key: "label",
      width: "60%",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      align: "right",
    },
  ];

  const usageData: RowItem[] = [
    {
      key: "registered",
      label: "Registered Only Companies",
      value: fmtNumber(data?.registeredOnly),
    },
    {
      key: "active",
      label: "Active Companies",
      value: (
        <Tag color="blue">{fmtNumber(data?.activeCompanies)}</Tag>
      ),
    },
    {
      key: "frequent",
      label: "Frequent Companies",
      value: (
        <Tag color="cyan">{fmtNumber(data?.frequentCompanies)}</Tag>
      ),
    },
  ];

  const kpiData: RowItem[] = [
    {
      key: "activeRate",
      label: "Active Rate",
      value: (
        <Tag color="blue">
          {fmtPercent(data?.kpis?.activeRate)}
        </Tag>
      ),
    },
    {
      key: "aiUsageRate",
      label: "AI Usage Rate",
      value: (
        <Tag color="purple">
          {fmtPercent(data?.kpis?.aiUsageRate)}
        </Tag>
      ),
    },
    {
      key: "returningRate",
      label: "Returning Rate",
      value: (
        <Tag color="cyan">
          {fmtPercent(data?.kpis?.returningRate)}
        </Tag>
      ),
    },
  ];

  return (
    <Card title="Usage" loading={loading} className="aices-card">
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
    </Card>
  );
}
