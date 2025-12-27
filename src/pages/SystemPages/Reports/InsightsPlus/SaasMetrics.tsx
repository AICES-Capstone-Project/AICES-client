// src/pages/SystemPages/Reports/InsightsPlus/SaasMetrics.tsx
import React from "react";
import { Typography, Table, Alert, Tag } from "antd";
import ReportTableCard from "../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type {
  SystemSaasMetricsReport,
  SaasTopCompanyItem,
  SaasChurnRiskCompanyItem,
} from "../../../../types/systemReport.types";
import { fmtNumber } from "../components/formatters";

const { Text } = Typography;

export type SaasMetricsProps = {
  loading: boolean;
  data?: SystemSaasMetricsReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

const riskTag = (risk?: string) => {
  if (risk === "High") return <Tag color="red">High</Tag>;
  if (risk === "Medium") return <Tag color="gold">Medium</Tag>;
  return <Tag color="green">Low</Tag>;
};

export default function SaasMetrics({
  loading,
  data,
  error,
}: SaasMetricsProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="SaaS Metrics failed to load"
        description={error}
        style={{ marginBottom: 16 }}
      />
    );
  }

  const columns: ColumnsType<RowItem> = [
    { title: "Metric", dataIndex: "label", key: "label" },
    { title: "Value", dataIndex: "value", key: "value", align: "right" },
  ];

  const adoptionData: RowItem[] = [
    {
      key: "screening",
      label: "Screening Usage Count",
      value: (
        <Text strong>
          {fmtNumber(data?.featureAdoption?.screeningUsageCount)}
        </Text>
      ),
    },
    {
      key: "tracking",
      label: "Tracking Usage Count",
      value: (
        <Text strong>
          {fmtNumber(data?.featureAdoption?.trackingUsageCount)}
        </Text>
      ),
    },
    {
      key: "export",
      label: "Export Usage Count",
      value: (
        <Text strong>{fmtNumber(data?.featureAdoption?.exportUsageCount)}</Text>
      ),
    },
  ];

  const topCols: ColumnsType<SaasTopCompanyItem> = [
    { title: "Company", dataIndex: "companyName", key: "companyName" },
    {
      title: "Resumes",
      dataIndex: "totalResumesUploaded",
      key: "totalResumesUploaded",
      width: 120,
      align: "right",
      render: (v: number) => fmtNumber(v),
    },
    {
      title: "Jobs",
      dataIndex: "totalJobsCreated",
      key: "totalJobsCreated",
      width: 90,
      align: "right",
      render: (v: number) => fmtNumber(v),
    },
    {
      title: "Campaigns",
      dataIndex: "totalCampaignsCreated",
      key: "totalCampaignsCreated",
      width: 120,
      align: "right",
      render: (v: number) => fmtNumber(v),
    },
    {
      title: "Activity Score",
      dataIndex: "activityScore",
      key: "activityScore",
      width: 130,
      align: "right",
      render: (v: number) => <Tag color="blue">{fmtNumber(v)}</Tag>,
    },
  ];

  const churnCols: ColumnsType<SaasChurnRiskCompanyItem> = [
    { title: "Company", dataIndex: "companyName", key: "companyName" },
    { title: "Plan", dataIndex: "subscriptionPlan", key: "subscriptionPlan" },
    {
      title: "Risk",
      dataIndex: "riskLevel",
      key: "riskLevel",
      width: 120,
      align: "center",
      render: (v: string) => riskTag(v),
    },
  ];

  return (
    <ReportTableCard title="SaaS Metrics" hideTitle loading={loading}>
      <Text strong>Feature Adoption</Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={adoptionData}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Top Companies
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        rowKey={(r) => String(r.companyId)}
        columns={topCols}
        dataSource={data?.topCompanies || []}
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        Churn Risk Companies
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        rowKey={(r) => String(r.companyId)}
        columns={churnCols}
        dataSource={data?.churnRiskCompanies || []}
      />
    </ReportTableCard>
  );
}
