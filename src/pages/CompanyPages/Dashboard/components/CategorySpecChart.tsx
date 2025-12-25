import React, { useRef, useState, useLayoutEffect } from "react";
import { Card, Col, Table, Input, Space } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { DASHBOARD_COLORS } from "../constants/colors";

/* ================= COLORS ================= */
const COLORS = [
  DASHBOARD_COLORS.PRIMARY_DARK,
  DASHBOARD_COLORS.PRIMARY,
  DASHBOARD_COLORS.PRIMARY_MEDIUM,
  DASHBOARD_COLORS.PRIMARY_LIGHT,
  DASHBOARD_COLORS.ACCENT,
  "#86efac",
  "#bbf7d0",
];

/* ================= TYPES ================= */
interface CategorySpecChartProps {
  topCategorySpec: any[];
  topCount: number;
  setTopCount: (count: number) => void;
}

/* ================= STYLE ================= */
const cardBaseStyle: React.CSSProperties = {
  borderRadius: 8,
  transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

/* ================= COMPONENT ================= */
const CategorySpecChart: React.FC<CategorySpecChartProps> = ({
  topCategorySpec,
  topCount,
  setTopCount,
}) => {
  /* ====== FIX RECHARTS WIDTH(-1) ====== */
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const [chartReady, setChartReady] = useState(false);

  useLayoutEffect(() => {
    if (!chartWrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      if (rect.width > 0 && rect.height > 0) {
        setChartReady(true);
      }
    });

    observer.observe(chartWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ================= TABLE ================= */}
      <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
        <Card
          size="small"
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>📂 Top Categories & Specializations</span>
              <Space>
                <span style={{ fontSize: 12, color: "#666" }}>Top:</span>
                <Input
                  type="number"
                  size="small"
                  style={{ width: 60 }}
                  value={topCount}
                  min={1}
                  max={100}
                  onChange={(e) =>
                    setTopCount(Number(e.target.value) || 10)
                  }
                />
              </Space>
            </div>
          }
          style={cardBaseStyle}
        >
          <Table
            pagination={false}
            size="small"
            scroll={{ y: 200 }}
            dataSource={topCategorySpec.slice(0, 8).map((item, idx) => ({
              key:
                item.categoryId && item.specializationId
                  ? `${item.categoryId}-${item.specializationId}`
                  : idx,
              category: item.categoryName || "-",
              specialization: item.specializationName || "-",
              resumeCount: item.resumeCount || 0,
            }))}
            columns={[
              {
                title: "Category",
                dataIndex: "category",
                width: "35%",
                ellipsis: true,
                render: (t: string) => (
                  <span style={{ fontWeight: 500 }}>{t}</span>
                ),
              },
              {
                title: "Specialization",
                dataIndex: "specialization",
                width: "45%",
                ellipsis: true,
              },
              {
                title: "CVs",
                dataIndex: "resumeCount",
                width: "20%",
                align: "center",
                render: (v: number) => (
                  <span
                    style={{
                      fontWeight: 600,
                      color: DASHBOARD_COLORS.PRIMARY,
                    }}
                  >
                    {v}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      </Col>

      {/* ================= PIE CHART ================= */}
      <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
        <Card
          size="small"
          title="📊 Resume Distribution"
          style={cardBaseStyle}
        >
          <div
            ref={chartWrapperRef}
            style={{
              width: "100%",
              height: 260,
            }}
          >
            {/* ⛔ KHÔNG render chart khi chưa có size */}
            {!chartReady ? null : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={topCategorySpec.slice(0, 5).map((item) => ({
                      name:
                        item.specializationName?.length > 20
                          ? item.specializationName.slice(0, 20) + "..."
                          : item.specializationName,
                      value: item.resumeCount,
                      fullName: item.specializationName,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(e: any) => e.value}
                  >
                    {topCategorySpec.slice(0, 5).map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any, _n: any, p: any) => [
                      `${v} CVs`,
                      p.payload.fullName,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </Col>
    </>
  );
};

export default CategorySpecChart;
