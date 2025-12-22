// src/pages/SystemPages/Reports/Companies/Usage/CompaniesUsage.tsx

import { Card, Row, Col, Typography, Space, Divider, Tag, Alert } from "antd";
import type { SystemCompaniesUsageReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent } from "../../components/formatters";

const { Text } = Typography;

export type CompaniesUsageProps = {
  loading: boolean;
  data?: SystemCompaniesUsageReport;
  error?: string;
};

export default function CompaniesUsage({ loading, data, error }: CompaniesUsageProps) {
  return (
    <>
      {error && (
        <Alert
          type="warning"
          showIcon
          message="Companies Usage failed to load"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="Usage" loading={loading} className="aices-card">
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Text type="secondary">Registered Only</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtNumber(data?.registeredOnly)}
            </div>
          </Col>
          <Col span={8}>
            <Text type="secondary">Active</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtNumber(data?.activeCompanies)}
            </div>
          </Col>
          <Col span={8}>
            <Text type="secondary">Frequent</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtNumber(data?.frequentCompanies)}
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>KPIs</Text>
        <div style={{ marginTop: 10 }}>
          <Space wrap>
            <Tag color="blue">Active Rate: {fmtPercent(data?.kpis?.activeRate)}</Tag>
            <Tag color="purple">AI Usage Rate: {fmtPercent(data?.kpis?.aiUsageRate)}</Tag>
            <Tag color="cyan">Returning Rate: {fmtPercent(data?.kpis?.returningRate)}</Tag>
          </Space>
        </div>
      </Card>
    </>
  );
}
