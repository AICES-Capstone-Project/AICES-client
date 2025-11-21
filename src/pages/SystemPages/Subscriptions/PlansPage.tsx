// src/pages/SystemPages/Subscriptions/PlansPage.tsx

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { subscriptionService } from "../../../services/subscriptionService";
import type { SubscriptionPlan } from "../../../types/subscription.types";

const { Title, Text } = Typography;

interface SubscriptionPlanFormValues {
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  limit: string;
  isActive: boolean;
}

export default function PlansPage() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [form] = Form.useForm<SubscriptionPlanFormValues>();

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

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
    } as Partial<SubscriptionPlanFormValues>);
    setModalVisible(true);
  };

  const handleOpenEdit = (record: SubscriptionPlan) => {
    setEditingPlan(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      durationDays: record.durationDays,
      limit: record.limit,
      isActive: record.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    try {
      setLoading(true);
      await subscriptionService.delete(plan.subscriptionId);
      message.success("Deleted subscription plan successfully");
      fetchPlans();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete subscription plan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        durationDays: values.durationDays,
        limit: values.limit,
        isActive: values.isActive, // 👈 đảm bảo gửi đúng tên field
      };

      if (editingPlan) {
        await subscriptionService.update(editingPlan.subscriptionId, payload);
        message.success("Updated subscription plan successfully");
      } else {
        await subscriptionService.create(payload);
        message.success("Created subscription plan successfully");
      }

      setModalVisible(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (err: any) {
      if (err?.errorFields) return;
      console.error(err);
      message.error("Failed to save subscription plan");
    } finally {
      setLoading(false);
    }
  };

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
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="link"
            onClick={() => handleOpenEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this plan?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
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
    <Card>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Subscription Plans
        </Title>

        <Space>
          <Button onClick={fetchPlans}>Reload</Button>
          <Button type="primary" onClick={handleOpenCreate}>
            New Plan
          </Button>
        </Space>
      </Space>

      <Table
        rowKey="subscriptionId"
        loading={loading}
        columns={columns}
        dataSource={plans}
      />

      <Modal
        open={modalVisible}
        title={
          editingPlan ? "Edit Subscription Plan" : "Create Subscription Plan"
        }
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form<SubscriptionPlanFormValues> form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Plan Name"
            rules={[{ required: true, message: "Please enter plan name" }]}
          >
            <Input placeholder="e.g. Basic, Pro, Enterprise" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Short description of the plan"
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (VND)"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="100000"
            />
          </Form.Item>

          <Form.Item
            name="durationDays"
            label="Duration (days)"
            rules={[
              { required: true, message: "Please enter duration (days)" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="30" />
          </Form.Item>

          <Form.Item
            name="limit"
            label="Limit"
            rules={[{ required: true, message: "Please enter limit" }]}
          >
            <Input placeholder='e.g. "Up to 50 jobs" or "Unlimited"' />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
