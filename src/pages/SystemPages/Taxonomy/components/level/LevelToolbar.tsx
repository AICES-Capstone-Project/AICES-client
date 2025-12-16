import { Button, Input } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface LevelToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function LevelToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  onReset,
  onCreate,
}: LevelToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          allowClear
          placeholder="Search levels..."
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
        New Level
      </Button>
    </div>
  );
}
