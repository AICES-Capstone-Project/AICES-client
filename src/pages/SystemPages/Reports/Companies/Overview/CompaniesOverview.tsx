// src/pages/SystemPages/Reports/Companies/Overview/CompaniesOverview.tsx

import { Card, Row, Col, Typography, Space, Divider, Tag, Alert } from "antd";
import type { SystemCompaniesOverviewReport } from "../../../../../types/systemReport.types";
import { fmtNumber } from "../../components/formatters";

const { Text } = Typography;

export type CompaniesOverviewProps = {
  loading: boolean;
  data?: SystemCompaniesOverviewReport;
  error?: string;
};

export default function CompaniesOverview({
  loading,
  data,
  error,
}: CompaniesOverviewProps) {
  return (
    <>
      {error && (
        <Alert
          type="warning"
          showIcon
          message="Companies Overview failed to load"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card
        title="Overview"
        loading={loading}
        className="aices-card"
        extra={data ? <Tag color="green">{fmtNumber(data.totalCompanies)} total</Tag> : null}
      >
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Text type="secondary">Active</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtNumber(data?.activeCompanies)}
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Inactive</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtNumber(data?.inactiveCompanies)}
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">New This Month</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtNumber(data?.newCompaniesThisMonth)}
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>Subscription Breakdown</Text>
        <div style={{ marginTop: 8 }}>
          <Space wrap>
            <Tag color="green">
              Active: {fmtNumber(data?.subscriptionBreakdown?.withActiveSubscription)}
            </Tag>
            <Tag color="gold">
              Expired: {fmtNumber(data?.subscriptionBreakdown?.withExpiredSubscription)}
            </Tag>
            <Tag>
              None: {fmtNumber(data?.subscriptionBreakdown?.withoutSubscription)}
            </Tag>
          </Space>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>Verification Breakdown</Text>
        <div style={{ marginTop: 8 }}>
          <Space wrap>
            <Tag color="green">
              Verified: {fmtNumber(data?.verificationBreakdown?.verified)}
            </Tag>
            <Tag color="gold">
              Pending: {fmtNumber(data?.verificationBreakdown?.pending)}
            </Tag>
            <Tag color="red">
              Rejected: {fmtNumber(data?.verificationBreakdown?.rejected)}
            </Tag>
          </Space>
        </div>
      </Card>
    </>
  );
}
