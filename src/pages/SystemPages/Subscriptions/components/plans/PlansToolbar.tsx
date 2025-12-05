import { Input, Button } from "antd";
import { ReloadOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

interface PlansToolbarProps {
  onReload: () => void;
  onCreate: () => void;
}

export default function PlansToolbar({ onReload, onCreate }: PlansToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        <Input
          placeholder="Search plans..."
          allowClear
          prefix={<SearchOutlined />}
          className="toolbar-search-input"
          style={{ width: 300 }}
        />

        <Button
          className="btn-search"
          icon={<SearchOutlined />}
          onClick={onReload}
        >
          Search
        </Button>

        <Button
          className="accounts-reset-btn"
          icon={<ReloadOutlined />}
          onClick={onReload}
        >
          Reset
        </Button>
      </div>

      <Button
        type="primary"
        className="accounts-new-btn"
        icon={<PlusOutlined />}
        onClick={onCreate}
      >
        New Plan
      </Button>
    </div>
  );
}
