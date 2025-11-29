import { Button, Input, Space } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;

interface CategoryToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onReload: () => void;
  onCreate: () => void;
}

export default function CategoryToolbar({
  keyword,
  onKeywordChange,
  onReload,
  onCreate,
}: CategoryToolbarProps) {
  return (
    <Space>
      <Search
        placeholder="Search by name..."
        allowClear
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        style={{ maxWidth: 320 }}
      />
      <Button icon={<ReloadOutlined />} onClick={onReload} />
      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        Add Category
      </Button>
    </Space>
  );
}
