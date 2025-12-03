// src/pages/SystemPages/Subscriptions/components/plans/PlansTable.tsx

import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SubscriptionPlan } from "../../../../../types/subscription.types";


const { Text } = Typography;

interface PlansTableProps {
  loading: boolean;
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

export default function PlansTable({
  loading,
  plans,
  onEdit,
  onDelete,
}: PlansTableProps) {
  const columns: ColumnsType<SubscriptionPlan> = [
    {
      title: "ID",
      dataIndex: "subscriptionId",
      width: 70,
    },
    {
      title: "Plan Name",
      dataIndex: "name",
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          {record.description && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.description}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 140,
      render: (value) => <Text>{value.toLocaleString()} ₫</Text>,
    },
    {
      title: "Duration",
      dataIndex: "durationDays",
      width: 120,
      render: (days) => <Text>{days} days</Text>,
    },
    {
      title: "Limit",
      key: "limit",
      width: 200,
      render: (_, record) => (
        <Text>
          {record.resumeLimit} resumes / {record.hoursLimit}h
        </Text>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button size="small" type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this plan?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record)}
          >
            <Button size="small" type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="subscriptionId"
      loading={loading}
      columns={columns}
      dataSource={plans}
    />
  );
}
