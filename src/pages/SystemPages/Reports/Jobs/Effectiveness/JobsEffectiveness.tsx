// src/pages/SystemPages/Reports/Jobs/Effectiveness/JobsEffectiveness.tsx

import { Card, Row, Col, Typography, Alert } from "antd";
import type { SystemJobsEffectivenessReport } from "../../../../../types/systemReport.types";
import { fmtNumber, fmtPercent } from "../../components/formatters";

const { Text } = Typography;

export type JobsEffectivenessProps = {
  loading: boolean;
  data?: SystemJobsEffectivenessReport;
  error?: string;
};

export default function JobsEffectiveness({
  loading,
  data,
  error,
}: JobsEffectivenessProps) {
  return (
    <>
      {error && (
        <Alert
          type="warning"
          showIcon
          message="Jobs Effectiveness failed to load"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="Effectiveness" loading={loading} className="aices-card">
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Text type="secondary">Average Resumes / Job</Text>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              {fmtNumber(data?.averageResumesPerJob)}
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Qualified Rate</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtPercent(data?.qualifiedRate)}
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Success Hiring Rate</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {fmtPercent(data?.successHiringRate)}
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
}
