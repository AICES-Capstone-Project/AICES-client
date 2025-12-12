import React, { useEffect, useState } from "react";
import { Card, Col, Divider, Row, Space, Typography, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { systemDashboardService } from "../../../services/systemDashboardService";

// ===== Types =====
import type {
  SystemOverviewData,
  SystemCompaniesStatsData,
  SystemCompanySubscriptionsData,
  SystemTopCompanyItem,
  SystemRevenueData,
  SystemUsersData,
  SystemJobsData,
  SystemResumesData,
  SystemSubscriptionPlanItem,
  SystemResumeEffectivenessData,
} from "../../../types/system-dashboard.types";

// ===== Components =====
import OverviewSummary from "./components/OverviewSummary";
import CompaniesSummary from "./components/CompaniesSummary";
import CompanySubscriptionsSummary from "./components/CompanySubscriptionsSummary";
import TopCompaniesSection from "./components/TopCompaniesSection";
import RevenueChart from "./components/RevenueChart";
import UsersChart from "./components/UsersChart";
import JobsChart from "./components/JobsChart";
import ResumesChart from "./components/ResumesChart";
import SubscriptionPlansUsage from "./components/SubscriptionPlansUsage";
import ResumeEffectivenessSummary from "./components/ResumeEffectivenessSummary";

const { Title, Text } = Typography;

// ===== UI styles (layout only, no logic) =====
const pageStyles: React.CSSProperties = {
  padding: 16,
};

const headerStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const sectionCardStyles: React.CSSProperties = {
  borderRadius: 16,
  boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
};

const sectionHeadStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 12,
};

/** ✅ equal-height helpers for 2-column grids */
const gridColStyles: React.CSSProperties = {
  display: "flex",
};

