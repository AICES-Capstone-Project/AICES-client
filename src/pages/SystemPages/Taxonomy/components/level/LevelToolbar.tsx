import { Button, Input } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface LevelToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function LevelToolbar({
  keyword,
  onKeywordChange,
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
          style={{ width: 260 }}
        />

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
