import { Input, Button } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";

interface CategoryToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function CategoryToolbar({
  keyword,
  onKeywordChange,
  onReset,
  onCreate,
}: CategoryToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          placeholder="Search categories..."
          allowClear
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          prefix={<SearchOutlined />}
          className="toolbar-search-input"
          style={{ width: 300 }}
        />

        <Button
          icon={<ReloadOutlined />}
          className="accounts-reset-btn"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="accounts-new-btn"
        onClick={onCreate}
      >
        Add Category
      </Button>
    </div>
  );
}
