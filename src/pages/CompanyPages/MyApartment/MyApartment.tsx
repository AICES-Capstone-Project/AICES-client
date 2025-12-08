import { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Card, Row, Col, Modal, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import AvatarUploader from "../Settings/components/AvatarUploader";
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
import { toastError, toastSuccess, toastWarning } from "../../../components/UI/Toast";

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
  const logoutTimerRef = useRef<number | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Join company modal state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  // Handle logo file change with validation
  const handleLogoChange = (file: File | null) => {
    if (file) {
      const validation = validateLogoFile(file);
      if (!validation.isValid) {
        toastError("Invalid logo", validation.message);
        return;
      }
    }
    setLogoFile(file);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Quick client-side check: ensure we have an access token
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (!token) {
        toastError("Authentication required", "You must be logged in to submit a company request. Please login first.");
        setLoading(false);
        navigate("/login");
        return;
      }
      // Build FormData for file upload
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("address", values.address || "");
      formData.append("website", values.website || "");
      formData.append("taxCode", values.taxCode || "");

      if (logoFile) {
        formData.append("logoFile", logoFile, logoFile.name);
      }

      // documents is expected as an array of { type, file }
      const documents = values.documents || [];

      // Validate at least one document with both type and file
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

      // Handle HTTP status codes returned by request wrapper (it may return numeric status)
      const statusStr = String(resp?.status || "").toLowerCase();
      if (statusStr === "401" || statusStr === "403" || statusStr.includes("unauthor")) {
        toastError("Unauthorized", "You are not authorized to perform this action. Please login or contact support.");
        // force redirect to login to refresh credentials
        navigate("/login");
        return;
      }

      if (String(resp?.status).toLowerCase() === "success") {
        toastSuccess("Company request submitted", "Company account creation request submitted successfully.");
        // Inform user they will need to re-login and schedule an auto-logout in 10 seconds
        toastWarning("Session refresh required", "You will be logged out in 10 seconds. Please log in again to refresh your session.");
        // Navigate to pending approval screen
        navigate("/company/pending-approval");
        // Schedule auto-logout after 10 seconds
        if (typeof window !== "undefined") {
          // store timer id so we can clear it on unmount
          logoutTimerRef.current = window.setTimeout(() => {
            try {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
            } catch (err) {
              // ignore
            }
            navigate("/login");
          }, 10 * 1000);
        }
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

  // Fetch companies for join modal
  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    try {
      // Try public companies endpoint first (no auth required)
      const publicResp = await companyService.getPublicCompanies();
      console.debug("[MyApartment] getPublicCompanies response:", publicResp);
      if (publicResp?.status === "Success" && Array.isArray(publicResp.data)) {
        setCompanies(publicResp.data || []);
        return;
      }

      // Fallback to admin paginated endpoint
      const resp = await companyService.getAll({ page: 1, pageSize: 1000 });
      console.debug("[MyApartment] getAll response:", resp);
      if (resp?.status === "Success" && resp.data && Array.isArray((resp.data as any).items)) {
        setCompanies((resp.data as any).items || []);
        return;
      }

      // Final fallback to older list endpoint
      const fallback = await companyService.getCompanies();
      console.debug("[MyApartment] getCompanies fallback response:", fallback);
      if (fallback?.status === "Success" && Array.isArray(fallback.data)) {
        setCompanies(fallback.data || []);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.error(err);
      setCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleOpenJoin = () => {
    setJoinModalOpen(true);
    fetchCompanies();
  };

  const handleConfirmJoin = async () => {
    if (!selectedCompanyId) {
      toastWarning("Please select a company to join");
      return;
    }
    try {
      const resp = await companyService.joinCompany(selectedCompanyId);
      if (String(resp?.status).toLowerCase() === "success") {
        toastSuccess("Join request submitted successfully");
        setJoinModalOpen(false);
        navigate("/company/pending-approval");
      } else {
        toastError("Failed to submit join request", resp?.message);
      }
    } catch (err) {
      console.error(err);
      toastError("An error occurred while joining the company");
    }
  };

  // Clear scheduled logout timer if component unmounts
  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, []);

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
                        onFileChange={handleLogoChange}
                        size={130}
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
                      <Input placeholder="Enter company name" />
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
                      <Input placeholder="https://example.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* Address */}
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
                      <Input placeholder="Enter company address" maxLength={60} />
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
                      <Input placeholder="Enter tax code (10 digits)" />
                    </Form.Item>
                  </Col>
                </Row>

              </Col>
            </Row>

            {/* === ROW 2: Full width section below === */}
            <div style={{ marginTop: 12 }}>
              {/* Attached documents */}
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
                                  color: "var(--color-primary-light)",
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
                              />
                            </Form.Item>

                            {/* Upload file (do not bind input value to Form.Item) */}
                            <Form.Item
                              name={[field.name, "file"]}
                              style={{ flex: 1, marginBottom: 0 }}
                              valuePropName="file"
                              getValueFromEvent={() => undefined}
                              rules={[
                                {
                                  validator: async () => {
                                    // we read the file from form state instead of the validator value
                                    const fields = form.getFieldValue("documents") || [];
                                    const fileObj = fields[field.name]?.file;
                                    if (!fileObj) {
                                      return Promise.reject(new Error("Please select a document file"));
                                    }
                                    const validation = validateFile(fileObj);
                                    return validation.isValid ? Promise.resolve() : Promise.reject(new Error(validation.message));
                                  },
                                },
                              ]}
                            >
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                style={{
                                  display: "block",
                                  height: "32px",
                                  lineHeight: "32px",
                                  padding: "0 10px",
                                  border: "1px solid #d9d9d9",
                                  borderRadius: 6,
                                  width: "100%",
                                  cursor: "pointer",
                                  background: "#fff",
                                  color: "#bfbfbf",
                                }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  const fields = form.getFieldValue("documents") || [];
                                  if (!file) {
                                    // clear file value and set error
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

                                  // Validate file
                                  const validation = validateFile(file);
                                  if (!validation.isValid) {
                                    // set error on the specific field so Ant displays it inline
                                    fields[field.name] = { ...(fields[field.name] || {}), file: undefined };
                                    form.setFieldsValue({ documents: fields });
                                    form.setFields([
                                      {
                                        name: ["documents", field.name, "file"],
                                        errors: [validation.message || "Invalid document"],
                                      },
                                    ]);
                                    e.target.value = ""; // Clear the input
                                    return;
                                  }

                                  // Valid file: clear any previous errors and set the file into the form field
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
                            <li style={{ textAlign: "left" }}><b>Required:</b> At least 2 documents must be provided</li>
                            <li style={{ textAlign: "left" }}><b>File format:</b> PDF, JPG, or PNG only</li>
                            <li style={{ textAlign: "left" }}><b>File size:</b> Maximum 10MB per file</li>
                            <li style={{ textAlign: "left" }}><b>Document types:</b> Business license, Certificate of incorporation, Tax registration, etc.</li>
                          </ul>
                        </div>

                      </div>
                    </>
                  )}
                </Form.List>
              </div>


              {/* Description */}
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
                  maxLength={150}
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
      {/* Join Company Modal */}
      <Modal
        title="Join a Company"
        open={joinModalOpen}
        onCancel={() => setJoinModalOpen(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button key="cancel" className="company-btn" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>,
            <Button key="join" className="company-btn--filled" onClick={handleConfirmJoin}>
              Join
            </Button>
          </div>

        }
      >
        {companiesLoading ? (
          <div style={{ textAlign: 'center' }}><Spin /></div>
        ) : (
          <Select
            className="join-company-select"
            style={{ width: '100%' }}
            placeholder="Select a company to join"
            value={selectedCompanyId || undefined}
            onChange={(val) => setSelectedCompanyId(Number(val))}
            options={companies.map((c) => ({ label: c.name, value: c.companyId }))}
          />
        )}
      </Modal>
    </>
  );
}
