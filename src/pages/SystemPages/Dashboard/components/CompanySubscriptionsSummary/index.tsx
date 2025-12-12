import React from "react";
import { Card, Col, Row, Statistic, Space, Progress, Tag, Typography } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import type { SystemCompanySubscriptionsData } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== AICES GREEN PALETTE ===== */
const GREEN = {
  main: "#0A5C36",
  dark: "#18392B",
} as const;

const grad = (from: string, to: string) =>
  `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

interface CompanySubscriptionsSummaryProps {
  data?: SystemCompanySubscriptionsData;
}

const CompanySubscriptionsSummary: React.FC<
  CompanySubscriptionsSummaryProps
> = ({ data }) => {
  if (!data) return null;

  const total = data.totalCompanySubscriptions ?? 0;
  const active = data.active ?? 0;
  const expired = data.expired ?? 0;
  const newThisMonth = data.newThisMonth ?? 0;

  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <Card
      bordered={false}
      style={{
        marginTop: 16,
        borderRadius: 14,
        boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
      }}
      title={
        <Space>
          <DollarOutlined />
          <span>Company Subscriptions</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 4 }}
    >
      <Row gutter={[16, 16]}>
        {/* ===== LEFT: HERO ===== */}
        <Col xs={24} lg={10}>
          <Card
            bordered={false}
            style={{
              height: 120,
              background: grad(GREEN.main, GREEN.dark),
              color: "#eafff1",
              borderRadius: 14,
            }}
            bodyStyle={{ padding: 16 }}
          >
            <Statistic
              title={
                <Text style={{ color: "rgba(234,255,241,0.85)", fontWeight: 700 }}>
                  Total Subscriptions
                </Text>
              }
              value={total}
              valueStyle={{
                color: "#eafff1",
                fontWeight: 900,
                fontSize: 28,
                lineHeight: 1.05,
              }}
            />

            <div style={{ marginTop: 10 }}>
              <Progress
                percent={activePercent}
                strokeColor="#b7eb8f"
                trailColor="rgba(255,255,255,0.25)"
                showInfo={false}
              />
              <Text style={{ fontSize: 12, color: "rgba(234,255,241,0.85)" }}>
                Active rate
              </Text>
            </div>
          </Card>
        </Col>

        {/* ===== RIGHT: BREAKDOWN ===== */}
        <Col xs={24} lg={14}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                style={{ borderRadius: 14, height: 120 }}
                bodyStyle={{ padding: 16 }}
              >
                <Space direction="vertical" size={8}>
                  <Space>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    <Text strong>Active</Text>
                  </Space>

                  <Statistic value={active} />

                  <Tag color="green">Running</Tag>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                style={{ borderRadius: 14, height: 120 }}
                bodyStyle={{ padding: 16 }}
              >
                <Space direction="vertical" size={8}>
                  <Space>
                    <ClockCircleOutlined style={{ color: "#faad14" }} />
                    <Text strong>Expired</Text>
                  </Space>

                  <Statistic value={expired} />

                  <Tag color="gold">Expired</Tag>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                style={{ borderRadius: 14, height: 120 }}
                bodyStyle={{ padding: 16 }}
              >
                <Space direction="vertical" size={8}>
                  <Space>
                    <FireOutlined style={{ color: "#1677ff" }} />
                    <Text strong>New This Month</Text>
                  </Space>

                  <Statistic value={newThisMonth} />

                  <Tag color="blue">Growth</Tag>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CompanySubscriptionsSummary;
