import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import AvatarUploader from "../Settings/components/AvatarUploader";
import JoinCompanyModal from "./JoinCompanyModal";
import { companyService } from "../../../services/companyService";
import {
  validateCompanyName,
  validateWebsite,
  validateAddress,
  validateTaxCode,
  validateDescription,
  validateDocumentType,
  validateFile,
  validateLogoFile,
} from "../../../utils/validations/company.validation";
import { toastError, toastSuccess } from "../../../components/UI/Toast";

interface CompanyFormValues {
  name: string;
  description?: string;
  address?: string;
  website?: string;
  taxCode?: string;
  documentFiles?: { file?: File }[];
  documentTypes?: string[];
}

export default function CompanyCreate() {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const handleLogoChange = (file: File | null) => {
    if (file) {
      const validation = validateLogoFile(file);
      if (!validation.isValid) {
        toastError("Invalid logo", validation.message);
        return;
      }
    }
    setLogoFile(file);
    form.setFieldsValue({ logoFile: file });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("address", values.address || "");
      formData.append("website", values.website || "");
      formData.append("taxCode", values.taxCode || "");

      const logoFromForm = form.getFieldValue("logoFile");
      const logoToSend = logoFromForm instanceof File ? logoFromForm : logoFile;
      if (logoToSend instanceof File) {
        formData.append("logoFile", logoToSend, logoToSend.name);
      }
      const documents = values.documents || [];
      const validDocs = documents.filter((d: any) => d?.type && d?.file instanceof File);
      if (validDocs.length === 0) {
        toastError("Missing documents", "Please provide at least one document with type and file.");
        setLoading(false);
        return;
      }

      validDocs.forEach((doc: any, idx: number) => {
        formData.append(`documentTypes[${idx}]`, doc.type);
        formData.append(`documentFiles`, doc.file, doc.file.name);
      });

      const resp = await companyService.createForm(formData);

      const statusStr = String(resp?.status || "").toLowerCase();
      if (statusStr === "401" || statusStr === "403" || statusStr.includes("unauthor")) {
        toastError("You are not authorized to perform this action. Please login or contact support.");
        navigate("/login");
        return;
      }

      if (String(resp?.status).toLowerCase() === "success") {
        toastSuccess("Company account creation request submitted successfully.");
        navigate("/company/pending-approval");
      } else {
        toastError("Failed to submit request", resp?.message);
      }
    } catch (err) {
      console.error(err);
      toastError("An error occurred while submitting the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJoin = () => setJoinModalOpen(true);

  return (
    <>
      <Card
        title={<div className="flex justify-between items-center w-full">
          <span className="font-semibold">Submit company account creation request</span>
          <div className="flex gap-2 items-center">
            <Button className="company-btn" onClick={handleOpenJoin}>
              Join your company
            </Button>
          </div>
        </div>}
        style={{
          maxWidth: 1200,
          marginTop: "12px",
          padding: "0 5px",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          height: 'calc(100% - 25px)',
        }}
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <div className="w-full">
          <Form<CompanyFormValues> form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ documents: [{}] }}>
            <Row gutter={32} align="stretch">
              <Col span={7}>
                <div
                  style={{
                    borderRight: "1px solid #e5e5e5",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingRight: 16,
                  }}
                >
                  <Form.Item
                    name="logoFile"
                    valuePropName="file"
                    getValueFromEvent={() => undefined}
                    rules={[
                      {
                        validator: () => {
                          const f = form.getFieldValue("logoFile") || logoFile;
                          return f ? Promise.resolve() : Promise.reject(new Error("Please upload a logo"));
                        },
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <AvatarUploader
                        initialUrl="https://placehold.co/120x120?text=Logo"
                        onFileChange={handleLogoChange}
                        hoverText="Upload logo"
                        size={130}
                      />
                    </div>
                  </Form.Item>
                </div>
              </Col>

              <Col span={17}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="Company name"
                      rules={[
                        { required: true, message: "Please enter the company name" },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const validation = validateCompanyName(value);
                            return validation.isValid
                              ? Promise.resolve()
                              : Promise.reject(new Error(validation.message));
                          }
                        }
                      ]}
                      style={{ marginBottom: 12 }}
                    >
                      <Input placeholder="Enter company name" maxLength={120} showCount/>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="website"
                      label="Website"
                      rules={[
                        { required: true, message: "Please enter a website URL" },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const validation = validateWebsite(value);
                            return validation.isValid
                              ? Promise.resolve()
                              : Promise.reject(new Error(validation.message));
                          }
                        }
                      ]}
                      style={{ marginBottom: 12 }}
                    >
                      <Input placeholder="https://example.com" maxLength={50} showCount/>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[
                        { required: true, message: "Please enter the company address" },
                        { max: 60, message: "Address must be at most 60 characters" },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const validation = validateAddress(value);
                            return validation.isValid
                              ? Promise.resolve()
                              : Promise.reject(new Error(validation.message));
                          }
                        }
                      ]}
                      style={{ marginBottom: 12 }}
                    >
                      <Input placeholder="Enter company address" maxLength={100} showCount/>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                        name="taxCode"
                        label="Tax Code"
                        rules={[
                          { required: true, message: "Please enter the tax code" },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.resolve();
                              const validation = validateTaxCode(value);
                              return validation.isValid
                                ? Promise.resolve()
                                : Promise.reject(new Error(validation.message));
                            }
                          }
                        ]}
                        style={{ marginBottom: 12 }}
                      >
                        <Input
                          placeholder="Enter tax code — valid: 10, 12, or 13 digits (e.g. 0123456789, 012345678901, or 0123456789-001)"
                          maxLength={14}
                          onChange={(e) => {
                            const raw = e.target.value || "";
                            const digits = raw.replace(/\D/g, "");
                            let formatted = digits;

                            if (digits.length > 10 && digits.length <= 13) {
                              formatted = digits.slice(0, 10) + "-" + digits.slice(10);
                            }

                            if (formatted.length > 14) formatted = formatted.slice(0, 14);
                            form.setFieldsValue({ taxCode: formatted });
                          }}
                        />
                      </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 6,
                  background: "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  height: 205,
                  overflow: "hidden",
                }}
              >
                <Form.List name="documents">
                  {(fields, { add, remove }) => (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontWeight: 500 }}>Attached documents (max 10 files) <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span></div>
                        <div style={{ fontSize: 12, color: '#666' }}>Files: {fields.length}/10</div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          overflowY: "auto",
                          paddingRight: 8,
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
                                  if ((fields || []).length >= 10) {
                                    message.error('You can add up to 10 documents only');
                                    return;
                                  }
                                  add();
                                }}
                                style={{
                                  fontSize: 18,
                                  color: "var(--color-primary-light)",
                                  cursor: "pointer",
                                }}
                              />
                            </div>

                            <Form.Item
                              {...field}
                              name={[field.name, "type"]}
                              style={{ flex: 1, marginBottom: 0 }}
                              rules={[
                                { required: true, message: "Please enter the document type" },
                                {
                                  validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const validation = validateDocumentType(value);
                                    return validation.isValid
                                      ? Promise.resolve()
                                      : Promise.reject(new Error(validation.message));
                                  }
                                }
                              ]}
                            >
                              <Input
                                placeholder="e.g.: Business license, Certificate of incorporation"
                                style={{
                                  borderRadius: 6,
                                }}
                                maxLength={100}
                              />
                            </Form.Item>

                            <Form.Item
                              name={[field.name, "file"]}
                              style={{ flex: 1, marginBottom: 0 }}
                              valuePropName="file"
                              getValueFromEvent={() => undefined}
                              rules={[
                                {
                                  validator: async () => {
                                    const docs = form.getFieldValue("documents") || [];
                                    const fileObj = docs[field.name]?.file;
                                    if (!fileObj) {
                                      return Promise.reject(new Error("Please select a document file"));
                                    }
                                    const validation = validateFile(fileObj);
                                    return validation.isValid
                                      ? Promise.resolve()
                                      : Promise.reject(new Error(validation.message));
                                  },
                                },
                              ]}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  height: 32,
                                  border: "1px solid #d9d9d9",
                                  borderRadius: 6,
                                  padding: "0 10px",
                                  display: "flex",
                                  alignItems: "center",
                                  background: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      form.getFieldValue(["documents", field.name, "file"])
                                        ? "#000"
                                        : "#9ca3af",
                                    fontSize: 14,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    pointerEvents: "none",
                                  }}
                                >
                                  {form.getFieldValue(["documents", field.name, "file"])?.name ||
                                    "Select document file"}
                                </span>

                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    opacity: 0,
                                    cursor: "pointer",
                                  }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    const fields = form.getFieldValue("documents") || [];

                                    if (!file) {
                                      fields[field.name] = { ...(fields[field.name] || {}), file: undefined };
                                      form.setFieldsValue({ documents: fields });
                                      form.setFields([
                                        {
                                          name: ["documents", field.name, "file"],
                                          errors: ["Please select a document file"],
                                        },
                                      ]);
                                      return;
                                    }

                                    const validation = validateFile(file);
                                    if (!validation.isValid) {
                                      fields[field.name] = { ...(fields[field.name] || {}), file: undefined };
                                      form.setFieldsValue({ documents: fields });
                                      form.setFields([
                                        {
                                          name: ["documents", field.name, "file"],
                                          errors: [validation.message || "Invalid document"],
                                        },
                                      ]);
                                      e.target.value = "";
                                      return;
                                    }

                                    fields[field.name] = { ...(fields[field.name] || {}), file };
                                    form.setFieldsValue({ documents: fields });
                                    form.setFields([
                                      {
                                        name: ["documents", field.name, "file"],
                                        errors: [],
                                      },
                                    ]);

                                    toastSuccess("Document selected", `Selected: ${file.name}`);
                                  }}
                                />
                              </div>
                            </Form.Item>

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
                                onClick={index === 0 ? undefined : () => remove(field.name)}
                                style={{
                                  fontSize: 18,
                                  color: index === 0 ? "#ccc" : "#ff4d4f",
                                  cursor: index === 0 ? "not-allowed" : "pointer",
                                }}
                              />
                            </div>
                          </div>
                        ))}

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
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ textAlign: "center", fontWeight: 600, marginTop: 4 }}>💡<b>Document Requirements:</b> </div>
                          <ul
                            style={{
                              margin: "4px 0 0 0",
                              padding: "0",
                              listStyle: "disc",
                              display: "inline-grid",
                              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                              gap: "6px 10px",
                              justifyItems: "start",
                            }}
                          >
                            <li style={{ textAlign: "left" }}><b>Required:</b> At least 2 documents must be provided (maximum 10 files)</li>
                            <li style={{ textAlign: "left" }}><b>Document types:</b> Business license, Certificate of incorporation, Tax registration, etc.</li>
                            <li style={{ textAlign: "left" }}><b>File format:</b> PDF, JPG, or PNG only</li>
                            <li style={{ textAlign: "left" }}><b>File size:</b> Maximum 10MB per file</li>

                          </ul>
                        </div>

                      </div>
                    </>
                  )}
                </Form.List>
              </div>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter company description" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const validation = validateDescription(value);
                      return validation.isValid
                        ? Promise.resolve()
                        : Promise.reject(new Error(validation.message));
                    }
                  }
                ]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Short introduction about the company (minimum 20 characters)"
                  showCount
                  maxLength={400}
                />
              </Form.Item>

              <div style={{ marginTop: 0, textAlign: "center" }}>
                <Form.Item>
                  <Button className="company-btn--filled" htmlType="submit" loading={loading}>
                    Submit request
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </Card>

      <JoinCompanyModal open={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </>
  );
}
