import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, message, Button, Table } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Megaphone, Briefcase, UploadCloud, Trophy, Calendar } from "lucide-react";
import { useAppSelector } from "../../../hooks/redux";
import dashboardService from "../../../services/dashboardService";

const BRAND_GREEN = "#00a67d";
const BRAND_YELLOW = "#FFD24D";
const COLORS = [BRAND_GREEN, BRAND_YELLOW, "#1890ff", "#f5222d", "#722ed1"];
const BRAND = BRAND_GREEN;

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 8,
  transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const displayName = user?.fullName ?? "User";
  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };
  const [timeGreeting, setTimeGreeting] = useState<string>(getTimeGreeting());
  useEffect(() => {
    const id = setInterval(() => setTimeGreeting(getTimeGreeting()), 60000);
    return () => clearInterval(id);
  }, []);

  const [stats, setStats] = useState({ campaigns: 0, jobs: 0, cvSubmitted: 0, cvHired: 0, totalCandidates: 0, interviewsToday: 0 });
  const [kpiJob, setKpiJob] = useState({ successOnTime: 0, failed: 0 });
  const [kpiCampaign, setKpiCampaign] = useState({ successOnTime: 0, failed: 0 });
  const [funnel, setFunnel] = useState<Array<{ stage: string; value: number }>>([]);
  const [topCandidates, setTopCandidates] = useState<Array<any>>([]);
  const [rejectionReasons, setRejectionReasons] = useState<Array<{ name: string; value: number }>>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [summary, jobKpi, campaignKpi, topTalent] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getKpiJob(),
          dashboardService.getKpiCampaign(),
          // @ts-ignore optional helper
          dashboardService.getTopRatedCandidates?.(3),
        ]);

        setStats({
          campaigns: summary?.campaigns ?? 0,
          jobs: summary?.jobs ?? 0,
          cvSubmitted: summary?.cvSubmitted ?? 0,
          cvHired: summary?.cvHired ?? 0,
          totalCandidates: summary?.totalCandidates ?? 0,
          interviewsToday: summary?.interviewsToday ?? 0,
        });

        setKpiJob(jobKpi ?? { successOnTime: 0, failed: 0 });
        setKpiCampaign(campaignKpi ?? { successOnTime: 0, failed: 0 });

        setFunnel([
          { stage: "Total CVs", value: summary?.totalCandidates ?? 0 },
          { stage: "AI Screened", value: Math.round((summary?.totalCandidates ?? 0) * 0.6) },
          { stage: "Interviewing", value: Math.round((summary?.totalCandidates ?? 0) * 0.12) },
          { stage: "Hired", value: summary?.cvHired ?? 0 },
        ]);

        setTopCandidates((topTalent && Array.isArray(topTalent) && topTalent.length) ? topTalent : []);
        setRejectionReasons([{ name: "Skills", value: 0 }, { name: "Salary", value: 0 }, { name: "Attitude", value: 0 }]);
      } catch (e) {
        message.error("Cannot load dashboard");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <Card
      title={
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 13, color: "#8c8c8c", marginRight: 6 }}>Hello</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{displayName}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND, marginLeft: 8 }}>{timeGreeting}</div>
          </div>
          <div style={{ fontWeight: 600 }}>Dashboard Overview</div>
        </div>
      }
      style={{ maxWidth: 1200, margin: "12px auto", padding: "8px", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", minHeight: 480 }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={24} sm={12} md={8} lg={4} xl={4}>
              <Card
                size="small"
                hoverable
                style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c1" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                onMouseEnter={() => setHoveredCard("c1")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Statistic title="Campaigns" value={stats.campaigns} prefix={<Megaphone color={BRAND} size={18} />} valueStyle={{ color: BRAND }} />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={4} xl={4}>
              <Card size="small" hoverable style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c2" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }} onMouseEnter={() => setHoveredCard("c2")} onMouseLeave={() => setHoveredCard(null)}>
                <Statistic title="Jobs" value={stats.jobs} prefix={<Briefcase color={BRAND} size={18} />} valueStyle={{ color: BRAND_GREEN }} />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={4} xl={4}>
              <Card size="small" hoverable style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c3" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }} onMouseEnter={() => setHoveredCard("c3")} onMouseLeave={() => setHoveredCard(null)}>
                <Statistic title="CV Submitted" value={stats.cvSubmitted} prefix={<UploadCloud color={BRAND} size={18} />} valueStyle={{ color: BRAND_YELLOW }} />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={4} xl={4}>
              <Card size="small" hoverable style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c4" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }} onMouseEnter={() => setHoveredCard("c4")} onMouseLeave={() => setHoveredCard(null)}>
                <Statistic title="CV Hired" value={stats.cvHired} prefix={<Trophy color={BRAND} size={18} />} valueStyle={{ color: BRAND_GREEN }} />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Card size="small" hoverable style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c5" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }} onMouseEnter={() => setHoveredCard("c5")} onMouseLeave={() => setHoveredCard(null)}>
                <Statistic title="Interviews Today" value={stats.interviewsToday} prefix={<Calendar color={BRAND} size={18} />} valueStyle={{ color: BRAND }} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[12, 12]}>
            <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
              <Card size="small" title="KPI – Job Completion Rate" style={{ ...cardBaseStyle }}>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{ name: "Success On Time", value: kpiJob.successOnTime }, { name: "Failed / Late", value: kpiJob.failed }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                        <Cell fill={BRAND} />
                        <Cell fill={COLORS[1]} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
              <Card size="small" title="KPI – Campaign Completion Rate" style={{ ...cardBaseStyle }}>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{ name: "Success On Time", value: kpiCampaign.successOnTime }, { name: "Failed / Late", value: kpiCampaign.failed }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                        <Cell fill={BRAND} />
                        <Cell fill={COLORS[1]} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
            <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
              <Card size="small" title="Recruitment Funnel" style={{ ...cardBaseStyle }}>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={funnel} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="value" fill={BRAND} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
              <Row gutter={[12, 12]}>
                <Col xs={24} lg={24}>
                  <Card size="small" title="Top Talent Quick View" style={{ ...cardBaseStyle }}>
                    <Table
                      pagination={false}
                      dataSource={topCandidates.slice(0, 3).map((t: any, idx: number) => ({ key: t.id ?? idx, name: t.fullName ?? t.name ?? '-', score: t.aiScore ?? t.score ?? 0, job: t.jobTitle ?? '-' }))}
                      columns={[
                        { title: 'Name', dataIndex: 'name', key: 'name' },
                        { title: 'AI Score', dataIndex: 'score', key: 'score', render: (v: any) => <span style={{ color: Number(v) > 80 ? BRAND : undefined }}>{v}</span> },
                        { title: 'Job', dataIndex: 'job', key: 'job' },
                        { title: 'Action', key: 'action', render: () => <Button size="small" type="link">View</Button> },
                      ]}
                      onRow={(record) => ({
                        onMouseEnter: () => setHoveredRow(record.key),
                        onMouseLeave: () => setHoveredRow(null),
                      })}
                      rowClassName={(record) => (hoveredRow === record.key ? 'ant-table-row-hover' : '')}
                      size="small"
                    />
                  </Card>
                </Col>

                <Col xs={24} lg={24}>
                  <Card size="small" title="Rejection Analytics" style={{ ...cardBaseStyle, marginTop: 8 }}>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={rejectionReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {rejectionReasons.map((_, idx) => (
                              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default Dashboard;
