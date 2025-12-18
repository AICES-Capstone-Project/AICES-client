// UserCreateModal.tsx
import { Modal, Form, Input, Select, Button } from "antd";
import type { FormInstance } from "antd/es/form";
import type { CreateUserRequest } from "../../../../types/user.types";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

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
        <div className="system-modal-section-title">Account information</div>

        <div className="system-modal-grid">
          <Form.Item
            name="email"
            label="Email"
            className="system-modal-grid-item"
            rules={[
              { required: true, message: "Email is required." },
              { type: "email", message: "Invalid email format." },
              { min: 5, message: "Email must be at least 5 characters." },
              { max: 255, message: "Email cannot exceed 255 characters." },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Full name"
            className="system-modal-grid-item"
            rules={[
              { required: true, message: "Full name is required." },
              { min: 2, message: "Full name must be at least 2 characters." },
              { max: 100, message: "Full name cannot exceed 100 characters." },
            ]}
          >
            <Input placeholder="Nguyen Van FPT" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            className="system-modal-grid-item full-row"
            rules={[
              { required: true, message: "Password is required." },
              { min: 8, message: "Password must be at least 8 characters." },
              { max: 100, message: "Password cannot exceed 100 characters." },
              {
                pattern: PASSWORD_REGEX,
                message:
                  "Password must include one uppercase, one lowercase, one number, and one special character.",
              },
            ]}
          >
            <Input.Password placeholder="Abc@12345" />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role"
            className="system-modal-grid-item full-row"
            rules={[{ required: true, message: "Role ID is required." }]}
          >
            <Select
              placeholder="Select role"
              options={roleOptions}
              dropdownClassName="system-role-dropdown"
              allowClear
            />
          </Form.Item>
        </div>

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
