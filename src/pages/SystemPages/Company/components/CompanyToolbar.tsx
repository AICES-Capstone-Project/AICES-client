import { Button, Space, Typography, Select } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface CompanyToolbarProps {
  loading: boolean;
  onAdd: () => void;
  onRefresh: () => void;
  statusFilter: string;
  onChangeStatusFilter: (value: string) => void;
}

const STATUS_OPTIONS = [
  { label: "All status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Canceled", value: "Canceled" },
  { label: "Suspended", value: "Suspended" },
];

export default function CompanyToolbar({
  loading,
  onAdd,
  onRefresh,
  statusFilter,
  onChangeStatusFilter,
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
        {/* Filter status */}
        <Select
          value={statusFilter}
          onChange={onChangeStatusFilter}
          options={STATUS_OPTIONS}
          style={{ minWidth: 150 }}
          size="middle"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          disabled={loading}
        >
          Add Company
        </Button>

        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
      </Space>
    </Space>
  );
}
