// src/pages/SystemPages/Reports/Companies/Overview/CompaniesOverview.tsx

import { Card, Typography, Table, Alert, Tag } from "antd";
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
      value: fmtNumber(data?.activeCompanies),
    },
    {
      key: "inactive",
      label: "Inactive Companies",
      value: fmtNumber(data?.inactiveCompanies),
    },
    {
      key: "new",
      label: "New Companies This Month",
      value: fmtNumber(data?.newCompaniesThisMonth),
    },
  ];

  const subscriptionData: RowItem[] = [
    {
      key: "sub-active",
      label: "With Active Subscription",
      value: (
        <Tag color="green">
          {fmtNumber(data?.subscriptionBreakdown?.withActiveSubscription)}
        </Tag>
      ),
    },
    {
      key: "sub-expired",
      label: "With Expired Subscription",
      value: (
        <Tag color="gold">
          {fmtNumber(data?.subscriptionBreakdown?.withExpiredSubscription)}
        </Tag>
      ),
    },
    {
      key: "sub-none",
      label: "Without Subscription",
      value: fmtNumber(data?.subscriptionBreakdown?.withoutSubscription),
    },
  ];

  const verificationData: RowItem[] = [
    {
      key: "verified",
      label: "Verified Companies",
      value: (
        <Tag color="green">
          {fmtNumber(data?.verificationBreakdown?.verified)}
        </Tag>
      ),
    },
    {
      key: "pending",
      label: "Pending Verification",
      value: (
        <Tag color="gold">
          {fmtNumber(data?.verificationBreakdown?.pending)}
        </Tag>
      ),
    },
    {
      key: "rejected",
      label: "Rejected Companies",
      value: (
        <Tag color="red">
          {fmtNumber(data?.verificationBreakdown?.rejected)}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      title="Overview"
      loading={loading}
      className="aices-card"
      extra={
        data ? (
          <Tag color="green">{fmtNumber(data.totalCompanies)} total</Tag>
        ) : null
      }
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
    </Card>
  );
}
