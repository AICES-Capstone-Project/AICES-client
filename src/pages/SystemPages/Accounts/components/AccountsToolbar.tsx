import { Input, Button } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface AccountsToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onOpenCreate: () => void;
}

export default function AccountsToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  onReset,
  onOpenCreate,
}: AccountsToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div
        className="accounts-toolbar-left"
        style={{ display: "flex", gap: 8 }}
      >
        {/* Search */}
        <Input
          placeholder="Search by email or name"
          allowClear
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 260 }}
          prefix={<SearchOutlined />}
        />

        {/* Buttons */}
        <Button
          icon={<SearchOutlined />}
          onClick={onSearch}
          className="btn-search"
        >
          Search
        </Button>

        <Button
          className="accounts-reset-btn"
          icon={<ReloadOutlined />}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onOpenCreate}
        className="accounts-new-btn"
      >
        New User
      </Button>
    </div>
  );
}
