// src/pages/SystemPages/Subscriptions/components/plans/PlanFormModal.tsx

import { Form, Input, InputNumber, Modal, Switch } from "antd";
import type { FormInstance } from "antd";
import type { SubscriptionPlan } from "../../../../../types/subscription.types";

export interface SubscriptionPlanFormValues {
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  limit: string;
  isActive: boolean;
}

interface PlanFormModalProps {
  open: boolean;
  loading: boolean;
  editingPlan: SubscriptionPlan | null;
  form: FormInstance<SubscriptionPlanFormValues>;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function PlanFormModal({
  open,
  loading,
  editingPlan,
  form,
  onCancel,
  onSubmit,
}: PlanFormModalProps) {
  return (
    <Modal
      open={open}
      title={
        editingPlan ? "Edit Subscription Plan" : "Create Subscription Plan"
      }
      onCancel={onCancel}
      onOk={onSubmit}
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
          <InputNumber min={0} style={{ width: "100%" }} placeholder="100000" />
        </Form.Item>

        <Form.Item
          name="durationDays"
          label="Duration (days)"
          rules={[{ required: true, message: "Please enter duration (days)" }]}
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
  );
}
