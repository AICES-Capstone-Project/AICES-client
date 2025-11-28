import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

type Props = {
  onSearch: (v: string) => void;
};

const JobSearchBar = ({ onSearch }: Props) => {
  return (
    <Space style={{ marginBottom: 16, width: "100%" }} direction="vertical">
      <Space wrap>
        <Input
          placeholder="Search by title, category or specialization"
          prefix={<SearchOutlined />}
          style={{ width: 400 }}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </Space>
    </Space>
  );
};

export default JobSearchBar;
