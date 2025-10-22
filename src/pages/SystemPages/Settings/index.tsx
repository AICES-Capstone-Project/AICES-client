import { Card, Typography, Switch, Space } from "antd";

const { Title, Text } = Typography;

export default function Settings() {
	return (
		<div>
			<Title level={3}>System Settings</Title>
			<Card>
				<Space direction="vertical" size="large">
					<Space>
						<Text>Enable system notifications</Text>
						<Switch defaultChecked />
					</Space>
					<Space>
						<Text>Allow company auto-approval</Text>
						<Switch />
					</Space>
				</Space>
			</Card>
		</div>
	);
}
