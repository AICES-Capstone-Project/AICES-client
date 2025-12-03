// src/pages/SystemPages/Content/Blogs/components/BlogToolbar.tsx

import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface BlogToolbarProps {
	onCreate: () => void;
}

export default function BlogToolbar({ onCreate }: BlogToolbarProps) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: 16,
			}}
		>
			<Typography.Title level={4} style={{ margin: 0 }}>
				System Blogs
			</Typography.Title>

			<Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
				New Blog
			</Button>
		</div>
	);
}
