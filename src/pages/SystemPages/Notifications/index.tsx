import { List, Typography } from "antd";

const { Title } = Typography;

export default function Notifications() {
	const data: string[] = [
		"Company ABC registration approved.",
		"System update deployed successfully.",
		"New recruiter request pending review.",
	];

	return (
		<div>
			<Title level={3}>System Notifications</Title>
			<List
				dataSource={data}
				renderItem={(item) => <List.Item>{item}</List.Item>}
				bordered
			/>
		</div>
	);
}
