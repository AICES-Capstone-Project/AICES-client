import { Button, Input, Space } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Search } = Input;

interface RecruitmentTypeToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: (value: string) => void;
  onReset: () => void;
  onCreate: () => void;
}

export default function RecruitmentTypeToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  onReset,
  onCreate,
}: RecruitmentTypeToolbarProps) {
  return (
    <Space>
      <Search
        allowClear
        placeholder="Search by name"
        prefix={<SearchOutlined />}
        onSearch={onSearch}
        onChange={(e) => onKeywordChange(e.target.value)}
        value={keyword}
        style={{ width: 260 }}
      />
      <Button icon={<ReloadOutlined />} onClick={onReset}>
        Reset
      </Button>
      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        New Recruitment Type
      </Button>
    </Space>
  );
}
