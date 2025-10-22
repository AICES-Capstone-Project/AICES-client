import { useMemo } from "react";
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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TeamOutlined,
  UserOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

/** ===== GREEN PALETTE (theo ảnh bạn gửi) ===== */
const GREEN = {
  castletown: "#0A5C36",
  capitol: "#0F5132",
  britishRacing: "#14452F",
  darkGreen: "#18392B",
  gunmetal: "#1D2E28",
};

// tiện mix gradient
const grad = (from: string, to: string) =>
  `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

// card KPI chung
function KpiCard(props: {
  title: string;
  value: number | string;
  suffix?: React.ReactNode;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  sub?: React.ReactNode;
  trend?: "up" | "down" | "flat";
  trendText?: string;
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
      <div style={{ marginTop: 8, color: tColor, fontSize: 12 }}>
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
      bodyStyle={{ padding: 20 }}
    >
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <div style={{ opacity: 0.85, fontWeight: 600 }}>{props.title}</div>
          <Statistic
            valueStyle={{ color, fontWeight: 800 }}
            value={props.value}
            suffix={props.suffix}
          />
          {trendNode}
        </div>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(2px)",
            color: "#fff",
            fontSize: 22,
          }}
        >
          {props.icon}
        </div>
      </Space>
      {props.sub ? (
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
          {props.sub}
        </div>
      ) : null}
    </Card>
  );
}

type RecentItem = {
  id: number;
  type: "User" | "Job" | "Approval";
  title: string;
  by: string;
  status: "Success" | "Pending" | "Rejected";
  at: string;
};

const recentData: RecentItem[] = [
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

const Dashboard: React.FC = () => {
  // mock KPI — sau này map data từ API
  const kpis = [
    {
      title: "Total Users",
      value: 214,
      icon: <UserOutlined />,
      from: GREEN.castletown,
      to: GREEN.capitol,
      trend: "up" as const,
      trendText: "+9.1% vs last week",
    },
    {
      title: "Active Recruiters",
      value: 58,
      icon: <TeamOutlined />,
      from: GREEN.capitol,
      to: GREEN.britishRacing,
      trend: "up" as const,
      trendText: "+3 this week",
    },
    {
      title: "Pending Approvals",
      value: 7,
      icon: <FileDoneOutlined />,
      from: GREEN.britishRacing,
      to: GREEN.darkGreen,
      trend: "flat" as const,
      trendText: "no change",
    },
    {
      title: "Open Jobs",
      value: 32,
      icon: <AppstoreOutlined />,
      from: GREEN.darkGreen,
      to: GREEN.gunmetal,
      trend: "down" as const,
      trendText: "-2 closed today",
    },
  ];

  const columns: ColumnsType<RecentItem> = [
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
      width: 200,
      render: (v: string) => new Date(v).toLocaleString(),
    },
  ];

  return (
    <div>
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
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Space>
      </Space>

      <Divider style={{ margin: "12px 0 18px" }} />

      {/* KPI Row */}
      <Row gutter={[16, 16]}>
        {kpis.map((k, idx) => (
          <Col key={idx} xs={24} sm={12} lg={6}>
            <KpiCard
              title={k.title}
              value={k.value}
              icon={k.icon}
              gradientFrom={k.from}
              gradientTo={k.to}
              trend={k.trend}
              trendText={k.trendText}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Approval rate / Health */}
        <Col xs={24} lg={8}>
          <Card
            title="Approval Health"
            bordered={false}
            style={{ borderRadius: 14 }}
            headStyle={{ borderBottom: "none" }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <div>
                  <Text type="secondary">Weekly Approval Rate</Text>
                  <Title level={3} style={{ margin: 0 }}>
                    78%
                  </Title>
                </div>
                <Progress
                  type="dashboard"
                  percent={78}
                  strokeColor={{
                    "0%": GREEN.castletown,
                    "100%": GREEN.britishRacing,
                  }}
                />
              </Space>
              <Space wrap>
                <Tag color="green">Approved: 18</Tag>
                <Tag color="gold">Pending: 7</Tag>
                <Tag color="red">Rejected: 3</Tag>
              </Space>
              <div
                style={{
                  height: 10,
                  width: "100%",
                  background: `linear-gradient(90deg, ${GREEN.castletown}, ${GREEN.capitol}, ${GREEN.britishRacing}, ${GREEN.darkGreen}, ${GREEN.gunmetal})`,
                  borderRadius: 999,
                  opacity: 0.9,
                }}
              />
              <Text type="secondary">
                Tip: Duyệt nhanh các yêu cầu **Pending** để mở quyền truy cập
                cho Recruiter/Manager.
              </Text>
            </Space>
          </Card>
        </Col>

        {/* Quick Actions */}
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
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Capacity / usage mini-card */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 14, overflow: "hidden", padding: 0 }}
          >
            <div
              style={{
                padding: 20,
                background: grad(GREEN.capitol, GREEN.gunmetal),
                color: "#eafff1",
              }}
            >
              <Title level={5} style={{ color: "#eafff1", margin: 0 }}>
                Monthly Usage
              </Title>
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

        {/* Mini metrics */}
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 14,
                  background: grad(GREEN.castletown, GREEN.britishRacing),
                  color: "#eafff1",
                }}
              >
                <Space direction="vertical">
                  <Text style={{ color: "#eafff1", opacity: 0.85 }}>
                    Avg. Match Score
                  </Text>
                  <Title level={3} style={{ color: "#fff", margin: 0 }}>
                    73%
                  </Title>
                  <Text style={{ color: "#eafff1" }}>
                    <ArrowUpOutlined /> +4% vs last week
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 14,
                  background: grad(GREEN.darkGreen, GREEN.gunmetal),
                  color: "#eafff1",
                }}
              >
                <Space direction="vertical">
                  <Text style={{ color: "#eafff1", opacity: 0.85 }}>
                    Avg. Time to Approve
                  </Text>
                  <Title level={3} style={{ color: "#fff", margin: 0 }}>
                    3.2h
                  </Title>
                  <Text style={{ color: "#eafff1" }}>
                    <ArrowDownOutlined /> -0.5h vs last week
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
