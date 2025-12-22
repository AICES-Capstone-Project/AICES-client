// src/pages/SystemPages/Reports/ExecutiveSummary/ExecutiveSummary.tsx
import { Alert } from "antd";
import type { SystemExecutiveSummary } from "../../../../types/systemReport.types";
import { fmtMoney, fmtNumber, fmtPercent } from "../components/formatters";
import { ReportKpiRow, ReportKpiCard } from "../components";

export type ExecutiveSummaryProps = {
  loading: boolean;
  data?: SystemExecutiveSummary;
  error?: string;
};

export default function ExecutiveSummary({ loading, data, error }: ExecutiveSummaryProps) {
  return (
    <>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load Executive Summary"
          description={error}
          style={{ marginBottom: 12 }}
        />
      )}

      <ReportKpiRow cols={{ xs: 24, sm: 12, md: 8, lg: 6 }} gutter={[16, 16]}>
        <ReportKpiCard
          loading={loading}
          label="Total Companies"
          value={fmtNumber(data?.totalCompanies)}
        />
        <ReportKpiCard
          loading={loading}
          label="Active Companies"
          value={fmtNumber(data?.activeCompanies)}
        />
        <ReportKpiCard loading={loading} label="Total Jobs" value={fmtNumber(data?.totalJobs)} />
        <ReportKpiCard
          loading={loading}
          label="Monthly Revenue"
          value={fmtMoney(data?.totalRevenue)}
        />
        <ReportKpiCard
          loading={loading}
          label="AI Processed Resumes"
          value={fmtNumber(data?.aiProcessedResumes)}
        />
        <ReportKpiCard
          loading={loading}
          label="Retention Rate"
          value={fmtPercent(data?.companyRetentionRate)}
        />
      </ReportKpiRow>
    </>
  );
}
