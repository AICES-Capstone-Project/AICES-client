import React, { useMemo } from "react";
import { Card, Row, Col, Statistic, Space, Tag, Progress, Typography } from "antd";
import {
  FileTextOutlined,
  UploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { SystemResumesData } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== AICES GREEN PALETTE ===== */
const GREEN = {
  main: "#0A5C36",
  soft: "#E6F4EA",
  dark: "#18392B",
} as const;

interface ResumesChartProps {
  data?: SystemResumesData;
}

const kpiCardStyle: React.CSSProperties = {
  borderRadius: 14,
  height: 86,
};

const ResumesChart: React.FC<ResumesChartProps> = ({ data }) => {
  if (!data) return null;

  const chartData = useMemo(
    () => [
      { name: "New", value: data.newResumesThisMonth ?? 0 },
      { name: "Applied", value: data.appliedThisMonth ?? 0 },
    ],
    [data]
  );

  const newThisMonth = data.newResumesThisMonth ?? 0;
  const appliedThisMonth = data.appliedThisMonth ?? 0;

  const appliedRate = newThisMonth > 0 ? Math.round((appliedThisMonth / newThisMonth) * 100) : 0;

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 14,
        boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
      }}
      title={
        <Space>
          <FileTextOutlined />
          <span>Resume Statistics</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 8 }}
    >
      <Row gutter={[16, 16]}>
        {/* ===== KPI LEFT ===== */}
        <Col xs={24} md={9}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontWeight: 700 }}>
                  Total Resumes
                </Text>
                <Statistic value={data.totalResumes ?? 0} valueStyle={{ fontWeight: 900 }} />
              </Space>
            </Card>

            <Card bordered={false} style={kpiCardStyle} bodyStyle={{ padding: 14 }}>
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                  <Text type="secondary" style={{ fontWeight: 700 }}>
                    New This Month
                  </Text>
                  <Tag icon={<UploadOutlined />} color="green" style={{ marginInlineEnd: 0 }}>
                    Uploaded
                  </Tag>
                </Space>

                <Statistic
                  value={newThisMonth}
                  valueStyle={{ color: GREEN.main, fontWeight: 900 }}
                />
              </Space>
            </Card>

            {/* small helper card for applied count (optional but keeps left balanced) */}
            <Card
              bordered={false}
              style={{ ...kpiCardStyle, background: GREEN.soft }}
              bodyStyle={{ padding: 14 }}
            >
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                  <Text type="secondary" style={{ fontWeight: 700 }}>
                    Applied This Month
                  </Text>
                  <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                    Applied
                  </Tag>
                </Space>

                <Statistic value={appliedThisMonth} valueStyle={{ fontWeight: 900, color: GREEN.dark }} />
              </Space>
            </Card>
          </Space>
        </Col>

        {/* ===== RIGHT ===== */}
        <Col xs={24} md={15}>
          <Card bordered={false} style={{ borderRadius: 14 }} bodyStyle={{ padding: 12 }}>
            {/* ===== CHART ===== */}
            <div style={{ width: "100%", height: 230 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="resumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GREEN.main} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={GREEN.main} stopOpacity={0.08} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis tickLine={false} axisLine={false} dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={GREEN.main}
                    fill="url(#resumeGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* ===== APPLY RATE ===== */}
            <Card
              bordered={false}
              style={{ borderRadius: 14, marginTop: 12, background: "#fff" }}
              bodyStyle={{ padding: 12 }}
            >
              <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                <Space align="center">
                  <CheckCircleOutlined style={{ color: GREEN.main }} />
                  <Text strong>Apply Rate</Text>
                </Space>

                <Tag color="green" style={{ marginInlineEnd: 0 }}>
                  {appliedThisMonth} / {newThisMonth} Applied
                </Tag>
              </Space>

              <Progress
                percent={appliedRate}
                strokeColor={GREEN.main}
                showInfo
                style={{ marginTop: 8 }}
              />
            </Card>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ResumesChart;
