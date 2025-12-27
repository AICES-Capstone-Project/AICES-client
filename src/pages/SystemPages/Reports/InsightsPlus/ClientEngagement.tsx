// src/pages/SystemPages/Reports/InsightsPlus/ClientEngagement.tsx
import React from "react";
import { Typography, Table, Alert, Tag } from "antd";
import ReportTableCard from "../components/ReportTableCard";

import type { ColumnsType } from "antd/es/table";
import type { SystemClientEngagementReport } from "../../../../types/systemReport.types";
import { fmtNumber, fmtPercent } from "../components/formatters";

const { Text } = Typography;

export type ClientEngagementProps = {
  loading: boolean;
  data?: SystemClientEngagementReport;
  error?: string;
};

type RowItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export default function ClientEngagement({
  loading,
  data,
  error,
}: ClientEngagementProps) {
  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Client Engagement failed to load"
        description={error}
        style={{ marginBottom: 16 }}
      />
    );
  }

  const columns: ColumnsType<RowItem> = [
    { title: "Metric", dataIndex: "label", key: "label" },
    { title: "Value", dataIndex: "value", key: "value", align: "right" },
  ];

  const usageData: RowItem[] = [
    {
      key: "avgJobs",
      label: "Avg Jobs / Company / Month",
      value: (
        <Text strong>
          {fmtNumber(data?.usageFrequency?.averageJobsPerCompanyPerMonth)}
        </Text>
      ),
    },
    {
      key: "avgCampaigns",
      label: "Avg Campaigns / Company / Month",
      value: (
        <Text strong>
          {fmtNumber(data?.usageFrequency?.averageCampaignsPerCompanyPerMonth)}
        </Text>
      ),
    },
  ];

  const trust = data?.aiTrustLevel?.trustPercentage;
  const hi = data?.aiTrustLevel?.highScoreCandidatesCount ?? 0;
  const hired = data?.aiTrustLevel?.highScoreCandidatesHiredCount ?? 0;

  // Swagger-driven: do NOT derive extra KPIs not provided by BE
  const trustData: RowItem[] = [
    {
      key: "trustPct",
      label: "AI Trust Percentage",
      value: <Tag color="blue">{fmtPercent(trust, 2)}</Tag>,
    },
    {
      key: "hiScore",
      label: "High-score Candidates",
      value: fmtNumber(hi),
    },
    {
      key: "hiHired",
      label: "High-score Hired",
      value: <Tag color="green">{fmtNumber(hired)}</Tag>,
    },
  ];

  return (
    <ReportTableCard title="Client Engagement" hideTitle loading={loading}>
      <Text strong>Usage Frequency</Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={usageData}
        rowKey="key"
      />

      <Text strong style={{ display: "block", marginTop: 16 }}>
        AI Trust Level
      </Text>
      <Table
        size="small"
        style={{ marginTop: 8 }}
        pagination={false}
        columns={columns}
        dataSource={trustData}
        rowKey="key"
      />
    </ReportTableCard>
  );
}
