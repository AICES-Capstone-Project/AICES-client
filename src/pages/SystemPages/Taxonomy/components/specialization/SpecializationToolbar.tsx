import { Button, Input } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface SpecializationToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function SpecializationToolbar({
  keyword,
  onKeywordChange,
  onSearch,
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
          onPressEnter={onSearch}
          style={{ width: 320 }}
        />

        <Button
          icon={<SearchOutlined />}
          className="btn-search"
          onClick={onSearch}
        >
          Search
        </Button>

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
