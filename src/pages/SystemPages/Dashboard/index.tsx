import React, { useMemo, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Tag,
  Progress,
  Table,
  Space,
  Button,
  Typography,
  Divider,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// Charts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const { Title, Text } = Typography;

/** ===== GREEN PALETTE (giữ template màu xanh lá gradient) ===== */
const GREEN = {
  castletown: "#0A5C36",
  capitol: "#0F5132",
  britishRacing: "#14452F",
  darkGreen: "#18392B",
  gunmetal: "#1D2E28",
} as const;

const GREENS = [
  GREEN.castletown,
  GREEN.capitol,
  GREEN.britishRacing,
  GREEN.darkGreen,
  GREEN.gunmetal,
];

// tiện mix gradient
const grad = (from: string, to: string) =>
  `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

/* ================= Sparkline (mini chart cho KPI) ================= */
const Sparkline: React.FC<{ data: number[] }> = ({ data }) => (
  <div style={{ width: "100%", height: 36 }}>
    <ResponsiveContainer>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line
          type="monotone"
          dataKey="v"
          stroke="#ffffff"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// card KPI chung
const KpiCard = React.memo(function KpiCard(props: {
  title: string;
  value: number | string;
  suffix?: React.ReactNode;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  sub?: React.ReactNode;
  trend?: "up" | "down" | "flat";
  trendText?: string;
  sparkline?: number[];
}) {
  const color = "#eafff1"; // text nhạt nổi bật trên nền xanh
  const trendNode = useMemo(() => {
    if (!props.trendText) return null;
    const ico =
      props.trend === "down" ? (
        <ArrowDownOutlined />
      ) : props.trend === "up" ? (
        <ArrowUpOutlined />
      ) : (
        <RiseOutlined />
      );
    const tColor = props.trend === "down" ? "#ffd6d6" : "#d9f7be";
    return (
      <div style={{ marginTop: 6, color: tColor, fontSize: 12 }}>
        <Space size={6}>
          {ico}
          <span>{props.trendText}</span>
        </Space>
      </div>
    );
  }, [props.trend, props.trendText]);

  return (
    <Card
      bordered={false}
      style={{
        height: "100%",
        background: grad(props.gradientFrom, props.gradientTo),
        color,
        boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
        borderRadius: 14,
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <div style={{ opacity: 0.85, fontWeight: 700 }}>{props.title}</div>
          <Statistic
            valueStyle={{ color, fontWeight: 800, fontSize: 22 }}
            value={props.value}
            suffix={props.suffix}
          />
          {trendNode}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(2px)",
            color: "#fff",
            fontSize: 20,
          }}
        >
          {props.icon}
        </div>
      </Space>
      {props.sparkline ? (
        <div style={{ marginTop: 6 }}>
          <Sparkline data={props.sparkline} />
        </div>
      ) : null}
      {props.sub ? (
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>
          {props.sub}
        </div>
      ) : null}
    </Card>
  );
});

// ==== Types ====
type RecentItem = {
  id: number;
  type: "User" | "Job" | "Approval";
  title: string;
  by: string;
  status: "Success" | "Pending" | "Rejected";
  at: string; // ISO string
};

// ==== Mock data (sau này thay bằng API) ====
const recentDataMock: RecentItem[] = [
  {
    id: 1,
    type: "Approval",
    title: "Recruiter join request",
    by: "hr.minh@acme.com",
    status: "Pending",
    at: new Date().toISOString(),
  },
  {
    id: 2,
    type: "Job",
    title: "Backend Engineer (Node.js)",
    by: "FPT Software",
    status: "Success",
    at: new Date(Date.now() - 3600e3).toISOString(),
  },
  {
    id: 3,
    type: "User",
    title: "New system staff",
    by: "yen.tt@aices.vn",
    status: "Success",
    at: new Date(Date.now() - 2 * 3600e3).toISOString(),
  },
  {
    id: 4,
    type: "Approval",
    title: "Recruiter re-apply",
    by: "recruit@startup.vn",
    status: "Rejected",
    at: new Date(Date.now() - 4 * 3600e3).toISOString(),
  },
];

// ==== Chart data (mock để khớp UI screenshot) ====
const monthlySales = [
  { name: "Jan", Clothing: 50, Food: 45 },
  { name: "Feb", Clothing: 62, Food: 20 },
  { name: "Mar", Clothing: 60, Food: 63 },
  { name: "Apr", Clothing: 55, Food: 50 },
  { name: "May", Clothing: 48, Food: 52 },
  { name: "Jun", Clothing: 30, Food: 28 },
  { name: "Jul", Clothing: 26, Food: 35 },
  { name: "Aug", Clothing: 46, Food: 55 },
  { name: "Sep", Clothing: 52, Food: 58 },
  { name: "Oct", Clothing: 56, Food: 59 },
  { name: "Nov", Clothing: 48, Food: 51 },
  { name: "Dec", Clothing: 60, Food: 60 },
];

const departmentSales = [
  { name: "Clothing", value: 22 },
  { name: "Food Products", value: 28 },
  { name: "Electronics", value: 18 },
  { name: "Kitchen Utility", value: 14 },
  { name: "Gardening", value: 10 },
];

const dailyVisits = [
  { name: "Mon", Day: 1, Night: 0.8 },
  { name: "Tue", Day: 3.5, Night: 2.8 },
  { name: "Wed", Day: 9.8, Night: 6.5 },
  { name: "Thu", Day: 4.2, Night: 3.6 },
  { name: "Fri", Day: 7.1, Night: 5.0 },
  { name: "Sat", Day: 6.2, Night: 4.1 },
  { name: "Sun", Day: 0.4, Night: 0.3 },
];

const customersTrends = [
  { name: "W1", Day: 40, Night: 30 },
  { name: "W2", Day: 60, Night: 42 },
  { name: "W3", Day: 90, Night: 55 },
  { name: "W4", Day: 110, Night: 70 },
];

const kpiSparks = {
  sales: [4, 6, 5, 9, 8, 10, 9, 11, 10, 12, 11, 13],
  expenses: [3, 5, 4, 6, 5, 7, 6, 5, 7, 6, 7, 6],
  profits: [1, 2, 2, 4, 3, 5, 4, 6, 5, 7, 6, 7],
};

const Dashboard: React.FC = () => {
  // reloadKey để trigger refetch thay vì window.location.reload
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentData, setRecentData] = useState<RecentItem[]>(recentDataMock);

  // mock KPI — sau này map data từ API
  const kpis = [
    {
      title: "Sales",
      value: "$424,652",
      icon: <UserOutlined />,
      from: GREEN.castletown,
      to: GREEN.capitol,
      trend: "up" as const,
      trendText: "+9.1% vs last week",
      spark: kpiSparks.sales,
    },
    {
      title: "Expenses",
      value: "$235,312",
      icon: <TeamOutlined />,
      from: GREEN.capitol,
      to: GREEN.britishRacing,
      trend: "up" as const,
      trendText: "+3 this week",
      spark: kpiSparks.expenses,
    },
    {
      title: "Profits",
      value: "$135,965",
      icon: <AppstoreOutlined />,
      from: GREEN.darkGreen,
      to: GREEN.gunmetal,
      trend: "flat" as const,
      trendText: "no change",
      spark: kpiSparks.profits,
    },
  ];

  // Columns memo để tránh re-render không cần thiết
  const columns: ColumnsType<RecentItem> = useMemo(
    () => [
      {
        title: "Type",
        dataIndex: "type",
        width: 110,
        render: (t) => (
          <Tag color={t === "Job" ? "green" : t === "User" ? "blue" : "gold"}>
            {t}
          </Tag>
        ),
      },
      {
        title: "Title",
        dataIndex: "title",
        ellipsis: true,
      },
      {
        title: "By / Email",
        dataIndex: "by",
        width: 240,
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 120,
        render: (s) =>
          s === "Success" ? (
            <Tag color="green">Success</Tag>
          ) : s === "Pending" ? (
            <Tag color="gold">Pending</Tag>
          ) : (
            <Tag color="red">Rejected</Tag>
          ),
      },
      {
        title: "Time",
        dataIndex: "at",
        width: 190,
        render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
      },
    ],
    []
  );

  const handleRefresh = async () => {
    setLoading(true);
    // TODO: call API here. Ví dụ:
    // const res = await dashboardService.fetchRecent();
    // setRecentData(res.data);
    setRecentData((prev) => [...prev].reverse());
    setReloadKey((k) => k + 1);
    setLoading(false);
  };

  return (
    <div key={reloadKey}>
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Title level={4} style={{ margin: 0 }}>
          System Dashboard
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Space>
      </Space>

      <Divider style={{ margin: "12px 0 18px" }} />

      {/* === KPI 3 cards với sparkline giống screenshot === */}
      <Row gutter={[16, 16]}>
        {kpis.map((k, idx) => (
          <Col key={idx} xs={24} md={8}>
            <KpiCard
              title={k.title}
              value={k.value}
              icon={k.icon}
              gradientFrom={k.from}
              gradientTo={k.to}
              trend={k.trend}
              trendText={k.trendText}
              sparkline={k.spark}
            />
          </Col>
        ))}
      </Row>

      {/* === Hàng 2: Monthly Sales (Bar) & Department Sales (Donut) === */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ borderRadius: 14 }}
            title="Monthly Sales"
            headStyle={{ borderBottom: "none" }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Clothing"
                    fill={GREEN.capitol}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="Food"
                    fill={GREEN.britishRacing}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ borderRadius: 14 }}
            title="Department Sales"
            headStyle={{ borderBottom: "none" }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={departmentSales}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {departmentSales.map((_, i) => (
                      <Cell key={i} fill={GREENS[i % GREENS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* === Hàng 3: Daily Visits (Area) & Customers (Line) === */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ borderRadius: 14 }}
            title="Daily Visits Insights"
            headStyle={{ borderBottom: "none" }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={dailyVisits}>
                  <defs>
                    <linearGradient id="gradDay" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={GREEN.castletown}
                        stopOpacity={0.7}
                      />
                      <stop
                        offset="100%"
                        stopColor={GREEN.castletown}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="gradNight" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={GREEN.britishRacing}
                        stopOpacity={0.7}
                      />
                      <stop
                        offset="100%"
                        stopColor={GREEN.britishRacing}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Day"
                    stroke={GREEN.castletown}
                    fill="url(#gradDay)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Night"
                    stroke={GREEN.britishRacing}
                    fill="url(#gradNight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ borderRadius: 14 }}
            title="Customers"
            headStyle={{ borderBottom: "none" }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={customersTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Day"
                    stroke={GREEN.capitol}
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Night"
                    stroke={GREEN.gunmetal}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* === Hàng 4: Quick Actions + Recent Activity + Usage === */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card
            title="Monthly Usage"
            bordered={false}
            style={{ borderRadius: 14, overflow: "hidden", padding: 0 }}
            headStyle={{ borderBottom: "none" }}
          >
            <div
              style={{
                padding: 20,
                background: grad(GREEN.capitol, GREEN.gunmetal),
                color: "#eafff1",
              }}
            >
              <Text>Resumes parsed this month</Text>
              <div style={{ marginTop: 12 }}>
                <Progress percent={62} showInfo />
              </div>
              <div style={{ marginTop: 8, opacity: 0.9 }}>
                <Space>
                  <Tag color="green">620 / 1000</Tag>
                  <Text>(Plan: Starter)</Text>
                </Space>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title="Quick Actions"
            bordered={false}
            style={{ borderRadius: 14 }}
            headStyle={{ borderBottom: "none" }}
          >
            <Space wrap>
              <Button type="primary">Create Job</Button>
              <Button>Invite Recruiter</Button>
              <Button>View Reports</Button>
              <Button>Manage Roles</Button>
              <Button>Open Settings</Button>
            </Space>

            <Divider />

            <Title level={5} style={{ marginTop: 0 }}>
              Recent Activity
            </Title>
            <Table<RecentItem>
              rowKey="id"
              dataSource={recentData}
              columns={columns}
              size="middle"
              pagination={false}
              loading={loading}
              locale={{ emptyText: <Empty description="No activity" /> }}
              scroll={{ x: 720 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
