import React from "react";
import { Divider, Row, Col, Alert, Tabs, message } from "antd";

import {
  systemReportExportService,
  type ReportSection,
  type ReportExportFormat,
} from "../../../services/systemReportExportService";
import { systemReportService } from "../../../services/systemReportService";

import { ReportPage } from "./components";
import ReportTableCard from "./components/ReportTableCard";

import type {
  SystemExecutiveSummary,
  SystemCompaniesOverviewReport,
  SystemCompaniesUsageReport,
  SystemJobsStatisticsReport,
  SystemJobsEffectivenessReport,
  SystemAiParsingReport,
  SystemAiScoringReport,
  SystemSubscriptionsReport,
} from "../../../types/systemReport.types";

import ExecutiveSummary from "./ExecutiveSummary/ExecutiveSummary";
import CompaniesOverview from "./Companies/Overview/CompaniesOverview";
import CompaniesUsage from "./Companies/Usage/CompaniesUsage";
import JobsStatistics from "./Jobs/Statistics/JobsStatistics";
import JobsEffectiveness from "./Jobs/Effectiveness/JobsEffectiveness";
import AiParsing from "./AI/Parsing/AiParsing";
import AiScoring from "./AI/Scoring/AiScoring";
import SubscriptionsReport from "./Subscriptions/SubscriptionsReport";

/* ================= TYPES ================= */

type ReportTabKey = "overview" | "companies" | "jobs" | "ai" | "subscriptions";

type ReportState<T> = {
  loading: boolean;
  data?: T;
  error?: string;
};

/* ================= COMPONENT ================= */

export default function ReportsOverview() {
  const [activeTab, setActiveTab] = React.useState<ReportTabKey>("overview");
  const [loadingAll, setLoadingAll] = React.useState(false);

  /** exporting per section */
  const [exportingMap, setExportingMap] = React.useState<
    Partial<Record<ReportSection, boolean>>
  >({});

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

  /* ================= EXPORT ================= */

  const exportSection = React.useCallback(
    async (section: ReportSection, format: ReportExportFormat) => {
      try {
        setExportingMap((m) => ({ ...m, [section]: true }));

        const blob = await systemReportExportService.exportReport(
          section,
          format
        );

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err: any) {
        console.error(err);
        message.error(err?.message || "Export failed");
      } finally {
        setExportingMap((m) => ({ ...m, [section]: false }));
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

    const tasks = await Promise.allSettled([
      systemReportService.getExecutiveSummary(),
      systemReportService.getCompanyOverview(),
      systemReportService.getCompanyUsage(),
      systemReportService.getJobStatistics(),
      systemReportService.getJobEffectiveness(),
      systemReportService.getAiParsingQuality(),
      systemReportService.getAiScoringDistribution(),
      systemReportService.getSubscriptionRevenue(),
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
    subs.error;

  /* ================= UI ================= */

  return (
    <ReportPage>
      {/* ===== STICKY TABS ===== */}
      <div className="report-tabs-sticky">
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as ReportTabKey)}
          animated
          items={[
            { key: "overview", label: "Overview", disabled: loadingAll },
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
          <ReportTableCard
            title="Executive Summary"
            section="executive-summary"
            loading={exec.loading}
            exporting={exportingMap["executive-summary"]}
            onExport={exportSection}
          >
            <ExecutiveSummary {...exec} />
          </ReportTableCard>
        )}

        {activeTab === "companies" && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Company Overview"
                section="companies-overview"
                loading={companiesOverview.loading}
                exporting={exportingMap["companies-overview"]}
                onExport={exportSection}
              >
                <CompaniesOverview {...companiesOverview} />
              </ReportTableCard>
            </Col>

            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Company Usage"
                section="companies-usage"
                loading={companiesUsage.loading}
                exporting={exportingMap["companies-usage"]}
                onExport={exportSection}
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
                section="jobs-statistics"
                loading={jobsStats.loading}
                exporting={exportingMap["jobs-statistics"]}
                onExport={exportSection}
              >
                <JobsStatistics {...jobsStats} />
              </ReportTableCard>
            </Col>

            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Job Effectiveness"
                section="jobs-effectiveness"
                loading={jobsEff.loading}
                exporting={exportingMap["jobs-effectiveness"]}
                onExport={exportSection}
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
                section="ai-parsing"
                loading={aiParsing.loading}
                exporting={exportingMap["ai-parsing"]}
                onExport={exportSection}
              >
                <AiParsing {...aiParsing} />
              </ReportTableCard>
            </Col>

            <Col xs={24} lg={12}>
              <ReportTableCard
                title="Scoring Distribution"
                section="ai-scoring"
                loading={aiScoring.loading}
                exporting={exportingMap["ai-scoring"]}
                onExport={exportSection}
              >
                <AiScoring {...aiScoring} />
              </ReportTableCard>
            </Col>
          </Row>
        )}

        {activeTab === "subscriptions" && (
          <ReportTableCard
            title="Revenue & Plans"
            section="subscriptions"
            loading={subs.loading}
            exporting={exportingMap["subscriptions"]}
            onExport={exportSection}
          >
            <SubscriptionsReport {...subs} />
          </ReportTableCard>
        )}
      </div>
    </ReportPage>
  );
}
