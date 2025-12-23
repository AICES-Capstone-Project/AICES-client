// src/pages/SystemPages/Reports/Jobs/Statistics/JobsStatistics.tsx

import { Card, Typography, Table, Alert, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SystemJobsStatisticsReport } from "../../../../../types/systemReport.types";
import { fmtNumber } from "../../components/formatters";

const { Text } = Typography;

export type JobsStatisticsProps = {
  loading: boolean;
  data?: SystemJobsStatisticsReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export default function JobsStatistics({
  loading,
  data,
  error,
}: JobsStatisticsProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Jobs Statistics failed to load"
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

  const overviewData: RowItem[] = [
    {
      key: "total",
      label: "Total Jobs",
      value: fmtNumber(data?.totalJobs),
    },
    {
      key: "active",
      label: "Active Jobs",
      value: (
        <Tag color="green">{fmtNumber(data?.activeJobs)}</Tag>
      ),
    },
    {
      key: "new",
      label: "New Jobs This Month",
      value: fmtNumber(data?.newJobsThisMonth),
    },
    {
      key: "avgApps",
      label: "Average Applications per Job",
      value: fmtNumber(data?.averageApplicationsPerJob),
    },
  ];

  const statusData: RowItem[] = [
    {
      key: "published",
      label: "Published Jobs",
      value: (
        <Tag color="green">
          {fmtNumber(data?.statusBreakdown?.published)}
        </Tag>
      ),
    },
    {
      key: "draft",
      label: "Draft Jobs",
      value: (
        <Tag color="gold">
          {fmtNumber(data?.statusBreakdown?.draft)}
        </Tag>
      ),
    },
    {
      key: "closed",
      label: "Closed Jobs",
      value: (
        <Tag color="red">
          {fmtNumber(data?.statusBreakdown?.closed)}
        </Tag>
      ),
    },
  ];

  return (
    <Card title="Statistics" loading={loading} className="aices-card">
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
        Status Breakdown
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={statusData}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Top Categories
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        rowKey={(r) => String(r.categoryId)}
        dataSource={data?.topCategories || []}
        columns={[
          { title: "Category", dataIndex: "categoryName", key: "categoryName" },
          {
            title: "Jobs",
            dataIndex: "jobCount",
            key: "jobCount",
            width: 120,
            align: "right",
          },
        ]}
      />
    </Card>
  );
}
