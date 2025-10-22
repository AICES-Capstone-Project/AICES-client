import { Card, Typography } from "antd";

const { Title } = Typography;

export default function Category() {
	return (
		<div>
			<Title level={3}>Job Category Management</Title>
			<Card>Manage job categories and related metadata.</Card>
		</div>
	);
}