const gridCardStyles: React.CSSProperties = {
  ...sectionCardStyles,
  width: "100%",
  height: "100%",
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // ===== States cho từng API =====
  const [overview, setOverview] = useState<SystemOverviewData>();
  const [companies, setCompanies] = useState<SystemCompaniesStatsData>();
  const [companySubscriptions, setCompanySubscriptions] =
    useState<SystemCompanySubscriptionsData>();
  const [topCompanies, setTopCompanies] = useState<SystemTopCompanyItem[]>([]);
  const [revenue, setRevenue] = useState<SystemRevenueData>();
  const [users, setUsers] = useState<SystemUsersData>();
  const [jobs, setJobs] = useState<SystemJobsData>();
  const [resumes, setResumes] = useState<SystemResumesData>();
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SystemSubscriptionPlanItem[]
  >([]);
  const [resumeEffectiveness, setResumeEffectiveness] =
    useState<SystemResumeEffectivenessData>();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        overviewRes,
        companiesRes,
        companySubsRes,
        topCompaniesRes,
        revenueRes,
        usersRes,
        jobsRes,
        resumesRes,
        plansRes,
        resumeEffectivenessRes,
      ] = await Promise.all([
        systemDashboardService.getOverview(),
        systemDashboardService.getCompanies(),
        systemDashboardService.getCompanySubscriptions(),
        systemDashboardService.getTopCompanies(),
        systemDashboardService.getRevenue(),
        systemDashboardService.getUsers(),
        systemDashboardService.getJobs(),
        systemDashboardService.getResumes(),
        systemDashboardService.getSubscriptionPlans(),
        systemDashboardService.getResumeEffectiveness(),
      ]);

      setOverview(overviewRes.data ?? undefined);
      setCompanies(companiesRes.data ?? undefined);
      setCompanySubscriptions(companySubsRes.data ?? undefined);
      setTopCompanies(topCompaniesRes.data ?? []);
      setRevenue(revenueRes.data ?? undefined);
      setUsers(usersRes.data ?? undefined);
      setJobs(jobsRes.data ?? undefined);
      setResumes(resumesRes.data ?? undefined);
      setSubscriptionPlans(plansRes.data ?? []);
      setResumeEffectiveness(resumeEffectivenessRes.data ?? undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={pageStyles}>
      {/* ===== Header ===== */}
      <div style={headerStyles}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            System Dashboard
          </Title>
        </div>

        <Button
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={fetchDashboardData}
        >
          Refresh
        </Button>
      </div>

      <Divider style={{ margin: "12px 0 16px" }} />

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* ===== 1) KPI / Overview ===== */}
        <OverviewSummary data={overview} />

        {/* ===== 2) Companies section ===== */}
        <Card bordered={false} style={sectionCardStyles}>
          <div style={sectionHeadStyles}>
            <Title level={5} style={{ margin: 0 }}>
              Companies
            </Title>
            <Text type="secondary">Status & growth</Text>
          </div>
          <CompaniesSummary data={companies} />
        </Card>

        {/* ===== 3) Subscriptions section ===== */}
        <Card bordered={false} style={sectionCardStyles}>
          <div style={sectionHeadStyles}>
            <Title level={5} style={{ margin: 0 }}>
              Company Subscriptions
            </Title>
            <Text type="secondary">Active, expired & new</Text>
          </div>
          <CompanySubscriptionsSummary data={companySubscriptions} />
        </Card>

        {/* ===== 4-7) Charts grid ===== */}
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={12} style={gridColStyles}>
            <Card bordered={false} style={gridCardStyles}>
              <div style={sectionHeadStyles}>
                <Title level={5} style={{ margin: 0 }}>
                  Revenue Overview
                </Title>
                <Text type="secondary">Monthly trend</Text>
              </div>
              <RevenueChart data={revenue} />
            </Card>
          </Col>

          <Col xs={24} lg={12} style={gridColStyles}>
            <Card bordered={false} style={gridCardStyles}>
              <div style={sectionHeadStyles}>
                <Title level={5} style={{ margin: 0 }}>
                  Users Overview
                </Title>
                <Text type="secondary">Growth & activity</Text>
              </div>
              <UsersChart data={users} />
            </Card>
          </Col>

          {/* ✅ Jobs & Resumes: same height */}
          <Col xs={24} lg={12} style={gridColStyles}>
            <Card bordered={false} style={gridCardStyles}>
              <div style={sectionHeadStyles}>
                <Title level={5} style={{ margin: 0 }}>
                  Jobs Overview
                </Title>
                <Text type="secondary">Posted jobs trend</Text>
              </div>
              <JobsChart data={jobs} />
            </Card>
          </Col>

          <Col xs={24} lg={12} style={gridColStyles}>
            <Card bordered={false} style={gridCardStyles}>
              <div style={sectionHeadStyles}>
                <Title level={5} style={{ margin: 0 }}>
                  Resumes Overview
                </Title>
                <Text type="secondary">Submission trend</Text>
              </div>
              <ResumesChart data={resumes} />
            </Card>
          </Col>
        </Row>

        {/* ===== 8-10) Bottom grid ===== */}
        <Row gutter={[16, 16]} align="stretch">
          {/* ✅ Resume Effectiveness & Plans: same height */}
          <Col xs={24} lg={12} style={gridColStyles}>
            <Card bordered={false} style={gridCardStyles}>
              <div style={sectionHeadStyles}>
                <Title level={5} style={{ margin: 0 }}>
                  Resume Effectiveness
                </Title>
                <Text type="secondary">Score & performance</Text>
              </div>
              <ResumeEffectivenessSummary data={resumeEffectiveness} />
            </Card>
          </Col>

          <Col xs={24} lg={12} style={gridColStyles}>
            <Card bordered={false} style={gridCardStyles}>
              <div style={sectionHeadStyles}>
                <Title level={5} style={{ margin: 0 }}>
                  Subscription Plans Usage
                </Title>
                <Text type="secondary">Distribution by plan</Text>
              </div>
              <SubscriptionPlansUsage data={subscriptionPlans} />
            </Card>
          </Col>

          <Col xs={24}>
            <Card bordered={false} style={sectionCardStyles}>
              <div style={sectionHeadStyles}>
                <Title level={5} style={{ margin: 0 }}>
                  Top Companies
                </Title>
                <Text type="secondary">By jobs & resumes</Text>
              </div>
              <TopCompaniesSection data={topCompanies} />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Dashboard;
