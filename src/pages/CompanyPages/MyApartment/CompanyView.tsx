import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message, Modal, Button } from "antd";
import CompanyEditModal from "./components/CompanyEditModal";
import { companyService } from "../../../services/companyService";
import { useAppSelector } from "../../../hooks/redux";
import type { Company } from "../../../types/company.types";

export default function CompanyView() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { user } = useAppSelector((s) => s.auth);
  const isHrRecruiter = (user?.roleName || "").toLowerCase() === "hr_recruiter";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResp = await companyService.getSelf();
        if (companyResp?.status === "success" || companyResp?.status === "Success") {
          const companyData = companyResp.data as Company;
          setCompany(companyData);
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
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontWeight: 600 }}>Company Information</span>
            {!isHrRecruiter && (
              <div>
                <Button className="company-btn" onClick={() => setEditModalOpen(true)}>
                  Edit Company Info
                </Button>
              </div>
            )}
          </div>
        }
        style={{
          maxWidth: 1200,
          margin: "12px auto",
          padding: "0 5px",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          height: 'calc(100% - 25px)',
        }}
      >
        <Row gutter={32} align="middle" justify="center" style={{ width: "100%", marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: 900,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Col span={9} style={{ textAlign: "center" }}>
              <img
                src={company.logoUrl || "https://placehold.co/200x200?text=Logo"}
                alt="Company Logo"
                style={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: "10%",
                  border: "1px solid #ddd",
                  display: 'block',
                  margin: '5px auto',
                }}
              />
            </Col>
            <Col span={15} >
              <div style={{ maxWidth: 600 }}>
                <div style={{ marginBottom: 10 }}>
                  <b>Name:</b> <span>{company.name}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>Website:</b> <span>{company.websiteUrl || "N/A"}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>Address:</b> <span>{company.address || "N/A"}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>Tax code:</b> <span>{company.taxCode || "N/A"}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>HR Manager:</b> <span>{company.managerName || "N/A"}</span>
                </div>
              </div>
            </Col>
          </div>

          <Col span={24}>
            <div style={{ maxWidth: 900, margin: '5px auto' }}>
              <div
                style={{
                  lineHeight: '20px',
                  maxHeight: 120,
                  overflowY: 'auto',
                  padding: 10,
                  background: '#fff',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {company.description || 'N/A'}
              </div>
            </div>
          </Col>
        </Row>

        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: "16px 24px",
            background: "#fafafa",
            textAlign: "center",
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
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
                width: "100%",
                maxWidth: 650,
                margin: "0 auto",
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
                <span style={{ width: "15%" }}>No</span>
                <span style={{ width: "70%" }}>Document Type</span>
                <span style={{ width: "15%" }}>Action</span>
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
                  <span style={{ width: "15%" }}>{index + 1}</span>
                  <span style={{ width: "70%" }}>
                    {doc.documentType}
                  </span>
                  <a
                    style={{
                      width: "15%",
                      color: "var(--color-primary-light)",
                      cursor: "pointer",
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

      <CompanyEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        company={company}
        onUpdated={(c) => setCompany(c)}
      />

    </>
  );
}
