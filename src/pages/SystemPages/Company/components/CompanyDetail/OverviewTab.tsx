import {Tag, Typography } from "antd";
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
      <div className="company-overview-empty">
        <Text type="secondary">
          General information of the company will appear here.
        </Text>
      </div>
    );
  }

  const status = company.companyStatus || "";
  const statusClass =
    status === "Approved"
      ? "status-tag status-tag-verified"
      : status === "Pending"
      ? "status-tag status-tag-unverified"
      : status
      ? "status-tag status-tag-locked"
      : "";

  const subscriptionStatus = subscription?.subscriptionStatus || "";
  const subStatusClass =
    subscriptionStatus === "Active"
      ? "status-tag status-tag-verified"
      : subscriptionStatus === "Cancelled"
      ? "status-tag status-tag-locked"
      : subscriptionStatus
      ? "status-tag status-tag-unverified"
      : "";

  return (
    <div className="company-overview-layout">
      {/* ==== HEADER STRIP ==== */}
      <div className="company-overview-header">
        <div className="company-overview-header-left">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt="logo"
              className="company-overview-logo"
            />
          ) : (
            <div className="company-overview-logo placeholder">
              {company.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
          )}

          <div>
            <Title level={5} style={{ margin: 0 }}>
              {company.name}
            </Title>

            <div className="company-overview-header-tags">
              {status && <span className={statusClass}>{status}</span>}

              {subscription && (
                <Tag className="role-tag role-tag-hr">
                  {subscription.subscriptionName}
                </Tag>
              )}
            </div>
          </div>
        </div>

        <div className="company-overview-header-meta">
          <div className="meta-item">
            <span className="label">Created by</span>
            <span className="value">{company.createdBy ?? "—"}</span>
          </div>
          <div className="meta-item">
            <span className="label">Approved by</span>
            <span className="value">{company.approvalBy ?? "—"}</span>
          </div>
          <div className="meta-item">
            <span className="label">Created at</span>
            <span className="value">
              {company.createdAt
                ? new Date(company.createdAt).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ==== TWO-COLUMN BODY ==== */}
      <div className="company-overview-grid">
        {/* LEFT: GENERAL INFO */}
        <div className="company-overview-card">
          <div className="company-overview-card-title">Company profile</div>

          <div className="company-overview-fields">
            <div className="field">
              <span className="label">Description</span>
              <span className="value">
                {company.description || "—"}
              </span>
            </div>

            <div className="field">
              <span className="label">Address</span>
              <span className="value">
                {company.address || "—"}
              </span>
            </div>

            <div className="field">
              <span className="label">Website</span>
              <span className="value">
                {company.websiteUrl ? (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {company.websiteUrl}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="field">
              <span className="label">Tax code</span>
              <span className="value">
                {company.taxCode || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: SUBSCRIPTION + SYSTEM INFO */}
        <div className="company-overview-card">
          <div className="company-overview-card-title">
            Subscription & system info
          </div>

          <div className="company-overview-fields">
            <div className="field">
              <span className="label">Subscription</span>
              <span className="value">
                {subscription ? (
                  <>
                    {subscription.subscriptionName}{" "}
                    {subscription.startDate && subscription.endDate && (
                      <>
                        (
                        {new Date(
                          subscription.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          subscription.endDate
                        ).toLocaleDateString()}
                        )
                      </>
                    )}
                    {subscriptionStatus && (
                      <span className={subStatusClass}>
                        {subscriptionStatus}
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="field">
              <span className="label">Rejection reason</span>
              <span className="value">
                {company.rejectionReason || "—"}
              </span>
            </div>

            <div className="field field-docs">
              <span className="label">Documents</span>
              <span className="value">
                {company.documents && company.documents.length > 0 ? (
                  <ul className="company-doc-list">
                    {company.documents.map((doc, idx) => (
                      <li key={idx}>
                        <span className="doc-name">
                          {doc.documentType || "Document"}
                        </span>
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted">No documents</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
