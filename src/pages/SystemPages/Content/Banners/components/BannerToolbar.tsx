import { Button, Input } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface BannerToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onReload: () => void;
  onCreate: () => void;
}

export default function BannerToolbar({
  keyword,
  onKeywordChange,
  onReload,
  onCreate,
}: BannerToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search by title..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          style={{ width: 320 }}
        />

        <Button
          icon={<ReloadOutlined />}
          className="accounts-reset-btn"
          onClick={onReload}
        >
          Reset
        </Button>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreate}
        className="accounts-new-btn"
      >
        New Banner
      </Button>
    </div>
  );
}
