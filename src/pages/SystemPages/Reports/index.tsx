import { Typography, Card } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Reports() {
	return (
		<div>
			<Title level={3}>
				<BarChartOutlined /> Reports & Analytics
			</Title>
			<Card>Data visualization and AI recruitment analytics will go here.</Card>
		</div>
	);
}
