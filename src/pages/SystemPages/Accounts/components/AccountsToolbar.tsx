import { Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";

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
    <Space style={{ marginBottom: 16 }} wrap>
      <Input
        placeholder="Search by email or name"
        allowClear
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        onPressEnter={onSearch}
        style={{ width: 280 }}
        prefix={<SearchOutlined />}
      />
      <Button type="primary" onClick={onSearch}>
        Search
      </Button>
      <Button onClick={onReset} icon={<ReloadOutlined />}>
        Reset
      </Button>
      <Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreate}>
        New User
      </Button>
    </Space>
  );
}
