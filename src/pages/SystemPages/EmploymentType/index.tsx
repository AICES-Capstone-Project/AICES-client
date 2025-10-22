import { Card, Typography } from "antd";

const { Title } = Typography;

export default function EmploymentType() {
	return (
		<div>
			<Title level={3}>Employment Type</Title>
			<Card>Manage employment type configurations (Full-time, Part-time, etc.).</Card>
		</div>
	);
}
