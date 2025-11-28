// src/pages/SystemPages/Subscriptions/components/plans/PlansToolbar.tsx

import { Button, Space, Typography } from "antd";

const { Title } = Typography;

interface PlansToolbarProps {
  onReload: () => void;
  onCreate: () => void;
}

export default function PlansToolbar({ onReload, onCreate }: PlansToolbarProps) {
  return (
    <Space
      style={{
        marginBottom: 16,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Subscription Plans
      </Title>

      <Space>
        <Button onClick={onReload}>Reload</Button>
        <Button type="primary" onClick={onCreate}>
          New Plan
        </Button>
      </Space>
    </Space>
  );
}
