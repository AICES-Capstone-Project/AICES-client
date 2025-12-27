// src/pages/SystemPages/Reports/Jobs/Statistics/JobsStatistics.tsx

import { Typography, Table, Alert } from "antd";
import ReportTableCard from "../../components/ReportTableCard";

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

  // UI-only change: remove colored Tags -> plain black Text
  const overviewData: RowItem[] = [
    {
      key: "total",
      label: "Total Jobs",
      value: <Text>{fmtNumber(data?.totalJobs)}</Text>,
    },
    {
      key: "active",
      label: "Active Jobs",
      value: <Text>{fmtNumber(data?.activeJobs)}</Text>,
    },
    {
      key: "new",
      label: "New Jobs This Month",
      value: <Text>{fmtNumber(data?.newJobsThisMonth)}</Text>,
    },
    {
      key: "avgApps",
      label: "Average Applications per Job",
      value: <Text>{fmtNumber(data?.averageApplicationsPerJob)}</Text>,
    },
  ];

  const statusData: RowItem[] = [
    {
      key: "published",
      label: "Published Jobs",
      value: <Text>{fmtNumber(data?.statusBreakdown?.published)}</Text>,
    },
    {
      key: "draft",
      label: "Draft Jobs",
      value: <Text>{fmtNumber(data?.statusBreakdown?.draft)}</Text>,
    },
    {
      key: "closed",
      label: "Closed Jobs",
      value: <Text>{fmtNumber(data?.statusBreakdown?.closed)}</Text>,
    },
  ];

  return (
    <ReportTableCard title="Statistics" hideTitle loading={loading}>
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
            render: (v: number) => fmtNumber(v),
          },
        ]}
      />
    </ReportTableCard>
  );
}
