import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

type Props = {
  onSearch: (v: string) => void;
};

const JobSearchBar = ({ onSearch }: Props) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: 12 }}>
      <Search
        placeholder="Search by title, category, specialization or description..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        style={{ width: 480 }}
        onSearch={onSearch}
      />
    </div>
  );
};

export default JobSearchBar;
