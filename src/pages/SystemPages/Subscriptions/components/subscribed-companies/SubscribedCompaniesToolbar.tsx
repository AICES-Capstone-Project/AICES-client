import { Button, Input, Select, Space } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface SubscribedCompaniesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  planFilter?: string;
  planOptions: { label: string; value: string }[];
  onPlanChange: (value?: string) => void;

  onReset: () => void;
}

export default function SubscribedCompaniesToolbar({
  search,
  onSearchChange,
  planFilter,
  planOptions,
  onPlanChange,
  onReset,
}: SubscribedCompaniesToolbarProps) {
  return (
    <div className="company-header-row">
      {/* LEFT - realtime search */}
      <div className="company-left">
        <Input
          placeholder="Search companies or plans..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className="toolbar-search-input"
          prefix={<SearchOutlined />}
          style={{ height: 36 }}
        />
      </div>

      {/* RIGHT - plan filter + reset */}
      <div className="company-right">
        <Space size="middle">
          <Select
            allowClear
            placeholder="Subscription plan"
            value={planFilter}
            options={planOptions}
            onChange={(value) => onPlanChange(value)}
            style={{ minWidth: 160 }}
          />

          <Button
            className="accounts-reset-btn"
            icon={<ReloadOutlined />}
            onClick={onReset}
          >
            Reset
          </Button>
        </Space>
      </div>
    </div>
  );
}
