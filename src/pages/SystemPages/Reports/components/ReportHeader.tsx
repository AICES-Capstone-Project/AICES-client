import React from "react";
import { Button, Space, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type ReportHeaderProps = {
  title: string;
  subtitle?: string;
  loading?: boolean;
  onRefresh?: () => void;
  rightSlot?: React.ReactNode;
};

export default function ReportHeader({
  title,
  subtitle,
  loading,
  onRefresh,
  rightSlot,
}: ReportHeaderProps) {
  return (
    <Space style={{ width: "100%", justifyContent: "space-between" }} align="start">
      <div>
        <Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Title>
        {subtitle ? <Text type="secondary">{subtitle}</Text> : null}
      </div>

      <Space>
        {rightSlot}
        {onRefresh ? (
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            className="btn-aices"
          >
            Refresh
          </Button>
        ) : null}
      </Space>
    </Space>
  );
}
