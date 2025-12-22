import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, message, Button, Table, Input, DatePicker, Space, Select, Progress } from "antd";
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
  LineChart,
  Line,
} from "recharts";
import { Megaphone, Briefcase, UploadCloud, Trophy, Clock } from "lucide-react";
import { useAppSelector } from "../../../hooks/redux";
import dashboardService from "../../../services/dashboardService";
import { campaignService } from "../../../services/campaignService";

const BRAND_GREEN = "#00a67d";
const BRAND = BRAND_GREEN;

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7', '#f0fdf4'];

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 8,
  transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const displayName = user?.fullName ?? "User";
  
  // Get first name only
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || 'User';
  };
  
  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get time-based emoji
  const getTimeEmoji = () => {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return "☀️";
    if (h >= 12 && h < 18) return "🌤️";
    if (h >= 18 && h < 22) return "🌆";
    return "🌙";
  };
  const [timeGreeting, setTimeGreeting] = useState<string>(getTimeGreeting());
  useEffect(() => {
    const id = setInterval(() => setTimeGreeting(getTimeGreeting()), 60000);
    return () => clearInterval(id);
  }, []);

  const applyFunnelParams = async () => {
    try {
      setFunnelLoading(true);
      const params: any = {};
      if (jobIdParam) params.jobId = Number(jobIdParam);
      if (campaignIdParam) params.campaignId = Number(campaignIdParam);
      if (dateRange && Array.isArray(dateRange) && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].toISOString();
        params.endDate = dateRange[1].toISOString();
      }
      const pipeline = await dashboardService.getPipelineFunnel?.(params);
      const apiStages = (pipeline && (pipeline.stages || pipeline.data?.stages)) ?? null;
      if (Array.isArray(apiStages) && apiStages.length > 0) {
        setFunnel(apiStages.map((s: any) => ({ stage: s.name ?? s.stage ?? 'Unknown', value: Number(s.count ?? 0), conversionRate: Number(s.conversionRate ?? 0) })) as any);
      } else {
        message.info('No funnel data for the provided parameters');
        setFunnel([]);
      }
    } catch (err) {
      console.error('applyFunnelParams error', err);
      message.error('Failed to load funnel data');
    } finally {
      setFunnelLoading(false);
    }
  };

  const [stats, setStats] = useState({ totalMembers: 0, activeJobs: 0, aiProcessed: 0, creditsRemaining: 0 });
  const [funnel, setFunnel] = useState<Array<{ stage: string; value: number }>>([]);
  const [funnelLoading, setFunnelLoading] = useState(false);
  const [jobIdParam, setJobIdParam] = useState<string | undefined>(undefined);
  const [campaignIdParam, setCampaignIdParam] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<any | null>(null);
  const [usageHistory, setUsageHistory] = useState<any>(null);
  const [usageRange, setUsageRange] = useState<string>("month");
  const [usageLoading, setUsageLoading] = useState(false);
  const [statsOverview, setStatsOverview] = useState<any>(null);
  const [topCategorySpec, setTopCategorySpec] = useState<any[]>([]);
  const [topCount, setTopCount] = useState<number>(10);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<number>(0);
  const [campaignsList, setCampaignsList] = useState<any[]>([]);
  const [filteredJobsList, setFilteredJobsList] = useState<any[]>([]);

  useEffect(() => {
    const calculateTimeUntilNextHour = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      return Math.floor((nextHour.getTime() - now.getTime()) / 1000);
    };

    setTimeUntilRefresh(calculateTimeUntilNextHour());

    const interval = setInterval(() => {
      const remainingTime = calculateTimeUntilNextHour();
      setTimeUntilRefresh(remainingTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchTopCategorySpec = async () => {
    try {
      const topCatData = await dashboardService.getTopCategorySpec(topCount);
      if (topCatData?.status === 'Success' && topCatData?.data) {
        const data = topCatData.data.data || topCatData.data || [];
        setTopCategorySpec(Array.isArray(data) ? data : []);
      } else {
        setTopCategorySpec(Array.isArray(topCatData) ? topCatData : []);
      }
    } catch (err) {
      console.error('Failed to load top category spec', err);
      setTopCategorySpec([]);
    }
  };

  const fetchJobsAndCampaigns = async () => {
    try {
      const campaignsResp = await campaignService.getCampaigns();
      
      // Handle different response structures
      let campaignsData = [];
      if (campaignsResp?.data?.campaigns) {
        campaignsData = campaignsResp.data.campaigns;
      } else if (campaignsResp?.data && Array.isArray(campaignsResp.data)) {
        campaignsData = campaignsResp.data;
      } else if (Array.isArray(campaignsResp)) {
        campaignsData = campaignsResp;
      }
      
      const formattedCampaigns = campaignsData.map((campaign: any) => ({
        value: campaign.campaignId || campaign.id,
        label: campaign.title || campaign.name || `Campaign ${campaign.campaignId || campaign.id}`
      }));
      
      setCampaignsList(formattedCampaigns);
    } catch (err) {
      console.error('Failed to load campaigns', err);
      message.error('Failed to load campaigns');
    }
  };

  const handleCampaignChange = async (campaignId: string | undefined) => {
    setCampaignIdParam(campaignId);
    setJobIdParam(undefined);
    
    if (campaignId) {
      try {
        const jobsResp = await campaignService.getCampaignJobs(Number(campaignId));
        
        // Handle different response structures
        let jobsData: any[] = [];
        if (jobsResp?.data?.jobs) {
          jobsData = jobsResp.data.jobs;
        } else if (jobsResp?.data) {
          jobsData = Array.isArray(jobsResp.data) ? jobsResp.data : [jobsResp.data];
        } else if (Array.isArray(jobsResp)) {
          jobsData = jobsResp;
        }
        
        const formattedJobs = jobsData.map((job: any) => ({
          value: job.id || job.jobId,
          label: job.title || job.jobTitle || `Job ${job.id || job.jobId}`
        }));
        
        setFilteredJobsList(formattedJobs);
      } catch (err) {
        console.error('Failed to load campaign jobs', err);
        message.error('Failed to load jobs for selected campaign');
        setFilteredJobsList([]);
      }
    } else {
      setFilteredJobsList([]);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [summary]: [any] = await Promise.all([
          dashboardService.getSummary(),
        ]);

        if (summary) {
          setStats({
            totalMembers: summary.totalMembers ?? 0,
            activeJobs: summary.activeJobs ?? 0,
            aiProcessed: summary.aiProcessed ?? 0,
            creditsRemaining: summary.creditsRemaining ?? 0,
          });
        }

        const fetchDefaultPipeline = async () => {
          try {
            setFunnelLoading(true);
            const pipeline = await dashboardService.getPipelineFunnel?.();
            const apiStages = (pipeline && (pipeline.stages || pipeline.data?.stages)) ?? null;
            if (Array.isArray(apiStages) && apiStages.length > 0) {
              setFunnel(apiStages.map((s: any) => ({ stage: s.name ?? s.stage ?? 'Unknown', value: Number(s.count ?? 0), conversionRate: Number(s.conversionRate ?? 0) })) as any);
            } else {
              const totalCandidates = summary?.totalCandidates ?? 0;
              const cvHired = summary?.cvHired ?? 0;
              setFunnel([
                { stage: "Total Members", value: totalCandidates, conversionRate: 100 },
                { stage: "Active Jobs", value: Math.round(totalCandidates * 0.6), conversionRate: Math.round(60 * 100) / 100 },
                { stage: "AI Processed", value: Math.round(totalCandidates * 0.12), conversionRate: Math.round(12 * 100) / 100 },
                { stage: "Credits Remaining", value: cvHired, conversionRate: Math.round((cvHired / Math.max(1, totalCandidates)) * 100 * 100) / 100 },
              ] as any);
            }
          } catch (e) {
            console.error('Failed to fetch pipeline funnel', e);
          } finally {
            setFunnelLoading(false);
          }
        };

        await fetchDefaultPipeline();

        try {
          setUsageLoading(true);
          const usageData = await dashboardService.getSubscriptionUsageHistory(usageRange);
          setUsageHistory(usageData);
        } catch (err) {
          console.error('Failed to load usage history', err);
          // Set fallback data for testing
          setUsageHistory({
            range: 'month',
            unit: 'day',
            labels: ['Dec 20', 'Dec 21', 'Dec 22'],
            resumeUploads: [10, 15, 8],
            aiComparisons: [5, 12, 3],
            resumeLimit: 100,
            aiComparisonLimit: 50
          });
        } finally {
          setUsageLoading(false);
        }

        try {
          const statsData = await dashboardService.getStatsOverview();
          setStatsOverview(statsData);
        } catch (err) {
          console.error('Failed to load stats overview', err);
        }

        await fetchTopCategorySpec();
        await fetchJobsAndCampaigns();
      } catch (e) {
        message.error("Cannot load dashboard");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    fetchTopCategorySpec();
  }, [topCount]);

  const handleUsageRangeChange = async (newRange: string) => {
    setUsageRange(newRange);
    try {
      setUsageLoading(true);
      const usageData = await dashboardService.getSubscriptionUsageHistory(newRange);
      setUsageHistory(usageData);
    } catch (err) {
      console.error('Failed to load usage history', err);
      message.error('Failed to load usage history');
      setUsageHistory({
        range: newRange,
        unit: 'day',
        labels: ['Sample 1', 'Sample 2', 'Sample 3'],
        resumeUploads: [5, 10, 7],
        aiComparisons: [2, 8, 4],
        resumeLimit: 100,
        aiComparisonLimit: 50
      });
    } finally {
      setUsageLoading(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{getTimeEmoji()}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                color: "#333",
                lineHeight: 1.2
              }}>
                Hello, {getFirstName(displayName)}!
              </div>
              <div style={{ 
                fontSize: 14, 
                color: "#8c8c8c", 
                fontWeight: 400
              }}>
                {timeGreeting} - Welcome back to your dashboard
              </div>
            </div>
          </div>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: "#666",
            marginTop: 8,
            borderTop: "1px solid #f0f0f0",
            paddingTop: 12
          }}>
            Dashboard Overview
          </div>
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
            <Col xs={24} lg={8}>
              <Row gutter={[12, 12]}>
                <Col xs={12} lg={24}>
                  <Card
                    size="small"
                    hoverable
                    style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c1" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                    onMouseEnter={() => setHoveredCard("c1")}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Statistic title="Total Members" value={stats.totalMembers} prefix={<Megaphone color={BRAND_GREEN} size={18} />} valueStyle={{ color: BRAND_GREEN }} />
                  </Card>
                </Col>
                <Col xs={12} lg={24}>
                  <Card
                    size="small"
                    hoverable
                    style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c3" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                    onMouseEnter={() => setHoveredCard("c3")}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Statistic title="AI Processed" value={stats.aiProcessed} prefix={<UploadCloud color={BRAND_GREEN} size={18} />} valueStyle={{ color: BRAND_GREEN }} />
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                size="small"
                hoverable
                style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c2" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                onMouseEnter={() => setHoveredCard("c2")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Statistic title="Active Jobs" value={stats.activeJobs} prefix={<Briefcase color={BRAND_GREEN} size={18} />} valueStyle={{ color: BRAND_GREEN }} />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                size="small"
                hoverable
                style={{
                  ...cardBaseStyle,
                  boxShadow: hoveredCard === "c4" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined,
                  minHeight: 140
                }}
                onMouseEnter={() => setHoveredCard("c4")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Trophy color={BRAND_GREEN} size={18} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Credits Usage</span>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Progress
                      percent={Math.min((stats.creditsRemaining / 100) * 100, 100)}
                      strokeColor={stats.creditsRemaining > 100 ? '#dc2626' : BRAND_GREEN}
                      trailColor="#f0f0f0"
                      size="small"
                      showInfo={false}
                      strokeWidth={8}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 4,
                      fontSize: 11,
                      color: '#666'
                    }}>
                      <span>0</span>
                      <div style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: stats.creditsRemaining > 100 ? '#dc2626' : BRAND_GREEN
                      }}>
                        {stats.creditsRemaining}
                      </div>
                      <span>100+</span>
                    </div>
                  </div>

                  <div style={{
                    fontSize: 11,
                    color: '#666',
                    marginBottom: 8,
                    textAlign: 'center'
                  }}>
                    Hourly Usage Limit: 100
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    fontSize: 10,
                    color: '#999',
                    background: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: 4
                  }}>
                    <Clock size={12} />
                    <span>Tự động hồi 100 credits sau: {formatCountdown(timeUntilRefresh)}</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
            <Col xs={24} style={{ marginBottom: 12 }}>
              <Card size="small" title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📊 Recruitment Funnel</span>
                </div>
              } style={{ ...cardBaseStyle }}>
                <div style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Select
                      placeholder="Select Campaign"
                      value={campaignIdParam}
                      onChange={handleCampaignChange}
                      style={{ borderRadius: 6, width: 200 }}
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={campaignsList.length > 0 ? campaignsList : [{ value: 'no-data', label: 'No campaigns available', disabled: true }]}
                    />
                    <Select
                      placeholder="Select Job"
                      value={jobIdParam}
                      onChange={(value) => setJobIdParam(value)}
                      style={{ borderRadius: 6, width: 200 }}
                      allowClear
                      showSearch
                      disabled={!campaignIdParam}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={filteredJobsList}
                    />
                    <DatePicker.RangePicker
                      value={dateRange}
                      onChange={(vals) => setDateRange(vals)}
                      style={{ borderRadius: 6 }}
                      placeholder={['Start date', 'End date']}
                    />
                    <Button
                      className="company-btn--filled"
                      onClick={applyFunnelParams}
                      loading={funnelLoading}
                      style={{ borderRadius: 6 }}
                    >
                      Apply
                    </Button>
                    <Button
                      className="company-btn"
                      onClick={async () => {
                        setJobIdParam(undefined); setCampaignIdParam(undefined); setDateRange(null);
                        await (async () => {
                          setFunnelLoading(true);
                          try {
                            const p = await dashboardService.getPipelineFunnel?.();
                            const apiStages = (p && (p.stages || p.data?.stages)) ?? null;
                            if (Array.isArray(apiStages)) setFunnel(apiStages.map((s: any) =>
                              ({ stage: s.name ?? s.stage ?? 'Unknown', value: Number(s.count ?? 0), conversionRate: Number(s.conversionRate ?? 0) })));
                            else setFunnel([]);
                          }
                          catch (e) {
                            console.error(e);
                          }
                          finally { setFunnelLoading(false); }
                        })();
                      }}
                      style={{ borderRadius: 6 }}
                    >
                      Reset
                    </Button>
                  </Space>
                </div>

                <div style={{ height: 240, background: '#fafafa', borderRadius: 8, padding: 8 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={funnel} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
                      <XAxis type="number" stroke="#666" domain={[0, 100]} />
                      <YAxis dataKey="stage" type="category" width={100} stroke="#666" />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => {
                          if (name === 'conversionRate') {
                            const count = props.payload.value;
                            return [`${Number(value).toFixed(1)}% (${count} candidates)`, 'Conversion Rate'];
                          }
                          return [value, name];
                        }}
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e1e5e9',
                          borderRadius: 8,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar
                        dataKey="conversionRate"
                        fill="url(#colorGradient)"
                        radius={[0, 4, 4, 0]}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="5%" stopColor={BRAND_GREEN} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={BRAND_GREEN} stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {!funnelLoading && funnel && funnel.length > 0 && (
                  <div style={{ marginTop: 16, background: '#f8f9fa', borderRadius: 8, padding: 12 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: 14 }}>📈 Conversion Rates</h4>
                    <Table
                      size="small"
                      pagination={false}
                      style={{ background: 'transparent' }}
                      dataSource={funnel.map((f, idx) => ({
                        key: idx,
                        stage: f.stage,
                        count: f.value,
                        conversionRate: (f as any).conversionRate
                      }))}
                      columns={[
                        {
                          title: 'Stage',
                          dataIndex: 'stage',
                          key: 'stage',
                          render: (text: string) => <span style={{ fontWeight: 500, color: '#333' }}>{text}</span>
                        },
                        {
                          title: 'Count',
                          dataIndex: 'count',
                          key: 'count',
                          align: 'center' as const,
                          render: (value: number) => <span style={{ fontWeight: 600, color: BRAND_GREEN }}>{value}</span>
                        },
                        {
                          title: 'Conversion %',
                          dataIndex: 'conversionRate',
                          key: 'conversionRate',
                          align: 'center' as const,
                          render: (v: any) => {
                            if (v == null) return <span style={{ color: '#999' }}>-</span>;
                            const rate = Number(v).toFixed(1);
                            const color = Number(v) >= 50 ? '#16a34a' : Number(v) >= 20 ? '#22c55e' : '#dc2626';
                            return <span style={{ fontWeight: 600, color }}>{rate}%</span>;
                          }
                        }
                      ]}
                    />
                  </div>
                )}
                {funnelLoading && (
                  <div style={{
                    textAlign: 'center',
                    padding: 20,
                    background: '#f8f9fa',
                    borderRadius: 8,
                    marginTop: 16
                  }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 8, color: '#666' }}>Loading funnel data...</div>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} style={{ marginBottom: 12 }}>
              <Card size="small" title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📊 Subscription Usage History</span>
                  <Select
                    className="company-select"
                    value={usageRange}
                    onChange={handleUsageRangeChange}
                    style={{ width: 120 }}
                    size="small"
                    options={[
                      { label: 'Hour', value: 'hour' },
                      { label: '1 Day', value: '1d' },
                      { label: '7 Days', value: '7d' },
                      { label: '28 Days', value: '28d' },
                      { label: '90 Days', value: '90d' },
                      { label: 'Month', value: 'month' },
                      { label: 'Year', value: 'year' },
                    ]}
                  />
                </div>
              } style={{ ...cardBaseStyle }}>
                {usageLoading ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 8, color: '#666' }}>Loading usage data...</div>
                  </div>
                ) : usageHistory && (usageHistory.labels?.length > 0 || usageHistory.resumeUploads?.length > 0) ? (
                  <div>
                    <div style={{
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'space-around',
                      flexWrap: 'wrap',
                      gap: 12
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: BRAND_GREEN }}>
                          {usageHistory.resumeUploads?.reduce((a: number, b: number) => a + b, 0) || 0}
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>Resume Uploads</div>
                        <div style={{ fontSize: 10, color: '#999' }}>Limit: {usageHistory.resumeLimit || 0}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4ade80' }}>
                          {usageHistory.aiComparisons?.reduce((a: number, b: number) => a + b, 0) || 0}
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>AI Comparisons</div>
                        <div style={{ fontSize: 10, color: '#999' }}>Limit: {usageHistory.aiComparisonLimit || 0}</div>
                      </div>
                    </div>

                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={usageHistory.labels?.map((label: string, index: number) => ({
                          date: label,
                          resumeUploads: usageHistory.resumeUploads?.[index] || 0,
                          aiComparisons: usageHistory.aiComparisons?.[index] || 0
                        })) || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
                          <XAxis
                            dataKey="date"
                            stroke="#666"
                            tick={{ fontSize: 11 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e1e5e9',
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="resumeUploads"
                            stroke={BRAND_GREEN}
                            strokeWidth={2}
                            name="Resume Uploads"
                            dot={{ fill: BRAND_GREEN, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="aiComparisons"
                            stroke="#4ade80"
                            strokeWidth={2}
                            name="AI Comparisons"
                            dot={{ fill: "#4ade80", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                    No usage data available for the selected range
                  </div>
                )}
              </Card>
            </Col>

            {statsOverview && (
              <>
                <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
                  <Card size="small" title="🏆 Top Jobs in Campaigns" style={{ ...cardBaseStyle }}>
                    <Table
                      pagination={false}
                      dataSource={statsOverview.top5JobsInCampaigns?.slice(0, 5).map((job: any, idx: number) => ({
                        key: job.jobId ?? idx,
                        title: job.title || '-',
                        campaignCount: job.campaignCount || 0
                      })) || []}
                      columns={[
                        { title: 'Job Title', dataIndex: 'title', key: 'title', ellipsis: true },
                        {
                          title: 'Campaigns',
                          dataIndex: 'campaignCount',
                          key: 'campaignCount',
                          align: 'center' as const,
                          render: (value: number) => <span style={{ fontWeight: 600, color: BRAND_GREEN }}>{value}</span>
                        },
                      ]}
                      size="small"
                    />
                  </Card>
                </Col>

                <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
                  <Card size="small" title="📊 Top Campaigns" style={{ ...cardBaseStyle }}>
                    <Table
                      pagination={false}
                      dataSource={statsOverview.top5CampaignsWithMostJobs?.slice(0, 5).map((campaign: any, idx: number) => ({
                        key: campaign.campaignId ?? idx,
                        title: campaign.title || '-',
                        jobCount: campaign.jobCount || 0
                      })) || []}
                      columns={[
                        { title: 'Campaign Title', dataIndex: 'title', key: 'title', ellipsis: true },
                        {
                          title: 'Jobs',
                          dataIndex: 'jobCount',
                          key: 'jobCount',
                          align: 'center' as const,
                          render: (value: number) => <span style={{ fontWeight: 600, color: '#22c55e' }}>{value}</span>
                        },
                      ]}
                      size="small"
                    />
                  </Card>
                </Col>

                <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
                  <Card size="small" title="🎯 Highest Score CVs" style={{ ...cardBaseStyle }}>
                    <Table
                      pagination={false}
                      dataSource={statsOverview.top5HighestScoreCVs?.slice(0, 5).map((cv: any, idx: number) => ({
                        key: cv.applicationId ?? idx,
                        candidateName: cv.candidateName || '-',
                        jobTitle: cv.jobTitle || '-',
                        score: cv.score || 0
                      })) || []}
                      columns={[
                        { title: 'Candidate', dataIndex: 'candidateName', key: 'candidateName', width: '35%', ellipsis: true },
                        { title: 'Job', dataIndex: 'jobTitle', key: 'jobTitle', width: '45%', ellipsis: true },
                        {
                          title: 'Score',
                          dataIndex: 'score',
                          key: 'score',
                          width: '20%',
                          align: 'center' as const,
                          render: (value: number) => {
                            const color = value >= 90 ? '#16a34a' : value >= 80 ? '#22c55e' : value >= 70 ? '#4ade80' : '#dc2626';
                            return <span style={{ fontWeight: 600, color }}>{Number(value).toFixed(1)}</span>;
                          }
                        },
                      ]}
                      size="small"
                    />
                  </Card>
                </Col>

                <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
                  <Card size="small" title="⭐ Active Candidates" style={{ ...cardBaseStyle }}>
                    <div style={{
                      background: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 32, fontWeight: 'bold', color: BRAND_GREEN, marginBottom: 8 }}>
                        {statsOverview.onTimeCampaignsThisMonth || 0}
                      </div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>On-Time Campaigns This Month</div>
                      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#22c55e' }}>
                        {statsOverview.totalJobs || 0}
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>Total Active Jobs</div>
                    </div>
                    <Table
                      pagination={false}
                      dataSource={statsOverview.top5CandidatesWithMostJobs?.slice(0, 4).map((candidate: any, idx: number) => ({
                        key: candidate.candidateId ?? idx,
                        name: candidate.fullName || '-',
                        jobCount: candidate.jobCount || 0
                      })) || []}
                      columns={[
                        { title: 'Candidate', dataIndex: 'name', key: 'name', ellipsis: true },
                        {
                          title: 'Applications',
                          dataIndex: 'jobCount',
                          key: 'jobCount',
                          align: 'center' as const,
                          render: (value: number) => <span style={{ fontWeight: 600, color: BRAND }}>{value}</span>
                        },
                      ]}
                      size="small"
                    />
                  </Card>
                </Col>
              </>
            )}

            {/* Top Categories & Specializations Section */}
            <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
              <Card
                size="small"
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📂 Top Categories & Specializations</span>
                    <Space>
                      <span style={{ fontSize: '12px', color: '#666' }}>Top:</span>
                      <Input
                        type="number"
                        size="small"
                        style={{ width: 60 }}
                        value={topCount}
                        onChange={(e) => setTopCount(Number(e.target.value) || 10)}
                        min={1}
                        max={100}
                      />
                    </Space>
                  </div>
                }
                style={{ ...cardBaseStyle }}>
                <Table
                  pagination={false}
                  dataSource={topCategorySpec.slice(0, 8).map((item: any, idx: number) => ({
                    key: item.categoryId && item.specializationId ? `${item.categoryId}-${item.specializationId}` : idx,
                    category: item.categoryName || '-',
                    specialization: item.specializationName || '-',
                    resumeCount: item.resumeCount || 0
                  }))}
                  columns={[
                    {
                      title: 'Category',
                      dataIndex: 'category',
                      key: 'category',
                      width: '35%',
                      ellipsis: true,
                      render: (text: string) => <span style={{ fontWeight: 500, color: '#333' }}>{text}</span>
                    },
                    {
                      title: 'Specialization',
                      dataIndex: 'specialization',
                      key: 'specialization',
                      width: '45%',
                      ellipsis: true
                    },
                    {
                      title: 'CVs',
                      dataIndex: 'resumeCount',
                      key: 'resumeCount',
                      width: '20%',
                      align: 'center' as const,
                      render: (value: number) => <span style={{ fontWeight: 600, color: BRAND_GREEN }}>{value}</span>
                    },
                  ]}
                  size="small"
                  scroll={{ y: 200 }}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
              <Card size="small" title="📊 Resume Distribution" style={{ ...cardBaseStyle }}>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topCategorySpec.slice(0, 5).map(item => ({
                          name: item.specializationName?.length > 20
                            ? item.specializationName.substring(0, 20) + '...'
                            : item.specializationName,
                          value: item.resumeCount,
                          fullName: item.specializationName
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry: any) => `${entry.value}`}
                      >
                        {topCategorySpec.slice(0, 5).map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, _name: any, props: any) => [value + ' CVs', props.payload.fullName]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

          </Row>
        </>
      )}
    </Card>
  );
};

export default Dashboard;
