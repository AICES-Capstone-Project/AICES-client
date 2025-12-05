import { Input, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SubscribedCompaniesToolbarProps {
  onSearch: (value: string) => void;
}

export default function SubscribedCompaniesToolbar({
  onSearch,
}: SubscribedCompaniesToolbarProps) {
  const [value, setValue] = useState("");

  // Realtime search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onSearch(val);
  };

  return (
    <Space
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Input + Button giống Company */}
      <Space>
        <div className="search-input-wrapper">
          <SearchOutlined className="search-input-icon" />
          <Input
            placeholder="Search companies or plans..."
            value={value}
            onChange={handleChange}
            className="search-input"
          />
        </div>

        <Button className="btn-search">
          <SearchOutlined />
          Search
        </Button>
      </Space>
    </Space>
  );
}
