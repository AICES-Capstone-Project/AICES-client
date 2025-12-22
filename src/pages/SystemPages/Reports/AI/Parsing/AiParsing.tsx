// src/pages/SystemPages/Reports/AI/Parsing/AiParsing.tsx

import { Card, Row, Col, Typography, Divider, Table, Alert } from "antd";
import type { SystemAiParsingReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent, fmtMs } from "../../components/formatters";

const { Text } = Typography;

export type AiParsingProps = {
  loading: boolean;
  data?: SystemAiParsingReport;
  error?: string;
};

export default function AiParsing({ loading, data, error }: AiParsingProps) {
  return (
    <>
      {error && (
        <Alert
          type="warning"
          showIcon
          message="AI Parsing Quality failed to load"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="Parsing Quality" loading={loading} className="aices-card">
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Text type="secondary">Success Rate</Text>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {fmtPercent(data?.successRate)}
            </div>
          </Col>
          <Col span={8}>
            <Text type="secondary">Total Resumes</Text>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {fmtNumber(data?.totalResumes)}
            </div>
          </Col>
          <Col span={8}>
            <Text type="secondary">Avg Time</Text>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {fmtMs(data?.averageProcessingTimeMs)}
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>Common Errors</Text>
        <Table
          size="small"
          style={{ marginTop: 10 }}
          pagination={false}
          rowKey={(r) => r.errorType}
          dataSource={data?.commonErrors || []}
          columns={[
            { title: "Type", dataIndex: "errorType", key: "errorType" },
            { title: "Count", dataIndex: "count", key: "count", width: 120 },
            {
              title: "Rate",
              dataIndex: "percentage",
              key: "percentage",
              width: 120,
              render: (v: number) => fmtPercent(v),
            },
          ]}
        />
      </Card>
    </>
  );
}
