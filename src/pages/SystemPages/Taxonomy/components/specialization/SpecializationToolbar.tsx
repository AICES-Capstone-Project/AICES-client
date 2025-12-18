import { Button, Input } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface SpecializationToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function SpecializationToolbar({
  keyword,
  onKeywordChange,
  onReset,
  onCreate,
}: SpecializationToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          placeholder="Search by name or category..."
          allowClear
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          style={{ width: 320 }}
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
        New Specialization
      </Button>
    </div>
  );
}
