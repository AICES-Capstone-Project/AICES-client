import React, { useEffect, useState } from "react";
import { 
  Card, Spin, Table, Tag, Row, Col, Statistic, InputNumber, Button, Space, message 
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  UserOutlined,
  FileProtectOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  WalletOutlined,
  RiseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

// Import Service and Types
import companyDashboardService from "../../../services/dashboardService";
import type {
  DashboardSummary,
  TopCandidate,
  TopCategory,
} from "../../../services/dashboardService";

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [topCandidates, setTopCandidates] = useState<TopCandidate[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  
  // State input
  const [topN, setTopN] = useState<number | null>(5); 
  
  const [loadingTopCate, setLoadingTopCate] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hàm fetch toàn bộ dữ liệu (dùng cho nút Refresh tổng hoặc load ban đầu)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [summaryRes, candidatesData] = await Promise.all([
        companyDashboardService.getSummary(),
        companyDashboardService.getTopRatedCandidates(5),
      ]);

      setSummary(summaryRes?.data || { 
        activeJobs: 0, 
        totalMembers: 0, 
        aiProcessed: 0, 
        creditsRemaining: 0 
      });
      
      setTopCandidates(candidatesData || []);
      
      // Gọi luôn cái chart
      if (topN) {
        await fetchTopCategories(topN);
      }
    } catch (err) {
      console.error("Dashboard API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCategories = async (n: number) => {
    try {
      setLoadingTopCate(true);
      const data = await companyDashboardService.getTopCategorySpec(n);
      setTopCategories(data || []);
    } catch (err) {
      console.error("Fetch Top Categories error:", err);
    } finally {
      setLoadingTopCate(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleReloadTopCate = () => {
    if (!topN) {
      message.warning("Please enter a number!");
      return;
    }
    if (topN < 2) {
      message.warning("Minimum value is 2!");
      return;
    }
    fetchTopCategories(topN);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  // 👇 Custom Component để hiển thị 2 dòng trên trục Y
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    // payload.index giúp lấy đúng phần tử trong mảng topCategories
    const item = topCategories[payload.index];

    if (!item) return <g />;

    // Hàm cắt chuỗi nếu quá dài
    const truncate = (str: string, max: number) => 
      str.length > max ? str.substring(0, max) + "..." : str;

    return (
      <g transform={`translate(${x},${y})`}>
        {/* Dòng 1: Tên Specialization (Đậm) */}
        <text x={-6} y={-4} dy={0} textAnchor="end" fill="#333" fontSize={12} fontWeight={600}>
          {truncate(item.specializationName, 25)}
        </text>
        {/* Dòng 2: Tên Category (Nhạt hơn) */}
        <text x={-6} y={12} dy={0} textAnchor="end" fill="#888" fontSize={11}>
          {truncate(item.categoryName, 30)}
        </text>
      </g>
    );
  };

  return (
    // Sử dụng Wrapper Card giống hệt JobManagement
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
          {/* Left: Title */}
          <div style={{ flex: '0 0 auto' }}>
            <span className="font-semibold" style={{ fontSize: 16 }}>Dashboard Overview</span>
          </div>

          {/* Middle: Spacer (Dashboard không cần search bar ở đây) */}
          <div style={{ flex: 1 }}></div>

          {/* Right: Actions */}
          <div style={{ flex: '0 0 auto' }}>
            <div className="flex gap-2 items-center">
              <Button
                className="company-btn"
                icon={<ReloadOutlined />}
                onClick={fetchAllData}
                loading={loading}
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      }
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
        height: 'calc(100% - 25px)',
      }}
      bodyStyle={{ padding: 24, overflowY: 'auto', height: 'calc(100% - 60px)' }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
          <div style={{ marginTop: 10, color: "#888" }}>Loading dashboard...</div>
        </div>
      ) : (
        <>
          {/* ================= 1. STATISTICS (4 Cards) ================ */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Active Jobs"
                  value={summary?.activeJobs || 0}
                  prefix={<FileProtectOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Total Members"
                  value={summary?.totalMembers || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="AI Processed CVs"
                  value={summary?.aiProcessed || 0}
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Upload Credits"
                  value={summary?.creditsRemaining || 0}
                  prefix={<WalletOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="credits"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            {/* ================= 2. CHARTS ================= */}
            <Col xs={24} lg={14}>
              <Card 
                size="small"
                title={<span><RiseOutlined /> Popular Specializations</span>} 
                extra={
                  <Space>
                    <span style={{ fontSize: 12, color: '#888' }}>Top:</span>
                    <InputNumber 
                      className="company-input-number"
                      min={2} 
                      precision={0}
                      value={topN} 
                      onChange={(val) => setTopN(val)} 
                      status={!topN || topN < 2 ? "error" : ""}
                      style={{ width: 60 }}
                      onPressEnter={handleReloadTopCate}
                    />
                    <Button 
                      className="company-btn"
                      icon={<ReloadOutlined />} 
                      onClick={handleReloadTopCate}
                      loading={loadingTopCate}
                      disabled={!topN || topN < 2}
                    >
                      Apply
                    </Button>
                  </Space>
                }
                style={{ minHeight: 450 }}
              >
                {loadingTopCate ? (
                  <div style={{ textAlign: "center", padding: 80 }}>
                    <Spin />
                  </div>
                ) : topCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={topCategories}
                      layout="vertical"
                      // Tăng margin left để chứa đủ text dài
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      
                      {/* 👇 SỬ DỤNG CUSTOM TICK */}
                      <YAxis 
                        type="category" 
                        dataKey="specializationName"
                        width={190} // Tăng chiều rộng trục Y để đủ chỗ cho 2 dòng
                        tick={<CustomYAxisTick />} 
                        interval={0} // Đảm bảo hiện đủ các dòng không bị ẩn
                      />

                      <Tooltip formatter={(val) => [`${val} Resumes`, 'Count']} />
                      <Legend />
                      <Bar dataKey="resumeCount" name="Resume Count" barSize={20} radius={[0, 4, 4, 0]}>
                        {topCategories.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>No data available</div>
                )}
              </Card>
            </Col>

            {/* ================= 3. TOP CANDIDATES ================ */}
            <Col xs={24} lg={10}>
              <Card 
                size="small"
                title={<span><TrophyOutlined /> Top Potential Candidates</span>} 
                style={{ minHeight: 450 }}
              >
                <Table
                  dataSource={topCandidates}
                  rowKey={(_, index) => index!.toString()} 
                  pagination={false}
                  size="middle"
                  columns={[
                    {
                      title: "Candidate",
                      key: "candidate",
                      render: (_, record) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} /> */}
                          <div>
                            <div style={{ fontWeight: 600 }}>{record.name}</div>
                            <div style={{ fontSize: 11, color: '#888' }}>{record.jobTitle}</div>
                          </div>
                        </div>
                      )
                    },
                    {
                      title: "AI Score",
                      dataIndex: "aiScore",
                      key: "aiScore",
                      align: "center",
                      width: 90,
                      render: (score) => (
                        <Tag color={score >= 80 ? "green" : "orange"}>
                          {score}
                        </Tag>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default Dashboard;