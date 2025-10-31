import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message, Modal } from "antd";
import { companyService } from "../../../services/companyService";

interface CompanyData {
  companyId: number;
  name: string;
  description?: string;
  address?: string;
  websiteUrl?: string;
  taxCode?: string | null;
  logoUrl?: string;
  companyStatus: string;
  rejectionReason?: string | null;
  documents?: { documentType: string; fileUrl: string }[];
}

export default function CompanyView() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await companyService.getSelf();
        if (resp?.status === "success" || resp?.status === "Success") {
          setCompany(resp.data);
        } else {
          message.error("Failed to load company details");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching company details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        No company data found.
      </div>
    );
  }

  const handlePreview = (fileUrl: string, type: string) => {
    setPreviewUrl(fileUrl);
    setPreviewType(type);
    setPreviewVisible(true);
  };

  return (
    <>
      <Card
        title={<div style={{ textAlign: "center", width: "100%" }}>Company Information</div>}
        style={{
          maxWidth: 1200,
          margin: "20px auto",
          padding: "0 5px",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={32}>
          {/* LEFT: Logo */}
          <Col span={5} style={{ textAlign: "center" }}>
            <img
              src={company.logoUrl || "https://placehold.co/200x200?text=Logo"}
              alt="Company Logo"
              style={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: "10%",
                border: "1px solid #ddd",
              }}
            />
          </Col>

          {/* RIGHT: Info */}
          <Col span={19} style={{ padding: "0 6px" }}>
            <div style={{ marginBottom: 8 }}>
              <b>Company name:</b> <span>{company.name}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Website:</b> <span>{company.websiteUrl || "N/A"}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Address:</b> <span>{company.address || "N/A"}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Tax code:</b> <span>{company.taxCode || "N/A"}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>HR Manager:</b> <span>{"N/A"}</span>
            </div>
            <div>
              <b>Description:</b> <span>{company.description || "N/A"}</span>
            </div>
          </Col>
        </Row>

        {/* Documents */}
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: "16px 24px",
            marginTop: 24,
            background: "#fafafa",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              marginBottom: 16,
              fontSize: 16,
            }}
          >
            Attached documents
          </p>

          {company.documents && company.documents.length > 0 ? (
            <div
              style={{
                maxWidth: 450,
                margin: "0 auto",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 600,
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ width: "10%" }}>No</span>
                <span style={{ width: "60%" }}>Document Type</span>
                <span style={{ width: "30%", textAlign: "right" }}>Action</span>
              </div>

              {company.documents.map((doc, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom:
                      index !== (company.documents?.length || 0) - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <span style={{ width: "10%" }}>{index + 1}</span>
                  <span style={{ width: "60%", fontWeight: 500 }}>
                    {doc.documentType}
                  </span>
                  <a
                    style={{
                      width: "30%",
                      color: "#1677ff",
                      cursor: "pointer",
                      textAlign: "right",
                    }}
                    onClick={() => handlePreview(doc.fileUrl, doc.documentType)}
                  >
                    View file
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#888", margin: 0 }}>No documents available.</p>
          )}
        </div>
      </Card>

      {/* Popup (Modal preview) */}
      <Modal
        open={previewVisible}
        title={previewType || "Document preview"}
        footer={null}
        width="50%"
        centered
        onCancel={() => setPreviewVisible(false)}
        bodyStyle={{
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "#fdfdfd",
        }}
      >
        {previewUrl ? (
          (() => {
            const fileExtension = previewUrl.split(".").pop()?.toLowerCase();

            // ✅ Nếu là ảnh (jpg, png, jpeg, gif, webp)
            if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")) {
              return (
                <div
                  style={{
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src={previewUrl}
                    alt={previewType}
                    style={{
                      maxWidth: "90%",
                      maxHeight: "70vh",
                      borderRadius: 8,
                      objectFit: "contain",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </div>
              );
            }

            // ✅ Nếu là PDF
            if (fileExtension === "pdf") {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "600px",
                  }}
                >
                  <iframe
                    src={previewUrl}
                    title="PDF preview"
                    width="95%"
                    height="100%"
                    style={{
                      border: "none",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              );
            }

            // ✅ Nếu là loại khác (docx, xlsx, zip, ...)
            return (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  width: "100%",
                }}
              >
                <p style={{ marginBottom: 16 }}>Preview not supported for this file type.</p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background: "#1677ff",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  Download file
                </a>
              </div>
            );
          })()
        ) : (
          <p style={{ textAlign: "center", padding: 40 }}>No file to preview</p>
        )}
      </Modal>

    </>
  );
}
