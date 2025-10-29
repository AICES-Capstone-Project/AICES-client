import { useState } from "react";
import { Form, Input, Button, message, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import AvatarUploader from "../Settings/components/AvatarUploader";
import { companyService } from "../../../services/companyService";

interface CompanyFormValues {
  name: string;
  description?: string;
  address?: string;
  website?: string;
  documentFiles?: { file?: File }[];
  documentTypes?: string[];
}

export default function CompanyCreate() {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Build FormData for file upload
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("address", values.address || "");
      formData.append("website", values.website || "");

      if (logoFile) {
        formData.append("logoFile", logoFile, logoFile.name);
      }

      // documents is expected as an array of { type, file }
      const documents = values.documents || [];

      // Validate at least one document with both type and file
      const validDocs = documents.filter((d: any) => d?.type && d?.file instanceof File);
      if (validDocs.length === 0) {
        message.error("Please provide at least one document with type and file.");
        setLoading(false);
        return;
      }

      validDocs.forEach((doc: any, idx: number) => {
        formData.append(`documentTypes[${idx}]`, doc.type);
        formData.append(`documentFiles`, doc.file, doc.file.name);
      });

      // Log FormData content
      console.log("[API SUBMIT] FormData content:");
      for (const pair of (formData as any).entries()) {
        // If file, log name and type
        if (pair[1] instanceof File) {
          console.log(pair[0], `File(name=${pair[1].name}, type=${pair[1].type}, size=${pair[1].size})`);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const resp = await companyService.createForm(formData);
      console.log("[API RESPONSE]", resp);
      if (String(resp?.status).toLowerCase() === "success") {
        message.success("Company account creation request submitted successfully.");
        // Navigate to pending approval screen
        navigate("/company/pending-approval");
      } else {
        message.error(resp?.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      message.error("An error occurred while submitting the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<div style={{ textAlign: "center", width: "100%" }}>Submit company account creation request</div>}
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        padding: "0 5px",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
      bodyStyle={{
        paddingBottom: 0,
      }}
    >
      <div className="w-full">
  <Form<CompanyFormValues> form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ documents: [{}] }}>
          {/* === ROW 1: Logo - Name + Website === */}
          <Row gutter={32} align="stretch">
            {/* LEFT - LOGO */}
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
                <Form.Item style={{ marginBottom: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    {/* <span style={{ fontWeight: 500 }}> <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>Company logo</span> */}
                    <AvatarUploader
                      initialUrl="https://placehold.co/120x120?text=Logo"
                      onFileChange={(file: File | null) => setLogoFile(file)}
                      size={120}
                    />
                  </div>
                </Form.Item>
              </div>
            </Col>

            {/* RIGHT - INFORMATION */}
            <Col span={17}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Company name"
                    rules={[{ required: true, message: "Please enter the company name" }]}
                    style={{ marginBottom: 12 }}
                  >
                    <Input placeholder="Enter company name" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="website"
                    label="Website"
                    rules={[{ required: true, type: "url", message: "Please enter a valid URL" }]}
                    style={{ marginBottom: 12 }}
                  >
                    <Input placeholder="https://example.com" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Address */}
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter the company address" }]}
                style={{ marginBottom: 12 }}
              >
                <Input placeholder="Enter company address" />
              </Form.Item>
            </Col>
          </Row>

          {/* === ROW 2: Full width section below === */}
          <div style={{ marginTop: 24 }}>
            {/* Attached documents */}
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
                          {/* Add button (+) */}
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
                              onClick={() => add()}
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
                            rules={[{ required: true, message: "Please enter the document type" }]}
                          >
                            <Input
                              placeholder="e.g.: Business license"
                              style={{
                                height: 40,
                                borderRadius: 6,
                              }}
                            />
                          </Form.Item>

                          {/* Upload file (do not bind input value to Form.Item) */}
                          <Form.Item style={{ flex: 1, marginBottom: 0 }}>
                            <input
                              type="file"
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
                                if (file) {
                                  // set this file into the form field for documents[index].file
                                  const fields = form.getFieldValue("documents") || [];
                                  fields[field.name] = { ...(fields[field.name] || {}), file };
                                  form.setFieldsValue({ documents: fields });
                                  message.success(`Selected: ${file.name}`);
                                }
                              }}
                            />
                          </Form.Item>

                          {/* Remove button (-) */}
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

                      {/* 🔹 Note (short, centered) */}
                      <div
                        style={{
                          fontSize: 12,
                          color: "#666",
                          background: "#fff",
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: "1px dashed #ccc",
                          margin: "0 auto 10px",
                          lineHeight: 1.4,
                          width: "60%",
                          textAlign: "center",
                        }}
                      >
                        💡 <b>Note:</b> Please upload the required company documents.
                        <ul
                          style={{
                            margin: "4px auto 0",
                            padding: 0,
                            listStyle: "none",
                            textAlign: "center",
                          }}
                        >
                          <li>Only <b>PDF</b> or <b>JPG/PNG</b> file formats are accepted.</li>
                          <li> <b>Required:</b> at least <b>1 document type</b> must be provided.</li>
                        </ul>
                      </div>

                    </div>
                  </>
                )}
              </Form.List>
            </div>


            {/* Description */}
            <Form.Item name="description" label="Description" required
              rules={[{ required: true, message: "Please upload the required documents" }]}>
              <Input.TextArea rows={2} placeholder="Short introduction about the company" />
            </Form.Item>

            <div style={{ marginTop: 0, textAlign: "center" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit request
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </Card>
  );
}
