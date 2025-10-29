import { Layout, Menu } from "antd";
import {
	LineChartOutlined,
	TeamOutlined,
	AppstoreOutlined,
	LogoutOutlined,
	SettingOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	ApartmentOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo_long.png";
import { useAppDispatch } from "../../hooks/redux";
import { logoutUser } from "../../stores/slices/authSlice";
import { APP_ROUTES, ROLES } from "../../services/config";
import React from "react";
import { useAppSelector } from "../../hooks/redux";

// Prefer reading user from redux store (keeps shape consistent across the app)
// Fallback: null

const { Sider, Content } = Layout;

export default function CompanyLayout() {
	const [collapsed, setCollapsed] = React.useState(false);
	const location = useLocation();

	const selectedKey = location.pathname.startsWith(APP_ROUTES.COMPANY)
		? location.pathname
		: APP_ROUTES.COMPANY_DASHBOARD;

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await dispatch(logoutUser());
		} finally {
			navigate("/");
		}
	};

	const user = useAppSelector((s) => s.auth.user);
	const userRole = user?.roleName ?? null;

	const items = [
		{
			key: APP_ROUTES.COMPANY_DASHBOARD,
			icon: <LineChartOutlined />,
			label: <Link to={APP_ROUTES.COMPANY_DASHBOARD}>Dashboard</Link>,
		},
		{
			key: APP_ROUTES.COMPANY_MY_APARTMENTS,
			icon: <ApartmentOutlined />,
			label: <Link to={APP_ROUTES.COMPANY_MY_APARTMENTS}>My Company</Link>,
		},
		// Only show Staffs if HR_Manager
		...(userRole?.toLowerCase() === ROLES.Hr_Manager?.toLowerCase()
			? [{
				key: APP_ROUTES.COMPANY_STAFFS,
				icon: <TeamOutlined />,
				label: <Link to={APP_ROUTES.COMPANY_STAFFS}>Staffs</Link>,
			}]
			: []),
		{
			key: APP_ROUTES.COMPANY_JOBS,
			icon: <AppstoreOutlined />,
			label: <Link to={APP_ROUTES.COMPANY_JOBS}>Jobs</Link>,
		},
		{
			key: APP_ROUTES.COMPANY_SETTINGS,
			icon: <SettingOutlined />,
			label: <Link to={APP_ROUTES.COMPANY_SETTINGS}>Settings</Link>,
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: (
				<a
					onClick={(e) => {
						e.preventDefault();
						handleLogout();
					}}
					href="#"
				>
					Logout
				</a>
			),
		},
	];

	const CustomTrigger = (
		<div
			onClick={() => setCollapsed(!collapsed)}
			style={{
				height: 48,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: "pointer",
				borderTop: "1px solid #f0f0f0",
				color: collapsed ? "var(--color-primary-dark)" : "var(--color-primary-light)",
				background: "#fafafa",
				transition: "all 0.3s ease",
			}}
		>
			{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
		</div>
	);

	return (
		<Layout style={{ minHeight: "100vh" , paddingRight: "8px"}}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={setCollapsed}
				breakpoint="lg"
trigger={CustomTrigger}
				style={{
					position: "fixed",
					left: 0,
					top: 0,
					height: "100vh",
					overflow: "hidden",
					background: "#fff",
					borderRight: "1px solid #f0f0f0",
					width: collapsed ? "8%" : "15%",
					transition: "width 200ms ease",
					zIndex: 100,
				}}
			>
				<div
					style={{
						height: 64,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						paddingInline: 16,
						cursor: "pointer",
					}}
				>
					<Link to="/" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<img
							src={logo}
							alt="AICES"
							style={{
								display: "block",
								margin: "0 auto",
								height: collapsed ? 28 : 36,
								maxWidth: collapsed ? "100%" : "80%",
								objectFit: "contain",
							}}
						/>
					</Link>
				</div>
				<Menu
					mode="inline"
					className="custom-menu"
					selectedKeys={[selectedKey]}
					items={items}
					style={{ height: "100%" }}
				/>
			</Sider>

			<Layout style={{ marginLeft: collapsed ? "8%" : "15%", flex: "1 1 auto" }}>
				<Content>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
}