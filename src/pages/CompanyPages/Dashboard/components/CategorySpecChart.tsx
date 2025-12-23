import React from "react";
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

// Create color variations based on DASHBOARD_COLORS
const COLORS = [
  DASHBOARD_COLORS.PRIMARY_DARK,
  DASHBOARD_COLORS.PRIMARY,
  DASHBOARD_COLORS.PRIMARY_MEDIUM,
  DASHBOARD_COLORS.PRIMARY_LIGHT,
  DASHBOARD_COLORS.ACCENT,
  '#86efac',
  '#bbf7d0'
];

interface CategorySpecChartProps {
  topCategorySpec: any[];
  topCount: number;
  setTopCount: (count: number) => void;
}

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 8,
  transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

const CategorySpecChart: React.FC<CategorySpecChartProps> = ({
  topCategorySpec,
  topCount,
  setTopCount,
}) => {
  return (
    <>
      <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
        <Card
          size="small"
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📂 Top Categories & Specializations</span>
              <Space>
                <span style={{ fontSize: '12px', color: '#666' }}>Top:</span>
                <Input
                  type="number"
                  size="small"
                  style={{ width: 60 }}
                  value={topCount}
                  onChange={(e) => setTopCount(Number(e.target.value) || 10)}
                  min={1}
                  max={100}
                />
              </Space>
            </div>
          }
          style={{ ...cardBaseStyle }}>
          <Table
            pagination={false}
            dataSource={topCategorySpec.slice(0, 8).map((item: any, idx: number) => ({
              key: item.categoryId && item.specializationId ? `${item.categoryId}-${item.specializationId}` : idx,
              category: item.categoryName || '-',
              specialization: item.specializationName || '-',
              resumeCount: item.resumeCount || 0
            }))}
            columns={[
              {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                width: '35%',
                ellipsis: true,
                render: (text: string) => <span style={{ fontWeight: 500, color: '#333' }}>{text}</span>
              },
              {
                title: 'Specialization',
                dataIndex: 'specialization',
                key: 'specialization',
                width: '45%',
                ellipsis: true
              },
              {
                title: 'CVs',
                dataIndex: 'resumeCount',
                key: 'resumeCount',
                width: '20%',
                align: 'center' as const,
                render: (value: number) => <span style={{ fontWeight: 600, color: DASHBOARD_COLORS.PRIMARY }}>{value}</span>
              },
            ]}
            size="small"
            scroll={{ y: 200 }}
          />
        </Card>
      </Col>

      <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
        <Card size="small" title="📊 Resume Distribution" style={{ ...cardBaseStyle }}>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCategorySpec.slice(0, 5).map(item => ({
                    name: item.specializationName?.length > 20
                      ? item.specializationName.substring(0, 20) + '...'
                      : item.specializationName,
                    value: item.resumeCount,
                    fullName: item.specializationName
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry: any) => `${entry.value}`}
                >
                  {topCategorySpec.slice(0, 5).map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, _name: any, props: any) => [value + ' CVs', props.payload.fullName]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </>
  );
};

export default CategorySpecChart;