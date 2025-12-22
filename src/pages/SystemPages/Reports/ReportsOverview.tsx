// src/pages/SystemPages/Reports/ReportsOverview.tsx
import React from "react";
import { Typography, Divider, Row, Col, Alert } from "antd";

import { systemReportService } from "../../../services/systemReportService";
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

import { ReportHeader, ReportPage } from "./components";

const { Title } = Typography;

type ReportState<T> = {
  loading: boolean;
  data?: T;
  error?: string;
};

export default function ReportsOverview() {
  const [loadingAll, setLoadingAll] = React.useState(false);

  const [exec, setExec] = React.useState<ReportState<SystemExecutiveSummary>>({
    loading: true,
  });
  const [companiesOverview, setCompaniesOverview] =
    React.useState<ReportState<SystemCompaniesOverviewReport>>({ loading: true });
  const [companiesUsage, setCompaniesUsage] =
    React.useState<ReportState<SystemCompaniesUsageReport>>({ loading: true });

  const [jobsStats, setJobsStats] =
    React.useState<ReportState<SystemJobsStatisticsReport>>({ loading: true });
  const [jobsEff, setJobsEff] =
    React.useState<ReportState<SystemJobsEffectivenessReport>>({ loading: true });

  const [aiParsing, setAiParsing] =
    React.useState<ReportState<SystemAiParsingReport>>({ loading: true });
  const [aiScoring, setAiScoring] =
    React.useState<ReportState<SystemAiScoringReport>>({ loading: true });

  const [subs, setSubs] = React.useState<ReportState<SystemSubscriptionsReport>>({
    loading: true,
  });

  const pickErr = (e: any) =>
    e?.response?.data?.message || e?.message || "Failed to load data";

  const loadAll = React.useCallback(async () => {
    setLoadingAll(true);

    // reset loading + clear errors
    setExec((s) => ({ ...s, loading: true, error: undefined }));
    setCompaniesOverview((s) => ({ ...s, loading: true, error: undefined }));
    setCompaniesUsage((s) => ({ ...s, loading: true, error: undefined }));
    setJobsStats((s) => ({ ...s, loading: true, error: undefined }));
    setJobsEff((s) => ({ ...s, loading: true, error: undefined }));
    setAiParsing((s) => ({ ...s, loading: true, error: undefined }));
    setAiScoring((s) => ({ ...s, loading: true, error: undefined }));
    setSubs((s) => ({ ...s, loading: true, error: undefined }));

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

    if (tasks[0].status === "fulfilled") setExec({ loading: false, data: tasks[0].value });
    else setExec({ loading: false, error: pickErr(tasks[0].reason) });

    if (tasks[1].status === "fulfilled")
      setCompaniesOverview({ loading: false, data: tasks[1].value });
    else setCompaniesOverview({ loading: false, error: pickErr(tasks[1].reason) });

    if (tasks[2].status === "fulfilled")
      setCompaniesUsage({ loading: false, data: tasks[2].value });
    else setCompaniesUsage({ loading: false, error: pickErr(tasks[2].reason) });

    if (tasks[3].status === "fulfilled") setJobsStats({ loading: false, data: tasks[3].value });
    else setJobsStats({ loading: false, error: pickErr(tasks[3].reason) });

    if (tasks[4].status === "fulfilled") setJobsEff({ loading: false, data: tasks[4].value });
    else setJobsEff({ loading: false, error: pickErr(tasks[4].reason) });

    if (tasks[5].status === "fulfilled") setAiParsing({ loading: false, data: tasks[5].value });
    else setAiParsing({ loading: false, error: pickErr(tasks[5].reason) });

    if (tasks[6].status === "fulfilled") setAiScoring({ loading: false, data: tasks[6].value });
    else setAiScoring({ loading: false, error: pickErr(tasks[6].reason) });

    if (tasks[7].status === "fulfilled") setSubs({ loading: false, data: tasks[7].value });
    else setSubs({ loading: false, error: pickErr(tasks[7].reason) });

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

  return (
    <ReportPage>
      <ReportHeader
        title="System Reports"
        subtitle="Executive summary & operational insights"
        loading={loadingAll}
        onRefresh={loadAll}
      />

      <Divider />

      {anyError && (
        <Alert
          type="info"
          showIcon
          message="Some sections may be incomplete"
          description="One or more report endpoints failed. You can still view other sections or hit Refresh to retry."
          style={{ marginBottom: 16 }}
        />
      )}

      {/* ===== Executive Summary ===== */}
      <Title level={4} style={{ marginTop: 0 }}>
        Executive Summary
      </Title>
      <ExecutiveSummary loading={exec.loading} data={exec.data} error={exec.error} />

      <Divider />

      {/* ===== Companies ===== */}
      <Title level={4} style={{ marginTop: 0 }}>
        Companies
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <CompaniesOverview
            loading={companiesOverview.loading}
            data={companiesOverview.data}
            error={companiesOverview.error}
          />
        </Col>
        <Col xs={24} lg={12}>
          <CompaniesUsage
            loading={companiesUsage.loading}
            data={companiesUsage.data}
            error={companiesUsage.error}
          />
        </Col>
      </Row>

      <Divider />

      {/* ===== Jobs ===== */}
      <Title level={4} style={{ marginTop: 0 }}>
        Jobs
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <JobsStatistics loading={jobsStats.loading} data={jobsStats.data} error={jobsStats.error} />
        </Col>
        <Col xs={24} lg={10}>
          <JobsEffectiveness
            loading={jobsEff.loading}
            data={jobsEff.data}
            error={jobsEff.error}
          />
        </Col>
      </Row>

      <Divider />

      {/* ===== AI ===== */}
      <Title level={4} style={{ marginTop: 0 }}>
        AI
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <AiParsing loading={aiParsing.loading} data={aiParsing.data} error={aiParsing.error} />
        </Col>
        <Col xs={24} lg={12}>
          <AiScoring loading={aiScoring.loading} data={aiScoring.data} error={aiScoring.error} />
        </Col>
      </Row>

      <Divider />

      {/* ===== Subscriptions ===== */}
      <Title level={4} style={{ marginTop: 0 }}>
        Subscriptions
      </Title>

      <SubscriptionsReport loading={subs.loading} data={subs.data} error={subs.error} />
    </ReportPage>
  );
}
