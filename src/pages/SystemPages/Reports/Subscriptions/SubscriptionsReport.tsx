// src/pages/SystemPages/Reports/Subscriptions/SubscriptionsReport.tsx

import { Card, Row, Col, Typography, Space, Divider, Table, Tag, Alert } from "antd";
import type { SystemSubscriptionsReport } from "../../../../types/systemReport.types";
import { fmtMoney, fmtNumber, fmtPercent } from "../components/formatters";

const { Text } = Typography;

export type SubscriptionsReportProps = {
  loading: boolean;
  data?: SystemSubscriptionsReport;
  error?: string;
};

export default function SubscriptionsReport({
  loading,
  data,
  error,
}: SubscriptionsReportProps) {
  return (
    <>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load Subscriptions report"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card title="Revenue Summary" loading={loading} className="aices-card">
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Text type="secondary">Free Companies</Text>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {fmtNumber(data?.freeCompanies)}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Paid Companies</Text>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {fmtNumber(data?.paidCompanies)}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Monthly Revenue</Text>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {fmtMoney(data?.monthlyRevenue)}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Renewal Rate</Text>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {fmtPercent(data?.renewalRate)}
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            <Text strong>Popular Plan</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="green">{data?.popularPlan || "--"}</Tag>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Text strong>Breakdown</Text>
            <div style={{ marginTop: 8 }}>
              <Space wrap>
                <Tag>Total Revenue: {fmtMoney(data?.breakdown?.totalRevenue)}</Tag>
                <Tag>Avg / Company: {fmtMoney(data?.breakdown?.averageRevenuePerCompany)}</Tag>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title="Plan Statistics" loading={loading} className="aices-card">
            <Table
              size="small"
              pagination={false}
              rowKey={(r) => String(r.subscriptionId)}
              dataSource={data?.breakdown?.planStatistics || []}
              columns={[
                { title: "Plan", dataIndex: "planName", key: "planName" },
                { title: "Companies", dataIndex: "companyCount", key: "companyCount", width: 140 },
                {
                  title: "Revenue",
                  dataIndex: "revenue",
                  key: "revenue",
                  width: 160,
                  render: (v: number) => fmtMoney(v),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
