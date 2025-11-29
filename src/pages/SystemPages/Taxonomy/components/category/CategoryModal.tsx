import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { Category } from "../../../../../types/category.types";

interface CategoryModalProps {
  open: boolean;
  form: FormInstance;
  editing: Category | null;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function CategoryModal({
  open,
  form,
  editing,
  onCancel,
  onSubmit,
}: CategoryModalProps) {
  return (
    <Modal
      open={open}
      title={editing ? "Edit Category" : "Create Category"}
      onCancel={onCancel}
      onOk={onSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter category name" },
            { max: 255, message: "Max length is 255 characters" },
          ]}
        >
          <Input placeholder="Ex: Software Development" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
