import { Button, Form, Input, Modal, Upload, Row, Col, message } from "antd";
import type { FormInstance } from "antd/es/form";
import {
  UploadOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";

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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  return (
    <Modal
      open={open}
      title="Create Company"
      onCancel={onCancel}
      footer={null}
      width={900}
      className="system-modal"
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ documents: [{}] }}>
        <div className="system-modal-section-title">BASIC INFORMATION</div>

        {/* LOGO + BASIC FIELDS */}
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item label="Logo">
              <div className="company-logo-preview">
                {logoPreview ? (
                  <img src={logoPreview} className="company-logo-img" />
                ) : (
                  <span className="company-logo-placeholder">Logo</span>
                )}
              </div>

              <Form.Item
                name="logoFile"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e?.fileList
                }
                noStyle
              >
                <Upload
                  beforeUpload={(file) => {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                      setLogoPreview(e.target?.result as string);
                    reader.readAsDataURL(file);

                    return false;
                  }}
                  maxCount={1}
                  accept="image/*"
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Select logo</Button>
                </Upload>
              </Form.Item>
            </Form.Item>
          </Col>

          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Company Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter name" }]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Website" name="websiteUrl">
                  <Input placeholder="https://example.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Address" name="address">
                  <Input placeholder="Enter address" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Tax Code" name="taxCode">
                  <Input placeholder="Tax code" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* DOCUMENTS */}
        <div className="system-modal-section-title">ATTACHED DOCUMENTS</div>

        <div className="company-documents-wrapper">
          <Form.List name="documents">
            {(fields, { add, remove }) => (
              <>
                <div className="company-documents-list">
                  {fields.map((field, index) => (
                    <div className="company-doc-item" key={field.key}>
                      <PlusCircleOutlined
                        className="company-doc-icon add"
                        onClick={() => {
                          if (fields.length >= 10)
                            return message.warning("Max 10 documents allowed");
                          add();
                        }}
                      />

                      <Form.Item
                        {...field}
                        name={[field.name, "type"]}
                        className="company-doc-type"
                        rules={[{ required: true, message: "Document type required" }]}
                      >
                        <Input placeholder="Business license, Registration certificate..." />
                      </Form.Item>

                      <Form.Item className="company-doc-file">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="company-file-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const docs = form.getFieldValue("documents") || [];
                            docs[field.name] = {
                              ...(docs[field.name] || {}),
                              file,
                            };
                            form.setFieldsValue({ documents: docs });
                          }}
                        />
                      </Form.Item>

                      <MinusCircleOutlined
                        className={`company-doc-icon remove ${
                          index === 0 ? "disabled" : ""
                        }`}
                        onClick={index === 0 ? undefined : () => remove(field.name)}
                      />
                    </div>
                  ))}
                </div>

                <div className="company-doc-note">
                  💡 <b>Document requirements:</b>
                  <ul>
                    <li>PDF, JPG or PNG</li>
                    <li>Max size 10MB</li>
                    <li>At least 1 document required</li>
                  </ul>
                </div>
              </>
            )}
          </Form.List>
        </div>

        {/* DESCRIPTION */}
        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Short introduction about the company"
            showCount
            maxLength={1000}
          />
        </Form.Item>

        {/* FOOTER */}
        <div className="system-modal-footer">
          <Button
            className="system-modal-btn system-modal-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="system-modal-btn system-modal-btn-primary"
            type="primary"
            loading={loading}
            onClick={onCreate}
          >
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
