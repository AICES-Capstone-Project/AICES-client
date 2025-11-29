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
  email,
  onCancel,
  onUpdate,
}: UserEditModalProps) {
  return (
    <Modal
      open={open}
      title={`Edit user: ${email || ""}`}
      onCancel={onCancel}
      onOk={onUpdate}
      okText="Save"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fullName"
          label="Full name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
          <Select options={roleOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
