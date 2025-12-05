// src/pages/SystemPages/Subscriptions/components/subscribed-companies/SubscribedCompaniesTable.tsx

import { Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { CompanySubscription } from "../../../../../types/companySubscription.types";

const { Text } = Typography;

interface SubscribedCompaniesTableProps {
  loading: boolean;
  data: CompanySubscription[];
  pagination: TablePaginationConfig;
  onChange: (pagination: TablePaginationConfig) => void;
}

export default function SubscribedCompaniesTable({
  loading,
  data,
  pagination,
  onChange,
}: SubscribedCompaniesTableProps) {
  const columns: ColumnsType<CompanySubscription> = [
    {
      title: "ID",
      dataIndex: "comSubId",
      width: 80,
    },
    {
      title: "Company",
      dataIndex: "companyName",
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            Company ID: {record.companyId}
          </div>
        </div>
      ),
    },
    {
      title: "Subscription",
      dataIndex: "subscriptionName",
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            Plan ID: {record.subscriptionId}
          </div>
        </div>
      ),
    },
    {
      title: "Start – End",
      key: "duration",
      render: (_, record) => {
        const start = new Date(record.startDate).toLocaleDateString();
        const end = new Date(record.endDate).toLocaleDateString();
        return (
          <div>
            <Text>
              {start} → {end}
            </Text>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              Created: {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="accounts-table"
      rowKey="comSubId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={onChange}
    />
  );
}
