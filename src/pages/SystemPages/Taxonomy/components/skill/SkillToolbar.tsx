import { Button, Input, Space } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface SkillToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function SkillToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  onReset,
  onCreate,
}: SkillToolbarProps) {
  return (
    <Space>
      <Input
        allowClear
        placeholder="Search by name..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        onPressEnter={onSearch}
        prefix={<SearchOutlined />}
        style={{ width: 260 }}
      />
      <Button onClick={onReset} icon={<ReloadOutlined />}>
        Reset
      </Button>
      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        New Skill
      </Button>
    </Space>
  );
}
