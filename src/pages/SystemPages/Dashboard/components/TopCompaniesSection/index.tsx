import React, { useMemo } from "react";
import { Card, Table, Tag, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { TrophyOutlined, ApartmentOutlined } from "@ant-design/icons";
import type { SystemTopCompanyItem } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== AICES GREEN ===== */
const GREEN = "#0A5C36";

interface TopCompaniesSectionProps {
  data?: SystemTopCompanyItem[];
}

const rankTag = (index: number) => {
  if (index === 0) return { color: "gold", text: "1" };
  if (index === 1) return { color: "default", text: "2" }; // silver vibe
  if (index === 2) return { color: "orange", text: "3" };  // bronze vibe
  return { color: "green", text: String(index + 1) };
};

const TopCompaniesSection: React.FC<TopCompaniesSectionProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const columns: ColumnsType<SystemTopCompanyItem> = useMemo(
    () => [
      {
        title: "#",
        width: 64,
        align: "center",
        render: (_, __, index) => {
          const r = rankTag(index);
          return (
            <Tag
              color={r.color as any}
              style={{ marginInlineEnd: 0, fontWeight: 800, borderRadius: 999 }}
            >
              {r.text}
            </Tag>
          );
        },
      },
      {
        title: "Company",
        dataIndex: "companyName",
        ellipsis: true,
        render: (name: string) => (
          <Space size={8}>
            <ApartmentOutlined style={{ color: GREEN }} />
            <Text strong>{name}</Text>
          </Space>
        ),
      },
      {
        title: "Jobs",
        dataIndex: "jobCount",
        width: 120,
        align: "center",
        render: (v: number) => (
          <Tag color="blue" style={{ marginInlineEnd: 0, borderRadius: 999 }}>
            {v}
          </Tag>
        ),
      },
      {
        title: "Resumes",
        dataIndex: "resumeCount",
        width: 120,
        align: "center",
        render: (v: number) => (
          <Tag color="green" style={{ marginInlineEnd: 0, borderRadius: 999 }}>
            {v}
          </Tag>
        ),
      },
    ],
    []
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
          <TrophyOutlined style={{ color: GREEN }} />
          <span>Top Companies</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 4 }}
    >
      <Table<SystemTopCompanyItem>
        rowKey="companyId"
        dataSource={data}
        columns={columns}
        pagination={false}
        size="middle"
        showHeader
        rowClassName={(_, idx) => (idx % 2 === 0 ? "aices-row-even" : "aices-row-odd")}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

      <style>
        {`
          .aices-row-even td { background: #ffffff; }
          .aices-row-odd td { background: #fcfcfc; }

          .ant-table-thead > tr > th {
            background: #ffffff !important;
            font-weight: 800 !important;
            color: rgba(0,0,0,0.75) !important;
            border-bottom: 1px solid rgba(0,0,0,0.06) !important;
          }

          .ant-table-tbody > tr:hover > td {
            background: rgba(10,92,54,0.06) !important;
          }
        `}
      </style>
    </Card>
  );
};

export default TopCompaniesSection;
