// src/pages/SystemPages/Subscriptions/components/subscribed-companies/SubscribedCompaniesToolbar.tsx

import { Input, Space, Typography } from "antd";

const { Title } = Typography;
const { Search } = Input;

interface SubscribedCompaniesToolbarProps {
  onSearch: (value: string) => void;
}

export default function SubscribedCompaniesToolbar({
  onSearch,
}: SubscribedCompaniesToolbarProps) {
  return (
    <Space
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Subscription History
      </Title>

      <Search
        allowClear
        placeholder="Search by company or plan..."
        style={{ width: 260 }}
        onSearch={onSearch}
      />
    </Space>
  );
}
