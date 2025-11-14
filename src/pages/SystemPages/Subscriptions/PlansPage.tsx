// src/pages/SystemPages/Subscriptions/PlansPage.tsx

import { useEffect, useState } from "react";
import { Card, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  subscriptionService,
} from "../../../services/subscriptionService";
import type { SubscriptionPlan } from "../../../types/subscription.types";

const { Title, Text } = Typography;

export default function PlansPage() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  const columns: ColumnsType<SubscriptionPlan> = [
    {
      title: "ID",
      dataIndex: "id",
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
      dataIndex: "limit",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 110,
      render: (value) =>
        value ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
    },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await subscriptionService.getAll();
        setPlans(data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load subscription plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <Card>
      <Title level={4} style={{ marginBottom: 16 }}>
        Subscription Plans
      </Title>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={plans}
      />
    </Card>
  );
}
