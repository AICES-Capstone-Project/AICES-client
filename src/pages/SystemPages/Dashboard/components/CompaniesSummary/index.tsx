import React from "react";
import { Card, Col, Row, Space, Statistic, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { SystemCompaniesStatsData } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== GREEN PALETTE ===== */
const GREEN = {
  castletown: "#0A5C36",
  capitol: "#0F5132",
} as const;

const grad = (from: string, to: string) =>
  `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

interface CompaniesSummaryProps {
  data?: SystemCompaniesStatsData;
}

const boxStyle: React.CSSProperties = {
  borderRadius: 14,
  boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
};

const heroStyle: React.CSSProperties = {
  borderRadius: 14,
  height: 120,
};

const pillStyle: React.CSSProperties = {
  borderRadius: 14,
  height: 120,
  background: "#fff",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
};

const StatusPill: React.FC<{
  title: string;
  value: number;
  dot: string;
  bg: string;
  icon: React.ReactNode;
  chipText: string;
  chipBg: string;
  chipColor: string;
}> = ({ title, value, dot, bg, icon, chipText, chipBg, chipColor }) => {
  return (
    <div
      style={{
        ...pillStyle,
        background: bg,
        border: "1px solid rgba(0,0,0,0.04)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
      }}
    >


      <Space align="center" size={10} style={{ zIndex: 1 }}>
        {/* color dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: dot,
            boxShadow: `0 0 0 4px ${dot}22`,
            flexShrink: 0,
          }}
        />
        <Text style={{ fontWeight: 700 }}>{title}</Text>

        <div
          style={{
            marginLeft: "auto",
            width: 34,
            height: 34,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          {icon}
        </div>
      </Space>

      <div style={{ zIndex: 1 }}>
        <Statistic
          value={value}
          valueStyle={{ fontWeight: 800, fontSize: 24, lineHeight: 1.1 }}
        />
        {/* chip */}
        <span
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "3px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            background: chipBg,
            color: chipColor,
          }}
        >
          {chipText}
        </span>
      </div>
    </div>
  );
};

const CompaniesSummary: React.FC<CompaniesSummaryProps> = ({ data }) => {
  if (!data) return null;

  return (
    <Card
      bordered={false}
      style={boxStyle}
      title={
        <Space>
          <TeamOutlined />
          <span>Companies Overview</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 4 }}
    >
      <Row gutter={[16, 16]}>
        {/* ===== Row 1: Total + 3 status pills ===== */}
        <Col xs={24} lg={10}>
          <Card
            bordered={false}
            style={{
              ...heroStyle,
              background: grad(GREEN.castletown, GREEN.capitol),
              color: "#eafff1",
              overflow: "hidden",
              position: "relative",
            }}
            bodyStyle={{ padding: 18 }}
          >

            <Statistic
              title={
                <Text
                  style={{ color: "rgba(234,255,241,0.85)", fontWeight: 700 }}
                >
                  Total Companies
                </Text>
              }
              value={data.totalCompanies ?? 0}
              valueStyle={{
                color: "#eafff1",
                fontWeight: 900,
                fontSize: 28,
                lineHeight: 1.05,
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Row gutter={[16, 16]}>
            {/* ✅ Logic flow: Pending -> Approved -> Rejected */}
            <Col xs={24} sm={8}>
              <StatusPill
                title="Pending"
                value={data.pendingCompanies ?? 0}
                dot="#FAAD14"
                bg="linear-gradient(135deg, rgba(250,173,20,0.16) 0%, rgba(250,173,20,0.06) 100%)"
                icon={<ClockCircleOutlined style={{ color: "#FAAD14" }} />}
                chipText="Waiting"
                chipBg="rgba(250,173,20,0.18)"
                chipColor="#AD6800"
              />
            </Col>

            <Col xs={24} sm={8}>
              <StatusPill
                title="Approved"
                value={data.approvedCompanies ?? 0}
                dot="#52C41A"
                bg="linear-gradient(135deg, rgba(82,196,26,0.16) 0%, rgba(82,196,26,0.06) 100%)"
                icon={<CheckCircleOutlined style={{ color: "#52C41A" }} />}
                chipText="Active"
                chipBg="rgba(82,196,26,0.18)"
                chipColor="#237804"
              />
            </Col>

            <Col xs={24} sm={8}>
              <StatusPill
                title="Rejected"
                value={data.rejectedCompanies ?? 0}
                dot="#FF4D4F"
                bg="linear-gradient(135deg, rgba(255,77,79,0.16) 0%, rgba(255,77,79,0.06) 100%)"
                icon={<CloseCircleOutlined style={{ color: "#FF4D4F" }} />}
                chipText="Rejected"
                chipBg="rgba(255,77,79,0.18)"
                chipColor="#A8071A"
              />
            </Col>
          </Row>
        </Col>



        <Col xs={24} sm={12} lg={12}>
          <StatusPill
            title="New This Month"
            value={data.newCompaniesThisMonth ?? 0}
            dot="#1677FF"
            bg="linear-gradient(135deg, rgba(22,119,255,0.14) 0%, rgba(22,119,255,0.05) 100%)"
            icon={<TeamOutlined style={{ color: "#1677FF" }} />}
            chipText="Growth"
            chipBg="rgba(22,119,255,0.14)"
            chipColor="#0958D9"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CompaniesSummary;
