import React from "react";
import { Divider, Row, Col, Alert, Tabs, message } from "antd";

import {
  systemReportExportService,
  type ReportExportFormat,
} from "../../../services/systemReportExportService";
import { systemReportService } from "../../../services/systemReportService";

import { ReportPage } from "./components";
import ReportTableCard from "./components/ReportTableCard";
import ReportExportDropdown from "./components/ReportExportDropdown";

import type {
  SystemExecutiveSummary,
  SystemCompaniesOverviewReport,
  SystemCompaniesUsageReport,
  SystemJobsStatisticsReport,
  SystemJobsEffectivenessReport,
  SystemAiParsingReport,
  SystemAiScoringReport,
  SystemSubscriptionsReport,
  SystemAiHealthReport,
  SystemClientEngagementReport,
  SystemSaasMetricsReport,
} from "../../../types/systemReport.types";

import ExecutiveSummary from "./ExecutiveSummary/ExecutiveSummary";
import CompaniesOverview from "./Companies/Overview/CompaniesOverview";
import CompaniesUsage from "./Companies/Usage/CompaniesUsage";
import JobsStatistics from "./Jobs/Statistics/JobsStatistics";
import JobsEffectiveness from "./Jobs/Effectiveness/JobsEffectiveness";
import AiParsing from "./AI/Parsing/AiParsing";
import AiScoring from "./AI/Scoring/AiScoring";
import SubscriptionsReport from "./Subscriptions/SubscriptionsReport";

// ✅ NEW: Insights+
import { AiHealth, ClientEngagement, SaasMetrics } from "./InsightsPlus";

/* ================= TYPES ================= */

type ReportTabKey =
  | "overview"
  | "insightsPlus"
  | "companies"
  | "jobs"
  | "ai"
  | "subscriptions";

type ReportState<T> = {
  loading: boolean;
  data?: T;
  error?: string;
};

/* ================= HELPERS ================= */

const downloadBlob = (blob: Blob, filename?: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "";
  a.click();
  window.URL.revokeObjectURL(url);
};

/* ================= COMPONENT ================= */

