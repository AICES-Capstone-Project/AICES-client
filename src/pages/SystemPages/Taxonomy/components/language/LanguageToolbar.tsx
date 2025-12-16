import { Button, Input } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface LanguageToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function LanguageToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  onReset,
  onCreate,
}: LanguageToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          allowClear
          placeholder="Search languages..."
          value={keyword}
          prefix={<SearchOutlined />}
          onChange={(e) => onKeywordChange(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 260 }}
        />

        <Button className="btn-search" icon={<SearchOutlined />} onClick={onSearch}>
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
        className="accounts-new-btn"
        onClick={onCreate}
      >
        New Language
      </Button>
    </div>
  );
}
