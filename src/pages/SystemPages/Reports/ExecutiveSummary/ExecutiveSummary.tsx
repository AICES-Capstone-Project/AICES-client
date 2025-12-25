
import { Alert, Typography } from "antd";
import type { SystemExecutiveSummary } from "../../../../types/systemReport.types";
import { fmtMoney, fmtNumber} from "../components/formatters";
import { ReportKpiRow, ReportKpiCard } from "../components";

const { Text} = Typography;

export type ExecutiveSummaryProps = {
  loading: boolean;
  data?: SystemExecutiveSummary;
  error?: string;
};

export default function ExecutiveSummary({
  loading,
  data,
  error,
}: ExecutiveSummaryProps) {
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

      {/* FULL-WIDTH KPI GRID */}
      <ReportKpiRow cols={{ xs: 24, sm: 12, md: 8, lg: 8 }} gutter={[16, 16]}>
        <ReportKpiCard
          loading={loading}
          label="Monthly Revenue"
          value={fmtMoney(data?.totalRevenue)}
          tone="success"
          hint={<Text type="secondary">Revenue generated</Text>}
        />


        <ReportKpiCard
          loading={loading}
          label="Total Companies"
          value={fmtNumber(data?.totalCompanies)}
          tone="success"
          hint={<Text type="secondary">Registered companies</Text>}
        />

        <ReportKpiCard
          loading={loading}
          label="Total Jobs"
          value={fmtNumber(data?.totalJobs)}
          tone="success"
          hint={<Text type="secondary">Jobs in system</Text>}
        />

        <ReportKpiCard
          loading={loading}
          label="AI Processed Resumes"
          value={fmtNumber(data?.aiProcessedResumes)}
          tone="success"
          hint={<Text type="secondary">Processed by AI</Text>}
        />

      </ReportKpiRow>
      {/* Responsive: stack on small screens */}
      <style>
        {`
          @media (max-width: 992px) {
            .report-exec-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </>
  );
}
