import { Space, Tag, Typography } from "antd";
import type { Company } from "../../../../../types/company.types";
import type { CompanySubscription } from "../../../../../types/companySubscription.types";

const { Title, Text } = Typography;

interface OverviewTabProps {
  company: Company | null;
  subscription: CompanySubscription | null;
}

export default function OverviewTab({
  company,
  subscription,
}: OverviewTabProps) {
  if (!company) {
    return (
      <Text type="secondary">General information of the company will appear here.</Text>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      {/* Header */}
      <Space align="center">
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
          {company.companyStatus && (
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
          )}
        </div>
      </Space>

      {/* Basic info */}
      <div>
        <Text strong>Description: </Text>
        <Text>{company.description || "—"}</Text>
      </div>

      <div>
        <Text strong>Address: </Text>
        <Text>{company.address || "—"}</Text>
      </div>

      <div>
        <Text strong>Website: </Text>
        {company.websiteUrl ? (
          <a href={company.websiteUrl} target="_blank" rel="noreferrer">
            {company.websiteUrl}
          </a>
        ) : (
          <Text>—</Text>
        )}
      </div>

      <div>
        <Text strong>Tax Code: </Text>
        <Text>{company.taxCode || "—"}</Text>
      </div>

      <div>
        <Text strong>Subscription: </Text>
        {subscription ? (
          <>
            <Text>
              {subscription.subscriptionName} (
              {new Date(subscription.startDate).toLocaleDateString()} -{" "}
              {new Date(subscription.endDate).toLocaleDateString()})
            </Text>
            <Tag
              style={{ marginLeft: 8 }}
              color={
                subscription.subscriptionStatus === "Active"
                  ? "green"
                  : subscription.subscriptionStatus === "Cancelled"
                  ? "red"
                  : "gold"
              }
            >
              {subscription.subscriptionStatus}
            </Tag>
          </>
        ) : (
          <Text>—</Text>
        )}
      </div>

      <div>
        <Text strong>Created by: </Text>
        <Text>{company.createdBy ?? "—"}</Text>
      </div>

      <div>
        <Text strong>Approved by: </Text>
        <Text>{company.approvalBy ?? "—"}</Text>
      </div>

      <div>
        <Text strong>Created at: </Text>
        <Text>
          {company.createdAt
            ? new Date(company.createdAt).toLocaleString()
            : "—"}
        </Text>
      </div>

      <div>
        <Text strong>Rejection reason: </Text>
        <Text>{company.rejectionReason || "—"}</Text>
      </div>

      <div>
        <Text strong>Documents: </Text>
        {company.documents && company.documents.length > 0 ? (
          <ul style={{ marginTop: 4, paddingLeft: 20 }}>
            {company.documents.map((doc, idx) => (
              <li key={idx}>
                <Text>
                  {doc.documentType}{" "}
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                    View
                  </a>
                </Text>
              </li>
            ))}
          </ul>
        ) : (
          <Text type="secondary">No documents</Text>
        )}
      </div>
    </Space>
  );
}
