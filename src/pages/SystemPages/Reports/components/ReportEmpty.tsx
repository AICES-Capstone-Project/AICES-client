
import { Card, Empty, Button, Space, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

type ReportEmptyProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function ReportEmpty({ title, description, onRetry }: ReportEmptyProps) {
  return (
    <Card title={title} className="aices-card">
      <Empty
        description={
          <Space direction="vertical" size={6}>
            <Text type="secondary">{description || "No data available."}</Text>
            {onRetry ? (
              <Button icon={<ReloadOutlined />} onClick={onRetry} className="btn-aices">
                Retry
              </Button>
            ) : null}
          </Space>
        }
      />
    </Card>
  );
}
