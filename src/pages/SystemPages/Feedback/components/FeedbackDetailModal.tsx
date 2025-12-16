import { Card, Descriptions, Modal, Rate, Space, Tag, Typography } from "antd";
import type { FeedbackDetail } from "../../../../types/feedback.types";

const { Title, Text, Paragraph } = Typography;

interface FeedbackDetailModalProps {
  open: boolean;
  loading: boolean;
  data: FeedbackDetail | null;
  onClose: () => void;
  formatDate: (value: string) => string;
}

export default function FeedbackDetailModal({
  open,
  loading,
  data,
  onClose,
  formatDate,
}: FeedbackDetailModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Feedback Detail"
      footer={null}
      centered
      destroyOnClose
      width={820}
      confirmLoading={loading}
      className="system-modal"
    >
      {!data ? (
        <Text type="secondary">{loading ? "Loading..." : "No data"}</Text>
      ) : (
        <Space direction="vertical" size={14} style={{ width: "100%" }}>
          {/* ===== TOP: MORE DETAILS (PHỤ) ===== */}
          <Card size="small" style={{ borderRadius: 14 }}>
            <div style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 700 }}>More details</Text>
            </div>

            <Descriptions
              bordered
              column={2}
              size="small"
              labelStyle={{ width: 150, fontWeight: 600 }}
            >
              <Descriptions.Item label="Feedback ID">
                {data.feedbackId}
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                {formatDate(data.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item label="Company">
                {data.companyName}
                <Tag style={{ marginLeft: 8 }}>ID: {data.companyId}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Company User ID">
                {data.comUserId}
              </Descriptions.Item>

              <Descriptions.Item label="User Name">
                {data.userName}
              </Descriptions.Item>

              <Descriptions.Item label="User Email">
                {data.userEmail}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* ===== MAIN 1: USER + RATING ===== */}
          <Card size="small" style={{ borderRadius: 14 }}>
            <Space
              align="start"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {data.userFullName || data.userName || "Unknown user"}
                </Title>
                <Text type="secondary">{data.userEmail || data.userName}</Text>
              </div>

              <div style={{ textAlign: "right" }}>
                <Rate disabled value={data.rating} />
                <div>
                  <Text style={{ fontWeight: 700 }}>{data.rating}/5</Text>
                </div>
              </div>
            </Space>
          </Card>

          {/* ===== MAIN 2: COMMENT ===== */}
          <Card
            size="small"
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 700 }}>Comment</Text>
            </div>

            <Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {data.comment || <Text type="secondary">No comment</Text>}
            </Paragraph>
          </Card>
        </Space>
      )}
    </Modal>
  );
}
