import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  FileDoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { SystemResumeEffectivenessData } from "../../../../../types/system-dashboard.types";

const { Text } = Typography;

/** ===== AICES GREEN ===== */
const GREEN = "#0A5C36";

interface ResumeEffectivenessSummaryProps {
  data?: SystemResumeEffectivenessData;
}

const kpiCardStyle: React.CSSProperties = {
  borderRadius: 14,
  height: 110,
};

const statusCardStyle: React.CSSProperties = {
  borderRadius: 14,
  height: 110,
};

const ResumeEffectivenessSummary: React.FC<ResumeEffectivenessSummaryProps> = ({
  data,
}) => {
  if (!data) return null;

  const {
    totalResumes,
    processedResumes,
    processingSuccessRate,
    failedResumes,
    pendingResumes,
  } = data.processing;

  const safeRate = Number.isFinite(processingSuccessRate as number)
    ? Math.max(0, Math.min(100, processingSuccessRate))
    : 0;

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 14,
        boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
      }}
      title={
        <Space>
          <FileDoneOutlined />
          <span>Resume Processing Effectiveness</span>
        </Space>
      }
      headStyle={{ borderBottom: "none" }}
      bodyStyle={{ paddingTop: 8 }}
    >
      <Row gutter={[16, 16]}>
        {/* ===== LEFT KPI ===== */}
        <Col xs={24} md={10}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Card
              bordered={false}
              style={kpiCardStyle}
              bodyStyle={{ padding: 14 }}
            >
              <Space direction="vertical" size={4}>
                <Space size={8}>
                  <FileDoneOutlined style={{ color: GREEN }} />
                  <Text type="secondary" style={{ fontWeight: 700 }}>
                    Total Resumes
                  </Text>
                </Space>

                <Statistic
                  value={totalResumes ?? 0}
                  valueStyle={{ fontWeight: 900 }}
                />
              </Space>
            </Card>

            <Card
              bordered={false}
              style={kpiCardStyle}
              bodyStyle={{ padding: 14 }}
            >
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Space
                  align="center"
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <Space size={8}>
                    <CheckCircleOutlined style={{ color: GREEN }} />
                    <Text type="secondary" style={{ fontWeight: 700 }}>
                      Processed Successfully
                    </Text>
                  </Space>

                  <Tag color="green" style={{ marginInlineEnd: 0 }}>
                    Success
                  </Tag>
                </Space>

                <Statistic
                  value={processedResumes ?? 0}
                  valueStyle={{ color: GREEN, fontWeight: 900 }}
                />

                <Progress
                  percent={safeRate}
                  strokeColor={GREEN}
                  showInfo
                  size="small"
                />
              </Space>
            </Card>
          </Space>
        </Col>

        {/* ===== RIGHT STATUS ===== */}
        <Col xs={24} md={14}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                bordered={false}
                style={statusCardStyle}
                bodyStyle={{ padding: 14 }}
              >
                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  <Space
                    align="center"
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <Space size={8}>
                      <ClockCircleOutlined style={{ color: "#FAAD14" }} />
                      <Text strong>Pending</Text>
                    </Space>
                    <Tag color="gold" style={{ marginInlineEnd: 0 }}>
                      In Queue
                    </Tag>
                  </Space>

                  <Statistic
                    value={pendingResumes ?? 0}
                    valueStyle={{ fontWeight: 900 }}
                  />
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card
                bordered={false}
                style={statusCardStyle}
                bodyStyle={{ padding: 14 }}
              >
                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  <Space
                    align="center"
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <Space size={8}>
                      <CloseCircleOutlined style={{ color: "#FF4D4F" }} />
                      <Text strong>Failed</Text>
                    </Space>
                    <Tag color="red" style={{ marginInlineEnd: 0 }}>
                      Need Review
                    </Tag>
                  </Space>

                  <Statistic
                    value={failedResumes ?? 0}
                    valueStyle={{ color: "#A8071A", fontWeight: 900 }}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default ResumeEffectivenessSummary;
