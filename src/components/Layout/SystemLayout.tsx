import { Layout, Menu, Button, Typography } from "antd";
import {
	DashboardOutlined,
	TeamOutlined,
	FileDoneOutlined,
	AppstoreOutlined,
	BarChartOutlined,
	BellOutlined,
	SettingOutlined,
	ApartmentOutlined,
	TagsOutlined,
	PartitionOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../services/config";
import React from "react";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

export default function SystemLayout() {
	const [collapsed, setCollapsed] = React.useState(false);
	const location = useLocation();

	const selectedKey = location.pathname.startsWith(APP_ROUTES.SYSTEM)
		? location.pathname
		: APP_ROUTES.SYSTEM_DASHBOARD;

	const items = [
		{
			key: APP_ROUTES.SYSTEM_DASHBOARD,
			icon: <DashboardOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_DASHBOARD}>Dashboard</Link>,
		},
		{
			key: APP_ROUTES.SYSTEM_USERS,
			icon: <TeamOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_USERS}>Users</Link>,
		},
		{
			key: APP_ROUTES.SYSTEM_COMPANY,
			icon: <ApartmentOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_COMPANY}>Company</Link>,
		},
		{
			key: APP_ROUTES.SYSTEM_REPORTS,
			icon: <BarChartOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_REPORTS}>Reports</Link>,
		},
		{
			key: APP_ROUTES.SYSTEM_EMPLOYMENT_TYPE,
			icon: <PartitionOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_EMPLOYMENT_TYPE}>
				Employment Type
			</Link>,
		},
		{
			key: APP_ROUTES.SYSTEM_CATEGORY,
			icon: <TagsOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_CATEGORY}>Category</Link>,
		},
		{
			key: APP_ROUTES.SYSTEM_NOTIFICATIONS,
			icon: <BellOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_NOTIFICATIONS}>Notifications</Link>,
		},
		{
			key: APP_ROUTES.SYSTEM_SETTINGS,
			icon: <SettingOutlined />,
			label: <Link to={APP_ROUTES.SYSTEM_SETTINGS}>Settings</Link>,
		},
	];

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={setCollapsed}
				breakpoint="lg"
				width={240}
				style={{
					background: "#fff",
					borderRight: "1px solid #f0f0f0",
				}}
			>
				<div
					style={{
						height: 64,
						display: "flex",
						alignItems: "center",
						justifyContent: collapsed ? "center" : "flex-start",
						paddingInline: 16,
						fontWeight: 700,
						color: "#1677ff",
						fontSize: 18,
					}}
				>
					{collapsed ? "S" : "System Admin"}
				</div>

				<Menu
					mode="inline"
					selectedKeys={[selectedKey]}
					items={items}
					style={{ height: "100%" }}
				/>
			</Sider>

			<Layout>
				<Header
					style={{
						background: "#fff",
						borderBottom: "1px solid #f0f0f0",
						display: "flex",
						alignItems: "center",
						gap: 12,
					}}
				>
					<Button
						type="text"
						aria-label="Toggle sidebar"
						onClick={() => setCollapsed(!collapsed)}
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					/>
					<Title level={4} style={{ margin: 0 }}>
						System Panel
					</Title>
				</Header>

				<Content style={{ padding: 24 }}>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
}
