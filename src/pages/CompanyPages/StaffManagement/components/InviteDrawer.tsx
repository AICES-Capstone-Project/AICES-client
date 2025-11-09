import React from "react";
import { Drawer, Form, Input, Button } from "antd";
import { MailOutlined, SendOutlined } from "@ant-design/icons";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { email: string }) => void;
  submitting?: boolean;
};

const InviteDrawer: React.FC<Props> = ({ open, onClose, onSubmit, submitting }) => {
  const [form] = Form.useForm();

  return (
    <Drawer title="Invite New Staff Member" placement="right" width={380} onClose={onClose} open={open}>
      <Form form={form} layout="vertical" onFinish={(v) => { onSubmit(v); form.resetFields(); }}>
        <Form.Item
          name="email"
          label="Staff email"
          rules={[
            { required: true, message: "Please enter an email address" },
            { type: "email", message: "Please enter a valid email address" },
            { pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Only Gmail addresses are allowed" },
          ]}
        >
          <Input size="large" prefix={<MailOutlined />} placeholder="Enter email address (e.g. example@gmail.com)" />
        </Form.Item>

        <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={submitting} block>
          Send Invitation
        </Button>
      </Form>
    </Drawer>
  );
};

export default InviteDrawer;
