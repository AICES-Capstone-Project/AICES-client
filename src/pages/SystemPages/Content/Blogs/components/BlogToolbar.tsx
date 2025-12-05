// src/pages/SystemPages/Content/Blogs/components/BlogToolbar.tsx

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface BlogToolbarProps {
  onCreate: () => void;
}

export default function BlogToolbar({ onCreate }: BlogToolbarProps) {
  return (
    <div className="accounts-toolbar">
      <div className="accounts-toolbar-left">
        
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreate}
        className="accounts-new-btn"
      >
        New Blog
      </Button>
    </div>
  );
}
