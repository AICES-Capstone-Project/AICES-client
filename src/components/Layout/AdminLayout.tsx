import { Layout, Menu, Button, Typography } from "antd";
import {
	DashboardOutlined,
	TeamOutlined,
	FileDoneOutlined,
	AppstoreOutlined,
	ProfileOutlined,
	BarChartOutlined,
	SettingOutlined,
	BellOutlined,
	DatabaseOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../services/config";
import React from "react";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

export default function AdminLayout() {
	const [collapsed, setCollapsed] = React.useState(false);
	const location = useLocation();

	const selectedKey = location.pathname.startsWith(APP_ROUTES.ADMIN)
		? location.pathname
		: APP_ROUTES.ADMIN_DASHBOARD;

	const items = [
		{
			key: APP_ROUTES.ADMIN_DASHBOARD,
			icon: <DashboardOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_DASHBOARD}>Dashboard</Link>,
		},
		{
			key: APP_ROUTES.ADMIN_USERS,
			icon: <TeamOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_USERS}>Users</Link>,
		},
		{
			key: APP_ROUTES.ADMIN_RECRUITMENT_APPROVAL,
			icon: <FileDoneOutlined />,
			label: (
				<Link to={APP_ROUTES.ADMIN_RECRUITMENT_APPROVAL}>
					Recruitment Approval
				</Link>
			),
		},
		{
			key: APP_ROUTES.ADMIN_JOBS,
			icon: <AppstoreOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_JOBS}>Jobs</Link>,
		},
		{
			key: APP_ROUTES.ADMIN_ASSESSMENTS,
			icon: <ProfileOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_ASSESSMENTS}>Assessments</Link>,
		},
		{
			key: APP_ROUTES.ADMIN_REPORTS,
			icon: <BarChartOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_REPORTS}>Reports</Link>,
		},
		{
			key: APP_ROUTES.ADMIN_SETTINGS,
			icon: <SettingOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_SETTINGS}>Settings</Link>,
		},
		{
			key: APP_ROUTES.ADMIN_NOTIFICATIONS,
			icon: <BellOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_NOTIFICATIONS}>Notifications</Link>,
		},
		{
			key: APP_ROUTES.ADMIN_LOGS,
			icon: <DatabaseOutlined />,
			label: <Link to={APP_ROUTES.ADMIN_LOGS}>Logs</Link>,
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
				style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
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
					{collapsed ? "A" : "Admin"}
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
						Admin Panel
					</Title>
				</Header>
				<Content style={{ padding: 24 }}>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
}
