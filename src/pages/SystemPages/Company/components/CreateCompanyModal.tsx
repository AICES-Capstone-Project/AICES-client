import { Button, Form, Input, Modal, Upload } from "antd";
import type { FormInstance } from "antd/es/form";
import { UploadOutlined } from "@ant-design/icons";

interface CreateCompanyModalProps {
  open: boolean;
  loading: boolean;
  form: FormInstance;
  onCancel: () => void;
  onCreate: () => void;
}

export default function CreateCompanyModal({
  open,
  loading,
  form,
  onCancel,
  onCreate,
}: CreateCompanyModalProps) {
  return (
    <Modal
      open={open}
      title="Create Company"
      onCancel={onCancel}
      onOk={onCreate}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input company name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Website" name="websiteUrl">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item label="Tax Code" name="taxCode">
          <Input />
        </Form.Item>

        <Form.Item
          label="Logo"
          name="logoFile"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
            <Button icon={<UploadOutlined />}>Select logo</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Document File"
          name="documentFiles"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[
            {
              required: true,
              message: "Please upload at least one document file",
            },
          ]}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button>Select file</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Document Type"
          name="documentType"
          rules={[{ required: true, message: "Please input document type" }]}
        >
          <Input placeholder="e.g. BusinessLicense" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
