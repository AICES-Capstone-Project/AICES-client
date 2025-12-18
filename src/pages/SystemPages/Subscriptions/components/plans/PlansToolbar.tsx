import { Input, Button } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

interface PlansToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function PlansToolbar({
  keyword,
  onKeywordChange,
  onReset,
  onCreate,
}: PlansToolbarProps) {
  return (
    <div className="company-header-row">
      {/* LEFT - Search realtime + Reset */}
      <div className="company-left" style={{ display: "flex", gap: 8 }}>
        <Input
          placeholder="Search subscription plans..."
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          allowClear
          className="toolbar-search-input"
          style={{ height: 36, width: 260 }}
        />

        <Button
          className="accounts-reset-btn"
          icon={<ReloadOutlined />}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      {/* RIGHT - Add Plan */}
      <div className="company-right">
        <Button
          icon={<PlusOutlined />}
          className="accounts-new-btn"
          onClick={onCreate}
        >
          New Plan
        </Button>
      </div>
    </div>
  );
}
