import { Form, Input, InputNumber, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { Specialization } from "../../../../../types/specialization.types";

interface SpecializationModalProps {
  open: boolean;
  form: FormInstance;
  editingSpecialization: Specialization | null;
  onOk: () => void;
  onCancel: () => void;
}

export default function SpecializationModal({
  open,
  form,
  editingSpecialization,
  onOk,
  onCancel,
}: SpecializationModalProps) {
  return (
    <Modal
      title={
        editingSpecialization
          ? "Edit Specialization"
          : "Create Specialization"
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: "", categoryId: undefined }}
      >
        <Form.Item
          name="name"
          label="Specialization Name"
          rules={[
            { required: true, message: "Name is required" },
            { max: 255, message: "Max 255 characters" },
          ]}
        >
          <Input placeholder="e.g. Backend Development" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category ID"
          rules={[
            { required: true, message: "Category ID is required" },
            { type: "number", min: 1, message: "Category ID must be > 0" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter category ID"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
