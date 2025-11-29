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
      onOk={onCreate}
      confirmLoading={loading}
      width={1000} // 👈 popup ngang, rộng ra
      bodyStyle={{ paddingBottom: 8 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ documents: [{}] }} // có sẵn 1 dòng document
      >
        {/* ====== HÀNG TRÊN: LOGO + THÔNG TIN CƠ BẢN ====== */}
        <Row gutter={24} align="top">
          {/* Logo bên trái */}
          <Col span={6}>
            <Form.Item label="Logo">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                {/* Khung preview */}
                <div
                  style={{
                    width: 120,
                    height: 120,
                    border: "1px dashed #d9d9d9",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "#fafafa",
                  }}
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>Logo</span>
                  )}
                </div>

                {/* Form control thật sự (noStyle) */}
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
                      reader.onload = (e) => {
                        setLogoPreview(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);

                      // Không upload ngay, chỉ lưu vào Form
                      return false;
                    }}
                    maxCount={1}
                    accept="image/*"
                    showUploadList={false} // ẩn list text xám
                  >
                    <Button icon={<UploadOutlined />}>Select logo</Button>
                  </Upload>
                </Form.Item>
              </div>
            </Form.Item>
          </Col>

          {/* Name, Website, Address, TaxCode bên phải */}
          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input company name" },
                  ]}
                >
                  <Input />
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
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Tax Code" name="taxCode">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* ====== ATTACHED DOCUMENTS ====== */}
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 12,
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            height: 185,
            overflow: "hidden",
          }}
        >
          <label
            style={{
              fontWeight: 500,
              display: "block",
              marginBottom: 8,
            }}
          >
            Attached documents
            <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>
          </label>

          <Form.List name="documents">
            {(fields, { add, remove }) => (
              <>
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: 8,
                    marginBottom: 12,
                  }}
                >
                  {fields.map((field, index) => (
                    <div
                      key={field.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 16,
                        marginBottom: 8,
                      }}
                    >
                      {/* nút + */}
                      <div
                        style={{
                          width: 40,
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 40,
                          flexShrink: 0,
                        }}
                      >
                        <PlusCircleOutlined
                          onClick={() => {
                            if (fields.length >= 10) {
                              message.warning(
                                "You can upload up to 10 documents only"
                              );
                              return;
                            }
                            add();
                          }}
                          style={{
                            fontSize: 18,
                            color: "#1677ff",
                            cursor: "pointer",
                          }}
                        />
                      </div>

                      {/* Document type */}
                      <Form.Item
                        {...field}
                        name={[field.name, "type"]}
                        style={{ flex: 1, marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: "Please input document type",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g.: Business license, Certificate of incorporation"
                          style={{ height: 40, borderRadius: 6 }}
                        />
                      </Form.Item>

                      {/* File input */}
                      <Form.Item style={{ flex: 1, marginBottom: 0 }}>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{
                            display: "block",
                            height: 40,
                            lineHeight: "38px",
                            padding: "0 10px",
                            border: "1px solid #d9d9d9",
                            borderRadius: 6,
                            width: "100%",
                            cursor: "pointer",
                            background: "#fff",
                          }}
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

                      {/* nút - */}
                      <div
                        style={{
                          width: 40,
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 40,
                          flexShrink: 0,
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={
                            index === 0 ? undefined : () => remove(field.name)
                          }
                          style={{
                            fontSize: 18,
                            color: index === 0 ? "#ccc" : "#ff4d4f",
                            cursor: index === 0 ? "not-allowed" : "pointer",
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Note nhỏ giống bên Yến */}
                  <div
                    style={{
                      fontSize: 12,
                      color: "#666",
                      background: "#fff",
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px dashed #ccc",
                      margin: "0 auto 10px",
                      lineHeight: 1.4,
                      width: "80%",
                      textAlign: "left",
                    }}
                  >
                    💡 <b>Document Requirements:</b>
                    <ul
                      style={{
                        margin: "4px 0 0 0",
                        padding: "0 0 0 16px",
                        listStyle: "disc",
                      }}
                    >
                      <li>
                        <b>File format:</b> PDF, JPG, or PNG only
                      </li>
                      <li>
                        <b>File size:</b> Maximum 10MB per file
                      </li>
                      <li>
                        <b>Document types:</b> Business license, Certificate of
                        incorporation, Tax registration, etc.
                      </li>
                      <li>
                        <b>Required:</b> At least 1 document must be provided
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </Form.List>
        </div>

        {/* ====== DESCRIPTION ====== */}
        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Short introduction about the company (minimum 20 characters)"
            showCount
            maxLength={1000}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