export default function ReportsOverview() {
  const [activeTab, setActiveTab] = React.useState<ReportTabKey>("overview");
  const [loadingAll, setLoadingAll] = React.useState(false);

  /** exporting global (FULL report) */
  const [exporting, setExporting] = React.useState(false);

  /* ===== DATA STATES ===== */
  const [exec, setExec] = React.useState<ReportState<SystemExecutiveSummary>>({
    loading: true,
  });
  const [companiesOverview, setCompaniesOverview] = React.useState<
    ReportState<SystemCompaniesOverviewReport>
  >({
    loading: true,
  });
  const [companiesUsage, setCompaniesUsage] = React.useState<
    ReportState<SystemCompaniesUsageReport>
  >({
    loading: true,
  });
  const [jobsStats, setJobsStats] = React.useState<
    ReportState<SystemJobsStatisticsReport>
  >({
    loading: true,
  });
  const [jobsEff, setJobsEff] = React.useState<
    ReportState<SystemJobsEffectivenessReport>
  >({
    loading: true,
  });
  const [aiParsing, setAiParsing] = React.useState<
    ReportState<SystemAiParsingReport>
  >({
    loading: true,
  });
  const [aiScoring, setAiScoring] = React.useState<
    ReportState<SystemAiScoringReport>
  >({
    loading: true,
  });
  const [subs, setSubs] = React.useState<
    ReportState<SystemSubscriptionsReport>
  >({
    loading: true,
  });

  // ✅ NEW: Insights+
  const [aiHealth, setAiHealth] = React.useState<
    ReportState<SystemAiHealthReport>
  >({
    loading: true,
  });
  const [engagement, setEngagement] = React.useState<
    ReportState<SystemClientEngagementReport>
  >({
    loading: true,
  });
  const [saas, setSaas] = React.useState<ReportState<SystemSaasMetricsReport>>({
    loading: true,
  });

  /* ================= EXPORT (FULL REPORT) ================= */

  const exportFullReport = React.useCallback(
    async (format: ReportExportFormat) => {
      try {
        setExporting(true);

        const { blob, filename } = await systemReportExportService.exportReport(
          format
        );

        downloadBlob(blob, filename);
        message.success("Export started");
      } catch (err: any) {
        console.error(err);
        message.error(err?.message || "Export failed");
      } finally {
        setExporting(false);
      }
    },
    []
  );

  /* ================= LOAD DATA ================= */

  const pickErr = (e: any) =>
    e?.response?.data?.message || e?.message || "Failed to load data";

  const loadAll = React.useCallback(async () => {
    setLoadingAll(true);

    setExec({ loading: true });
    setCompaniesOverview({ loading: true });
    setCompaniesUsage({ loading: true });
    setJobsStats({ loading: true });
    setJobsEff({ loading: true });
    setAiParsing({ loading: true });
    setAiScoring({ loading: true });
    setSubs({ loading: true });

    // ✅ NEW: reset Insights+
    setAiHealth({ loading: true });
    setEngagement({ loading: true });
    setSaas({ loading: true });

    const tasks = await Promise.allSettled([
      systemReportService.getExecutiveSummary(),
      systemReportService.getCompanyOverview(),
      systemReportService.getCompanyUsage(),
      systemReportService.getJobStatistics(),
      systemReportService.getJobEffectiveness(),
      systemReportService.getAiParsingQuality(),
      systemReportService.getAiScoringDistribution(),
      systemReportService.getSubscriptionRevenue(),

      // ✅ NEW
      systemReportService.getAiHealth(),
      systemReportService.getClientEngagement(),
      systemReportService.getSaasMetrics(),
    ]);

    const [
      execRes,
      companiesOverviewRes,
      companiesUsageRes,
      jobsStatsRes,
      jobsEffRes,
      aiParsingRes,
      aiScoringRes,
      subsRes,
      aiHealthRes,
      engagementRes,
      saasRes,
    ] = tasks;

    setExec(
      execRes.status === "fulfilled"
        ? { loading: false, data: execRes.value }
        : { loading: false, error: pickErr(execRes.reason) }
    );

    setCompaniesOverview(
      companiesOverviewRes.status === "fulfilled"
        ? { loading: false, data: companiesOverviewRes.value }
        : { loading: false, error: pickErr(companiesOverviewRes.reason) }
    );

    setCompaniesUsage(
      companiesUsageRes.status === "fulfilled"
        ? { loading: false, data: companiesUsageRes.value }
        : { loading: false, error: pickErr(companiesUsageRes.reason) }
    );

    setJobsStats(
      jobsStatsRes.status === "fulfilled"
        ? { loading: false, data: jobsStatsRes.value }
        : { loading: false, error: pickErr(jobsStatsRes.reason) }
    );

    setJobsEff(
      jobsEffRes.status === "fulfilled"
        ? { loading: false, data: jobsEffRes.value }
        : { loading: false, error: pickErr(jobsEffRes.reason) }
    );

    setAiParsing(
      aiParsingRes.status === "fulfilled"
        ? { loading: false, data: aiParsingRes.value }
        : { loading: false, error: pickErr(aiParsingRes.reason) }
    );

    setAiScoring(
      aiScoringRes.status === "fulfilled"
        ? { loading: false, data: aiScoringRes.value }
        : { loading: false, error: pickErr(aiScoringRes.reason) }
    );

    setSubs(
      subsRes.status === "fulfilled"
        ? { loading: false, data: subsRes.value }
        : { loading: false, error: pickErr(subsRes.reason) }
    );


    // ✅ NEW: set Insights+ states
    setAiHealth(
      aiHealthRes.status === "fulfilled"
        ? { loading: false, data: aiHealthRes.value }
        : { loading: false, error: pickErr(aiHealthRes.reason) }
    );
    setEngagement(
      engagementRes.status === "fulfilled"
        ? { loading: false, data: engagementRes.value }
        : { loading: false, error: pickErr(engagementRes.reason) }
    );
    setSaas(
      saasRes.status === "fulfilled"
        ? { loading: false, data: saasRes.value }
        : { loading: false, error: pickErr(saasRes.reason) }
    );

    setLoadingAll(false);
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const anyError =
    exec.error ||
    companiesOverview.error ||
    companiesUsage.error ||
    jobsStats.error ||
    jobsEff.error ||
    aiParsing.error ||
    aiScoring.error ||
    subs.error ||
    aiHealth.error ||
    engagement.error ||
    saas.error;

  /* ================= UI ================= */

  return (
    <ReportPage>
      {/* ===== STICKY TABS + GLOBAL EXPORT ===== */}
      <div className="report-tabs-sticky">
        <Row gutter={[12, 12]} align="middle" justify="space-between">
          <Col flex="auto">
            <Tabs
              activeKey={activeTab}
              onChange={(k) => setActiveTab(k as ReportTabKey)}
              animated
              items={[
                { key: "overview", label: "Overview", disabled: loadingAll },
                // ✅ NEW: Insights+ (đặt sau Overview)
                {
                  key: "insightsPlus",
                  label: "Insights+",
                  disabled: loadingAll,
                },

                {
                  key: "companies",
                  label: "Company Insights",
                  disabled: loadingAll,
                },
                { key: "jobs", label: "Job Performance", disabled: loadingAll },
                { key: "ai", label: "AI Performance", disabled: loadingAll },
                {
                  key: "subscriptions",
                  label: "Revenue & Plans",
                  disabled: loadingAll,
                },
              ]}
            />
          </Col>

          <Col>
            <ReportExportDropdown
              exporting={exporting}
              onExport={exportFullReport}
              size="middle"
              label="Export Full Report"
            />
          </Col>
        </Row>
      </div>

      <Divider />

      {anyError && (
        <Alert
          type="info"
          showIcon
          message="Some reports may be incomplete"
          description="One or more report sections failed to load."
          style={{ marginBottom: 16 }}
        />
      )}

      {/* ===== CONTENT ===== */}
      <div key={activeTab} className="report-tab-content">
        {activeTab === "overview" && (
          <ReportTableCard title="Executive Summary" loading={exec.loading}>
            <ExecutiveSummary {...exec} />
          </ReportTableCard>
        )}

        {/* ✅ NEW: Insights+ tab content */}
        {activeTab === "insightsPlus" && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ReportTableCard title="AI Health" loading={aiHealth.loading}>
                <AiHealth {...aiHealth} />
              </ReportTableCard>
            </Col>

            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Client Engagement"
                loading={engagement.loading}
              >
                <ClientEngagement {...engagement} />
              </ReportTableCard>
            </Col>

            <Col xs={24}>
              <ReportTableCard title="SaaS Metrics" loading={saas.loading}>
                <SaasMetrics {...saas} />
              </ReportTableCard>
            </Col>
          </Row>
        )}

        {activeTab === "companies" && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Company Overview"
                loading={companiesOverview.loading}
              >
                <CompaniesOverview {...companiesOverview} />
              </ReportTableCard>
            </Col>

            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Company Usage"
                loading={companiesUsage.loading}
              >
                <CompaniesUsage {...companiesUsage} />
              </ReportTableCard>
            </Col>
          </Row>
        )}

        {activeTab === "jobs" && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Job Statistics"
                loading={jobsStats.loading}
              >
                <JobsStatistics {...jobsStats} />
              </ReportTableCard>
            </Col>

            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Job Effectiveness"
                loading={jobsEff.loading}
              >
                <JobsEffectiveness {...jobsEff} />
              </ReportTableCard>
            </Col>
          </Row>
        )}

        {activeTab === "ai" && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Parsing Quality"
                loading={aiParsing.loading}
              >
                <AiParsing {...aiParsing} />
              </ReportTableCard>
            </Col>

            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Scoring Distribution"
                loading={aiScoring.loading}
              >
                <AiScoring {...aiScoring} />
              </ReportTableCard>
            </Col>
          </Row>
        )}

        {activeTab === "subscriptions" && (
          <ReportTableCard title="Revenue & Plans" loading={subs.loading}>
            <SubscriptionsReport {...subs} />
          </ReportTableCard>
        )}
      </div>
    </ReportPage>
  );
}
