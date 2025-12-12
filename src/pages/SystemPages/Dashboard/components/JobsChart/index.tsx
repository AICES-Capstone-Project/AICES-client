import React from "react";
import { Card, Row, Col, Statistic, Space, Tag } from "antd";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { SystemJobsData } from "../../../../../types/system-dashboard.types";

/** ===== AICES GREEN PALETTE ===== */
const GREEN = {
  main: "#0A5C36",
  soft: "#E6F4EA",
  dark: "#18392B",
};

interface JobsChartProps {
  data?: SystemJobsData;
}

const JobsChart: React.FC<JobsChartProps> = ({ data }) => {
  if (!data) return null;

  const chartData = [
    { name: "Active", value: data.activeJobs },
    { name: "Closed", value: data.closedJobs },
    { name: "Expired", value: data.expiredJobs },
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 14,
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
      }}
      title={
        <Space>
          <AppstoreOutlined />
          <span>Job Statistics</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
    >
      <Row gutter={[16, 16]}>
        {/* ===== KPI Row ===== */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title="Total Jobs"
              value={data.totalJobs}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>

          <Card bordered={false} style={{ borderRadius: 12, marginTop: 12 }}>
            <Statistic
              title="New This Month"
              value={data.newJobsThisMonth}
              valueStyle={{ color: "#1890ff", fontWeight: 700 }}
            />
            <Tag color="blue">Growth</Tag>
          </Card>
        </Col>

        {/* ===== Chart ===== */}
        <Col xs={24} md={16}>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={GREEN.main}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== Legend ===== */}
          <Space style={{ marginTop: 12 }}>
            <Tag icon={<CheckCircleOutlined />} color="green">
              Active: {data.activeJobs}
            </Tag>
            <Tag icon={<CloseCircleOutlined />} color="red">
              Closed: {data.closedJobs}
            </Tag>
            <Tag icon={<ClockCircleOutlined />} color="gold">
              Expired: {data.expiredJobs}
            </Tag>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default JobsChart;
