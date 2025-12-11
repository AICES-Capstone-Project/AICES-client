import React, { useEffect, useState } from "react";
import {
  Card, Row, Col, Statistic, Spin, message
} from "antd";
import {
  UserOutlined,
  FileProtectOutlined,
  
  UploadOutlined,
  FormOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";

import dashboardService from "../../../services/dashboardService";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    campaigns: 0,
    jobs: 0,
    cvSubmitted: 0,
    cvHired: 0,
    totalCandidates: 0,
  });

  const [kpiJob, setKpiJob] = useState({
    successOnTime: 0,
    failed: 0,
  });

  const [kpiCampaign, setKpiCampaign] = useState({
    successOnTime: 0,
    failed: 0,
  });

  const COLORS = ["#00C49F", "#FF8042"];

  const fetchData = async () => {
    try {
      setLoading(true);

      const [summary, kpiJobRes, kpiCampaignRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getKpiJob(),
        dashboardService.getKpiCampaign(),
      ]);

      setStats({
        campaigns: summary.campaigns,
        jobs: summary.jobs,
        cvSubmitted: summary.cvSubmitted,
        cvHired: summary.cvHired,
        totalCandidates: summary.totalCandidates,
      });

      setKpiJob(kpiJobRes);
      setKpiCampaign(kpiCampaignRes);

    } catch (err) {
      message.error("Cannot load dashboard");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      title={<span style={{ fontWeight: 600 }}>Dashboard Overview</span>}
      style={{ maxWidth: 1300, margin: "20px auto", borderRadius: 12 }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* ======================== SUMMARY ======================== */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Campaigns"
                  value={stats.campaigns}
                  prefix={<FormOutlined />}
                  valueStyle={{ color: "#4096ff" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Jobs"
                  value={stats.jobs}
                  prefix={<FileProtectOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="CV Submitted"
                  value={stats.cvSubmitted}
                  prefix={<UploadOutlined />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="CV Hired"
                  value={stats.cvHired}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Total Candidates"
                  value={stats.totalCandidates}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>

          {/* ======================== KPI CHARTS ======================== */}
          <Row gutter={[24, 24]}>
            {/* KPI JOB */}
            <Col xs={24} lg={12}>
              <Card size="small" title="KPI – Job Completion Rate">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Success On Time", value: kpiJob.successOnTime },
                        { name: "Failed / Late", value: kpiJob.failed },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      <Cell fill={COLORS[0]} />
                      <Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* KPI CAMPAIGN */}
            <Col xs={24} lg={12}>
              <Card size="small" title="KPI – Campaign Completion Rate">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Success On Time", value: kpiCampaign.successOnTime },
                        { name: "Failed / Late", value: kpiCampaign.failed },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      <Cell fill={COLORS[0]} />
                      <Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default Dashboard;
