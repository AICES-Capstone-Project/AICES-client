import React, { useMemo } from "react";
import { Card, Space, Statistic, Typography } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { SystemOverviewData } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

const KPI_GRADIENT =
  "linear-gradient(135deg, #0E2F2A 0%, #134E3A 45%, #1F6F43 100%)";

const nfNumber = new Intl.NumberFormat("en-US");
const nfCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

/* ================= KPI CARD ================= */
const KpiCard: React.FC<{
  title: string;
  value?: number;
  icon: React.ReactNode;
  isMoney?: boolean;
}> = ({ title, value, icon, isMoney }) => {
  const safeValue = Number.isFinite(value as number) ? (value as number) : 0;

  return (
    <Card
      bordered={false}
      style={{
        height: 96,
        background: KPI_GRADIENT,
        color: "#eafff1",
        borderRadius: 16,
        boxShadow: "0 8px 22px rgba(0,0,0,0.10)",
        overflow: "hidden",
        position: "relative",
      }}
      bodyStyle={{ padding: 14 }}
    >
      {/* highlight bubble */}
      <div
        style={{
          position: "absolute",
          right: -28,
          top: -28,
          width: 96,
          height: 96,
          borderRadius: 999,
          background: "rgba(255,255,255,0.10)",
          pointerEvents: "none",
        }}
      />
      {/* top light overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
          pointerEvents: "none",
        }}
      />

      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <div style={{ minWidth: 0 }}>
          <Text style={{ color: "rgba(234,255,241,0.85)", fontWeight: 700 }}>
            {title}
          </Text>

          <div style={{ marginTop: 6 }}>
            <Statistic
              value={safeValue}
              formatter={(v) =>
                isMoney ? nfCurrency.format(Number(v)) : nfNumber.format(Number(v))
              }
              valueStyle={{
                color: "#eafff1",
                fontWeight: 800,
                fontSize: 24,
                lineHeight: 1.1,
              }}
            />
          </div>
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#fff",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </Space>
    </Card>
  );
};

/* ================= PROPS ================= */
interface OverviewSummaryProps {
  data?: SystemOverviewData;
}

/* ================= COMPONENT ================= */
const OverviewSummary: React.FC<OverviewSummaryProps> = ({ data }) => {
  const items = useMemo(
    () => [
      { title: "Companies", value: data?.totalCompanies, icon: <TeamOutlined /> },
      { title: "Users", value: data?.totalUsers, icon: <UserOutlined /> },
      { title: "Jobs", value: data?.totalJobs, icon: <AppstoreOutlined /> },
      { title: "Resumes", value: data?.totalResumes, icon: <FileTextOutlined /> },
      {
        title: "Revenue",
        value: data?.totalRevenue,
        icon: <DollarOutlined />,
        isMoney: true,
      },
    ],
    [data]
  );

  return (
    <>
      <div
        className="aices-kpi-grid"
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        }}
      >
        {items.map((item) => (
          <div key={item.title} style={{ minWidth: 0 }}>
            <KpiCard {...item} />
          </div>
        ))}
      </div>

      <style>
        {`
          @media (max-width: 1200px) {
            .aices-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
          @media (max-width: 768px) {
            .aices-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (max-width: 480px) {
            .aices-kpi-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          }
        `}
      </style>
    </>
  );
};

export default OverviewSummary;
