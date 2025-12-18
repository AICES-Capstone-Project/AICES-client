import { Button, Input } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface RecruitmentTypeToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function RecruitmentTypeToolbar({
  keyword,
  onKeywordChange,
  onReset,
  onCreate,
}: RecruitmentTypeToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          placeholder="Search recruitment types..."
          allowClear
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          style={{ width: 320 }}
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
        New Type
      </Button>
    </div>
  );
}
