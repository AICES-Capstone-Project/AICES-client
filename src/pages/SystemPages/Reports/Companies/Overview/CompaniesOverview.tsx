// src/pages/SystemPages/Reports/Companies/Overview/CompaniesOverview.tsx

import { Typography, Table, Alert } from "antd";
import ReportTableCard from "../../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type { SystemCompaniesOverviewReport } from "../../../../../types/systemReport.types";
import { fmtNumber } from "../../components/formatters";

const { Text } = Typography;

export type CompaniesOverviewProps = {
  loading: boolean;
  data?: SystemCompaniesOverviewReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export default function CompaniesOverview({
  loading,
  data,
  error,
}: CompaniesOverviewProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Companies Overview failed to load"
        description={error}
        style={{ marginBottom: 16 }}
      />
    );
  }

  const metricColumns: ColumnsType<RowItem> = [
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

  const overviewData: RowItem[] = [
    {
      key: "active",
      label: "Active Companies",
      value: <Text>{fmtNumber(data?.activeCompanies)}</Text>,
    },
    {
      key: "inactive",
      label: "Inactive Companies",
      value: <Text>{fmtNumber(data?.inactiveCompanies)}</Text>,
    },
    {
      key: "new",
      label: "New Companies This Month",
      value: <Text>{fmtNumber(data?.newCompaniesThisMonth)}</Text>,
    },
  ];

  // UI-only change: remove colored Tags -> plain black Text
  const subscriptionData: RowItem[] = [
    {
      key: "sub-active",
      label: "With Active Subscription",
      value: (
        <Text>{fmtNumber(data?.subscriptionBreakdown?.withActiveSubscription)}</Text>
      ),
    },
    {
      key: "sub-expired",
      label: "With Expired Subscription",
      value: (
        <Text>{fmtNumber(data?.subscriptionBreakdown?.withExpiredSubscription)}</Text>
      ),
    },
    {
      key: "sub-none",
      label: "Without Subscription",
      value: <Text>{fmtNumber(data?.subscriptionBreakdown?.withoutSubscription)}</Text>,
    },
  ];

  const verificationData: RowItem[] = [
    {
      key: "verified",
      label: "Verified Companies",
      value: <Text>{fmtNumber(data?.verificationBreakdown?.verified)}</Text>,
    },
    {
      key: "pending",
      label: "Pending Verification",
      value: <Text>{fmtNumber(data?.verificationBreakdown?.pending)}</Text>,
    },
    {
      key: "rejected",
      label: "Rejected Companies",
      value: <Text>{fmtNumber(data?.verificationBreakdown?.rejected)}</Text>,
    },
  ];

  return (
    <ReportTableCard
      title="Overview"
      hideTitle
      loading={loading}
      extra={data ? <Text>{fmtNumber(data.totalCompanies)} total</Text> : null}
    >
      <Text strong>Company Metrics</Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        columns={metricColumns}
        dataSource={overviewData}
        pagination={false}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Subscription Breakdown
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        columns={metricColumns}
        dataSource={subscriptionData}
        pagination={false}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Verification Breakdown
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        columns={metricColumns}
        dataSource={verificationData}
        pagination={false}
        rowKey="key"
      />
    </ReportTableCard>
  );
}
