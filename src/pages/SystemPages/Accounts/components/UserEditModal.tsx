import { Modal, Form, Input, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import type { UpdateUserRequest } from "../../../../types/user.types";

interface UserEditModalProps {
  open: boolean;
  form: FormInstance<UpdateUserRequest>;
  roleOptions: { label: string; value: number }[];
  email?: string;
  onCancel: () => void;
  onUpdate: () => void;
}

export default function UserEditModal({
  open,
  form,
  roleOptions,
  onCancel,
  onUpdate,
}: UserEditModalProps) {
  return (
    <Modal
      open={open}
      title={`Edit user`}
      onCancel={onCancel}
      onOk={onUpdate}
      okText="Save"
      cancelText="Cancel"
      destroyOnClose
      centered
      className="system-modal" // 🔹 dùng chung style với create
    >
      <div className="system-modal-section-title">ACCOUNT INFORMATION</div>

      <Form form={form} layout="vertical">
        <div className="system-modal-grid-2">
          <Form.Item
            name="fullName"
            label="Full name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
            <Select
              options={roleOptions}
              className="system-role-select"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
