import React, { useMemo } from "react";
import { Card, Row, Col, Statistic, Space, Tag, Typography } from "antd";
import {
  CrownOutlined,
  MoneyCollectOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import type { SystemSubscriptionPlanItem } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== AICES GREEN PALETTE ===== */
const GREENS = [
  "#0A5C36",
  "#0F5132",
  "#14452F",
  "#18392B",
  "#1D2E28",
];

interface SubscriptionPlansUsageProps {
  data?: SystemSubscriptionPlanItem[];
}

const kpiCardStyle: React.CSSProperties = {
  borderRadius: 14,
  height: 86,
};

const nfCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const SubscriptionPlansUsage: React.FC<SubscriptionPlansUsageProps> = ({
  data,
}) => {
  const plans = data ?? [];
  if (plans.length === 0) return null;

  const totalActive = useMemo(
    () => plans.reduce((sum, p) => sum + (p.activeSubscriptions ?? 0), 0),
    [plans]
  );

  const totalRevenue = useMemo(
    () => plans.reduce((sum, p) => sum + (p.monthlyRevenue ?? 0), 0),
    [plans]
  );

  const chartData = useMemo(
    () =>
      plans.map((p) => ({
        name: p.planName,
        value: p.activeSubscriptions ?? 0,
      })),
    [plans]
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
          <CrownOutlined />
          <span>Subscription Plans Usage</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 8 }}
    >
      <Row gutter={[16, 16]}>
        {/* ===== LEFT KPI ===== */}
        <Col xs={24} md={9}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontWeight: 700 }}>
                  Active Subscriptions
                </Text>
                <Statistic
                  value={totalActive}
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ fontWeight: 900 }}
                />
              </Space>
            </Card>

            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                  <Space size={8}>
                    <MoneyCollectOutlined style={{ color: "#0A5C36" }} />
                    <Text type="secondary" style={{ fontWeight: 700 }}>
                      Monthly Revenue
                    </Text>
                  </Space>
                  <Tag color="green" style={{ marginInlineEnd: 0 }}>
                    System Income
                  </Tag>
                </Space>

                <Statistic
                  value={totalRevenue}
                  formatter={(v) => nfCurrency.format(Number(v))}
                  valueStyle={{ color: "#0A5C36", fontWeight: 900 }}
                />
              </Space>
            </Card>
          </Space>
        </Col>

        {/* ===== PIE CHART ===== */}
        <Col xs={24} md={15}>
          <Card
            bordered={false}
            style={{ borderRadius: 14 }}
            bodyStyle={{ padding: 12 }}
          >
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      value,
                      `${name} subscriptions`,
                    ]}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={64}
                    outerRadius={110}
                    paddingAngle={3}
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth={1}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={GREENS[index % GREENS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ===== LEGEND (clean) ===== */}
            <div style={{ marginTop: 12 }}>
              <Space wrap size={[8, 8]}>
                {plans.map((p, index) => (
                  <Tag
                    key={p.planName}
                    color="green"
                    style={{ marginInlineEnd: 0 }}
                  >
                    {p.planName}: {p.activeSubscriptions}
                  </Tag>
                ))}
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default SubscriptionPlansUsage;
