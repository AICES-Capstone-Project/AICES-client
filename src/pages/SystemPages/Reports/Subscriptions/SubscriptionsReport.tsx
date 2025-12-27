// src/pages/SystemPages/Reports/Subscriptions/SubscriptionsReport.tsx
import React from "react";
import { Typography, Table, Alert } from "antd";
import ReportTableCard from "../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type { SystemSubscriptionsReport } from "../../../../types/systemReport.types";
import { fmtMoney, fmtNumber } from "../components/formatters";

const { Text } = Typography;

export type SubscriptionsReportProps = {
  loading: boolean;
  data?: SystemSubscriptionsReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export default function SubscriptionsReport({
  loading,
  data,
  error,
}: SubscriptionsReportProps) {
  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Failed to load Subscriptions report"
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
  const summaryData: RowItem[] = [
    {
      key: "free",
      label: "Free Companies",
      value: <Text>{fmtNumber(data?.freeCompanies)}</Text>,
    },
    {
      key: "paid",
      label: "Paid Companies",
      value: <Text>{fmtNumber(data?.paidCompanies)}</Text>,
    },
    {
      key: "monthlyRevenue",
      label: "Monthly Revenue",
      value: <Text strong>{fmtMoney(data?.monthlyRevenue)}</Text>,
    },
    {
      key: "popularPlan",
      label: "Most Popular Plan",
      value: <Text>{data?.popularPlan || "--"}</Text>,
    },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: <Text>{fmtMoney(data?.breakdown?.totalRevenue)}</Text>,
    },
    {
      key: "avgRevenue",
      label: "Average Revenue per Company",
      value: (
        <Text>{fmtMoney(data?.breakdown?.averageRevenuePerCompany)}</Text>
      ),
    },
  ];

  return (
    <ReportTableCard title="Subscriptions" hideTitle loading={loading}>
      <Text strong>Revenue Summary</Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={summaryData}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Plan Statistics
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        rowKey={(r) => String(r.subscriptionId)}
        dataSource={data?.breakdown?.planStatistics || []}
        columns={[
          { title: "Plan", dataIndex: "planName", key: "planName" },
          {
            title: "Companies",
            dataIndex: "companyCount",
            key: "companyCount",
            width: 140,
            align: "right",
            render: (v: number) => fmtNumber(v),
          },
          {
            title: "Revenue",
            dataIndex: "revenue",
            key: "revenue",
            width: 160,
            align: "right",
            render: (v: number) => fmtMoney(v),
          },
        ]}
      />
    </ReportTableCard>
  );
}
