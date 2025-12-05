import { Modal, Form, Input, Select, Button } from "antd";
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
      footer={null}
      destroyOnClose
      centered
      className="system-modal"
    >
      <Form form={form} layout="vertical">
        {/* Section label nhỏ cho đẹp */}
        <div className="system-modal-section-title">
          Account information
        </div>

        <div className="system-modal-grid">
          {/* Hàng 1: 2 cột */}
          <Form.Item
            name="email"
            label="Email"
            className="system-modal-grid-item"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Full name"
            className="system-modal-grid-item"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          {/* Hàng 2: full width */}
          <Form.Item
            name="password"
            label="Password"
            className="system-modal-grid-item full-row"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          {/* Hàng 3: full width */}
          <Form.Item
            name="roleId"
            label="Role"
            className="system-modal-grid-item full-row"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select
              placeholder="Select role"
              options={roleOptions}
              dropdownClassName="system-role-dropdown"
              allowClear
            />
          </Form.Item>
        </div>

        {/* Footer custom */}
        <div className="system-modal-footer">
          <Button
            onClick={onCancel}
            className="system-modal-btn system-modal-btn-cancel"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            onClick={onCreate}
            className="system-modal-btn system-modal-btn-primary"
          >
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
