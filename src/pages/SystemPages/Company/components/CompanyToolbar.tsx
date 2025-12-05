import { Button, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface CompanyToolbarProps {
  loading: boolean;
  onAdd: () => void;
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
  statusFilter,
  onChangeStatusFilter,
}: CompanyToolbarProps) {
  return (
    <div className="company-right">    {/* 🔥 chỉ dùng company-right, bỏ accounts-toolbar */}
      {/* FILTER STATUS */}
      <Select
        value={statusFilter}
        onChange={onChangeStatusFilter}
        options={STATUS_OPTIONS}
        size="middle"
        style={{ minWidth: 150 }}
        className="toolbar-select"
        dropdownClassName="system-role-dropdown"
      />

      {/* ADD COMPANY */}
      <Button
        icon={<PlusOutlined />}
        className="accounts-new-btn"
        onClick={onAdd}
        disabled={loading}
      >
        Add Company
      </Button>
    </div>
  );
}
