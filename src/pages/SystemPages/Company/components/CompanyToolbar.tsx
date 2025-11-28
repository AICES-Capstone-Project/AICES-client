import { Button, Space, Typography } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface CompanyToolbarProps {
  loading: boolean;
  onAdd: () => void;
  onRefresh: () => void;
}

export default function CompanyToolbar({
  loading,
  onAdd,
  onRefresh,
}: CompanyToolbarProps) {
  return (
    <Space
      align="center"
      style={{ width: "100%", justifyContent: "space-between" }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Company Management
      </Title>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          disabled={loading}
        >
          Add Company
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
        >
          Refresh
        </Button>
      </Space>
    </Space>
  );
}
