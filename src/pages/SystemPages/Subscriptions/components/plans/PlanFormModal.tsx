import { Form, Input, InputNumber, Modal, Button, Select } from "antd";
import type { FormInstance } from "antd";
import type { SubscriptionPlan } from "../../../../../types/subscription.types";

export interface SubscriptionPlanFormValues {
  name: string;
  description?: string | null;
  price: number;
  duration: string;
  resumeLimit: number;
  hoursLimit: number;
  compareLimit: number;
  compareHoursLimit: number;
  stripePriceId: string;
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
      footer={null}
      destroyOnClose
      centered
      className="system-modal"
    >
      <Form<SubscriptionPlanFormValues> form={form} layout="vertical">
        <div className="system-modal-section-title">PLAN INFORMATION</div>

        <div className="system-modal-grid">
          <Form.Item
            name="name"
            label="Plan name"
            rules={[{ required: true, message: "Please enter plan name" }]}
            className="system-modal-grid-item full-row"
          >
            <Input placeholder="Basic / Pro / Enterprise" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            className="system-modal-grid-item full-row"
          >
            <Input.TextArea rows={3} placeholder="Short description..." />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (USD cents)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "Daily", value: "Daily" },
                { label: "Weekly", value: "Weekly" },
                { label: "Monthly", value: "Monthly" },
                { label: "Yearly", value: "Yearly" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="resumeLimit"
            label="Resume Limit"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="hoursLimit"
            label="Hours Limit"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="compareLimit"
            label="Compare Limit"
            rules={[{ required: true, message: "Please enter compare limit" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="compareHoursLimit"
            label="Compare Hours Limit"
            rules={[
              { required: true, message: "Please enter compare hours limit" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="stripePriceId"
            label="Stripe Price ID"
            rules={[{ required: true }]}
            className="system-modal-grid-item full-row"
          >
            <Input placeholder="price_xxxxxxxxx" />
          </Form.Item>
        </div>

        {/* Footer same as Create User */}
        <div className="system-modal-footer">
          <Button
            onClick={onCancel}
            className="system-modal-btn system-modal-btn-cancel"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            loading={loading}
            onClick={onSubmit}
            className="system-modal-btn system-modal-btn-primary"
          >
            {editingPlan ? "Save changes" : "Create plan"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
