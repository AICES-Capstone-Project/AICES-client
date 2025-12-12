import React, { useMemo } from "react";
import { Card, Space, Statistic, Row, Col, Typography } from "antd";
import { DollarOutlined, RiseOutlined } from "@ant-design/icons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { SystemRevenueData } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== AICES GREEN PALETTE ===== */
const GREEN = {
  main: "#0A5C36",
  soft: "#E6F4EA",
  dark: "#18392B",
} as const;

interface RevenueChartProps {
  data?: SystemRevenueData;
}

const nfCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  if (!data) return null;

  const chartData = useMemo(
    () => [
      {
        month: data.month,
        revenue: data.totalRevenue,
        newRevenue: data.fromNewSubscriptions,
      },
    ],
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
          <DollarOutlined />
          <span>Revenue Overview</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 8 }}
    >
      {/* ===== KPI mini cards ===== */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              background: GREEN.soft,
            }}
            bodyStyle={{ padding: 14 }}
          >
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <Text style={{ color: "rgba(0,0,0,0.65)", fontWeight: 700 }}>
                Total Revenue
              </Text>

              <Statistic
                value={data.totalRevenue ?? 0}
                formatter={(v) => nfCurrency.format(Number(v))}
                valueStyle={{ color: GREEN.main, fontWeight: 900, fontSize: 24 }}
              />

              <Text type="secondary" style={{ fontSize: 12 }}>
                Month: {data.month}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(82,196,26,0.14) 0%, rgba(82,196,26,0.05) 100%)",
            }}
            bodyStyle={{ padding: 14 }}
          >
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <Space size={8}>
                <RiseOutlined style={{ color: "#52c41a" }} />
                <Text style={{ color: "rgba(0,0,0,0.65)", fontWeight: 700 }}>
                  From New Subscriptions
                </Text>
              </Space>

              <Statistic
                value={data.fromNewSubscriptions ?? 0}
                formatter={(v) => nfCurrency.format(Number(v))}
                valueStyle={{ color: "#237804", fontWeight: 900, fontSize: 24 }}
              />

              <Text type="secondary" style={{ fontSize: 12 }}>
                Contribution in current month
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* ===== Chart ===== */}
      <div style={{ width: "100%", height: 260, marginTop: 12 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => nfCurrency.format(Number(v))}
            />

            <Tooltip
              formatter={(value: any, name: any) => [
                nfCurrency.format(Number(value)),
                name === "revenue" ? "Total Revenue" : "New Subscriptions",
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Total Revenue"
              stroke={GREEN.main}
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="newRevenue"
              name="New Subscriptions"
              stroke="#52c41a"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;
