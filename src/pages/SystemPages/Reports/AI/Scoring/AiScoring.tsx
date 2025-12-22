// src/pages/SystemPages/Reports/AI/Scoring/AiScoring.tsx

import { Card, Row, Col, Typography, Space, Divider, Tag, Alert } from "antd";
import type { SystemAiScoringReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent, fmtMs } from "../../components/formatters";

const { Text } = Typography;

export type AiScoringProps = {
  loading: boolean;
  data?: SystemAiScoringReport;
  error?: string;
};

export default function AiScoring({ loading, data, error }: AiScoringProps) {
  return (
    <>
      {error && (
        <Alert
          type="warning"
          showIcon
          message="AI Scoring Distribution failed to load"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="Scoring Distribution" loading={loading} className="aices-card">
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Text type="secondary">Success Rate</Text>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {fmtPercent(data?.successRate)}
            </div>
          </Col>
          <Col span={8}>
            <Text type="secondary">Avg Time</Text>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {fmtMs(data?.averageProcessingTimeMs)}
            </div>
          </Col>
          <Col span={8}>
            <Text type="secondary">Total Scored</Text>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {fmtNumber(data?.statistics?.totalScored)}
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>Score Buckets</Text>
        <div style={{ marginTop: 10 }}>
          <Space wrap>
            <Tag color="green">High: {fmtPercent(data?.scoreDistribution?.high)}</Tag>
            <Tag color="gold">Medium: {fmtPercent(data?.scoreDistribution?.medium)}</Tag>
            <Tag color="red">Low: {fmtPercent(data?.scoreDistribution?.low)}</Tag>
          </Space>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <Text strong>Statistics</Text>
        <div style={{ marginTop: 8 }}>
          <Space wrap>
            <Tag>Avg Score: {fmtNumber(data?.statistics?.averageScore)}</Tag>
            <Tag>Median: {fmtNumber(data?.statistics?.medianScore)}</Tag>
          </Space>
        </div>
      </Card>
    </>
  );
}
