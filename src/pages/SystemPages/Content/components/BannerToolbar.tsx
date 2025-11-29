import { Button, Input, Space, Typography } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface BannerToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReload: () => void;
  onCreate: () => void;
}

export default function BannerToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  onReload,
  onCreate,
}: BannerToolbarProps) {
  return (
    <div className="flex justify-between mb-4">
      <Title level={3}>Banners</Title>

      <Space>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search by title..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onPressEnter={onSearch}
        />
        <Button icon={<ReloadOutlined />} onClick={onReload} />

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Create
        </Button>
      </Space>
    </div>
  );
}
