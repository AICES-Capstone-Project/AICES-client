// src/pages/SystemPages/Reports/Jobs/Statistics/JobsStatistics.tsx

import { Card, Row, Col, Typography, Space, Divider, Table, Tag, Alert } from "antd";
import type { SystemJobsStatisticsReport } from "../../../../../types/systemReport.types";
import { fmtNumber } from "../../components/formatters";

const { Text } = Typography;

export type JobsStatisticsProps = {
  loading: boolean;
  data?: SystemJobsStatisticsReport;
  error?: string;
};

export default function JobsStatistics({ loading, data, error }: JobsStatisticsProps) {
  return (
    <>
      {error && (
        <Alert
          type="warning"
          showIcon
          message="Jobs Statistics failed to load"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="Statistics" loading={loading} className="aices-card">
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Text type="secondary">Total</Text>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtNumber(data?.totalJobs)}</div>
          </Col>
          <Col span={6}>
            <Text type="secondary">Active</Text>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtNumber(data?.activeJobs)}</div>
          </Col>
          <Col span={6}>
            <Text type="secondary">New This Month</Text>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtNumber(data?.newJobsThisMonth)}</div>
          </Col>
          <Col span={6}>
            <Text type="secondary">Avg Apps / Job</Text>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {fmtNumber(data?.averageApplicationsPerJob)}
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>Status Breakdown</Text>
        <div style={{ marginTop: 8 }}>
          <Space wrap>
            <Tag color="green">Published: {fmtNumber(data?.statusBreakdown?.published)}</Tag>
            <Tag color="gold">Draft: {fmtNumber(data?.statusBreakdown?.draft)}</Tag>
            <Tag color="red">Closed: {fmtNumber(data?.statusBreakdown?.closed)}</Tag>
          </Space>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>Top Categories</Text>
        <Table
          size="small"
          style={{ marginTop: 10 }}
          pagination={false}
          rowKey={(r) => String(r.categoryId)}
          dataSource={data?.topCategories || []}
          columns={[
            { title: "Category", dataIndex: "categoryName", key: "categoryName" },
            { title: "Jobs", dataIndex: "jobCount", key: "jobCount", width: 120 },
          ]}
        />
      </Card>
    </>
  );
}
