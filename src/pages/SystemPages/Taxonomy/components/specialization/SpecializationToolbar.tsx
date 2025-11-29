import { Button, Input, Space, Typography } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
    <Space
      style={{
        marginBottom: 16,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Title level={4} style={{ marginBottom: 0 }}>
          Specializations
        </Title>
        <Text type="secondary">
          Manage specialization taxonomy used by skills and jobs.
        </Text>
      </div>

      <Space>
        <Input
          placeholder="Search by name or category..."
          allowClear
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 260 }}
        />
        <Button icon={<SearchOutlined />} onClick={onSearch}>
          Search
        </Button>
        <Button icon={<ReloadOutlined />} onClick={onReset}>
          Reset
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          New Specialization
        </Button>
      </Space>
    </Space>
  );
}
