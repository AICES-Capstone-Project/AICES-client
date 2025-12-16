import { Button, Input } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface FeedbackToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function FeedbackToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  onReset,
}: FeedbackToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          allowClear
          placeholder="Search feedbacks (email / username)..."
          value={keyword}
          prefix={<SearchOutlined />}
          onChange={(e) => onKeywordChange(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 320 }}
        />

        <Button className="btn-search" icon={<SearchOutlined />} onClick={onSearch}>
          Search
        </Button>

        <Button className="accounts-reset-btn" icon={<ReloadOutlined />} onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
