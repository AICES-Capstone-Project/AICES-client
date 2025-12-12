import React, { useMemo } from "react";
import { Card, Row, Col, Statistic, Space, Tag, Typography } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type {
  SystemUsersData,
  SystemUsersByRoleItem,
} from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== AICES GREEN PALETTE ===== */
const GREENS = ["#0A5C36", "#0F5132", "#14452F", "#18392B", "#1D2E28"];

interface UsersChartProps {
  data?: SystemUsersData;
}

const kpiCardStyle: React.CSSProperties = {
  borderRadius: 14,
  height: 86,
};

const UsersChart: React.FC<UsersChartProps> = ({ data }) => {
  if (!data) return null;

  const pieData = useMemo(
    () =>
      (data.byRole ?? []).map((r: SystemUsersByRoleItem) => ({
        name: r.role,
        value: r.count,
      })),
    [data]
  );

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 14,
        boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
      }}
      title={
        <Space>
          <UserOutlined />
          <span>User Statistics</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 8 }}
    >
      <Row gutter={[16, 16]}>
        {/* ===== Left: KPI (đều chiều cao) ===== */}
        <Col xs={24} md={9}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontWeight: 700 }}>
                  Total Users
                </Text>
                <Statistic value={data.totalUsers ?? 0} valueStyle={{ fontWeight: 900 }} />
              </Space>
            </Card>

            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={6}>
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                  <Text type="secondary" style={{ fontWeight: 700 }}>
                    Active Users
                  </Text>
                  <Tag color="green" style={{ marginInlineEnd: 0 }}>Active</Tag>
                </Space>
                <Statistic
                  value={data.activeUsers ?? 0}
                  valueStyle={{ color: "#237804", fontWeight: 900 }}
                />
              </Space>
            </Card>

            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={6}>
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                  <Text type="secondary" style={{ fontWeight: 700 }}>
                    Locked Users
                  </Text>
                  <Tag color="red" style={{ marginInlineEnd: 0 }}>Locked</Tag>
                </Space>
                <Statistic
                  value={data.lockedUsers ?? 0}
                  valueStyle={{ color: "#A8071A", fontWeight: 900 }}
                />
              </Space>
            </Card>

            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={6}>
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                  <Space size={8}>
                    <TeamOutlined style={{ color: "#1677ff" }} />
                    <Text type="secondary" style={{ fontWeight: 700 }}>
                      New This Month
                    </Text>
                  </Space>
                  <Tag color="blue" style={{ marginInlineEnd: 0 }}>Growth</Tag>
                </Space>
                <Statistic
                  value={data.newUsersThisMonth ?? 0}
                  valueStyle={{ color: "#0958D9", fontWeight: 900 }}
                />
              </Space>
            </Card>
          </Space>
        </Col>

        {/* ===== Right: Pie Chart ===== */}
        <Col xs={24} md={15}>
          <Card
            bordered={false}
            style={{ borderRadius: 14, background: "#fff" }}
            bodyStyle={{ padding: 12 }}
          >
            <div style={{ width: "100%", height: 330 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "rgba(0,0,0,0.75)", fontSize: 12 }}>
                        {String(value)}
                      </span>
                    )}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={118}
                    paddingAngle={3}
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth={1}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={GREENS[index % GREENS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default UsersChart;
