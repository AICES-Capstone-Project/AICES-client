import { Modal, Space, Tag, Typography } from "antd";
import type { Company } from "../../../../types/company.types";

const { Title, Text } = Typography;

interface CompanyPreviewModalProps {
  open: boolean;
  company: Company | null;
  onClose: () => void;
}

export default function CompanyPreviewModal({
  open,
  company,
  onClose,
}: CompanyPreviewModalProps) {
  return (
    <Modal
      open={open}
      title="Company Preview"
      onCancel={onClose}
      footer={null}
      width={640}
    >
      {company ? (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Space>
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="logo"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  objectFit: "cover",
                }}
              />
            ) : null}
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {company.name}
              </Title>
              {company.websiteUrl ? (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {(() => {
                    try {
                      return new URL(company.websiteUrl).hostname;
                    } catch {
                      return company.websiteUrl;
                    }
                  })()}
                </a>
              ) : (
                <Text type="secondary">—</Text>
              )}
            </div>
          </Space>

          <div>
            <b>Address:</b> {company.address || "—"}
          </div>

          <div>
            <b>Company Status:</b>{" "}
            {company.companyStatus ? (
              <Tag
                color={
                  company.companyStatus === "Approved"
                    ? "green"
                    : company.companyStatus === "Pending"
                    ? "gold"
                    : "red"
                }
              >
                {company.companyStatus}
              </Tag>
            ) : (
              "—"
            )}
          </div>

          <div>
            <b>Active:</b>{" "}
            {company.isActive ? (
              <Tag color="green">Active</Tag>
            ) : (
              <Tag color="red">Inactive</Tag>
            )}
          </div>

          <div>
            <b>Created At:</b>{" "}
            {company.createdAt
              ? new Date(company.createdAt).toLocaleString()
              : "—"}
          </div>
        </Space>
      ) : (
        <div>Loading...</div>
      )}
    </Modal>
  );
}
