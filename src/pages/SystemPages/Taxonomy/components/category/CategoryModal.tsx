import { Form, Input, Modal, Button } from "antd";
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
      footer={null}
      destroyOnClose
      centered
      className="system-modal"
    >
      <div className="system-modal-section-title">CATEGORY INFORMATION</div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter category name" },
            { max: 255, message: "Max length is 255 characters" },
          ]}
        >
          <Input placeholder="e.g. Software Development" />
        </Form.Item>

        <div className="system-modal-footer">
          <Button className="system-modal-btn system-modal-btn-cancel" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            type="primary"
            className="system-modal-btn system-modal-btn-primary"
            onClick={onSubmit}
          >
            {editing ? "Save changes" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
