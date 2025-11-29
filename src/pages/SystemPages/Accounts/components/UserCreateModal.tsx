import { Modal, Form, Input, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import type { CreateUserRequest } from "../../../../types/user.types";

interface UserCreateModalProps {
  open: boolean;
  form: FormInstance<CreateUserRequest>;
  roleOptions: { label: string; value: number }[];
  onCancel: () => void;
  onCreate: () => void;
}

export default function UserCreateModal({
  open,
  form,
  roleOptions,
  onCancel,
  onCreate,
}: UserCreateModalProps) {
  return (
    <Modal
      open={open}
      title="Create user"
      onCancel={onCancel}
      onOk={onCreate}
      okText="Create"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Full name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
          <Select options={roleOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
