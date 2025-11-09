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
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutUser } from "../../stores/slices/authSlice";
import { APP_ROUTES, ROLES } from "../../services/config";
import React from "react";

const { Sider, Content } = Layout;

export default function CompanyLayout() {
	const [collapsed, setCollapsed] = React.useState(false);
	const location = useLocation();

	// selectedKey will be computed after we obtain the current user

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

	const hasCompany = Boolean(user?.companyName);
	const defaultCompanyRoute = hasCompany ? APP_ROUTES.COMPANY_DASHBOARD : APP_ROUTES.COMPANY_MY_APARTMENTS;
	const selectedKey = location.pathname.startsWith(APP_ROUTES.COMPANY)
		? location.pathname
		: defaultCompanyRoute;

	const iconStyle = { color: "var(--color-primary-medium)", fontWeight: "bold" };

	const items = [
		// Dashboard only visible if user is associated with a company
		...(hasCompany ? [
			{
				key: APP_ROUTES.COMPANY_DASHBOARD,
				icon: <LineChartOutlined style={iconStyle} />,
				label: <Link to={APP_ROUTES.COMPANY_DASHBOARD}>Dashboard</Link>,
			},
		] : []),
		{
			key: APP_ROUTES.COMPANY_MY_APARTMENTS,
			icon: <ApartmentOutlined style={iconStyle} />,
			label: <Link to={APP_ROUTES.COMPANY_MY_APARTMENTS}>My Company</Link>,
		},
		...(userRole?.toLowerCase() === ROLES.Hr_Manager?.toLowerCase()
			? [
				{
					key: APP_ROUTES.COMPANY_STAFFS,
					icon: <TeamOutlined style={iconStyle} />,
					label: <Link to={APP_ROUTES.COMPANY_STAFFS}>Staffs</Link>,
				},
			]
			: []),
		// Jobs link only visible when user has a company
		...(hasCompany ? [
			{
				key: APP_ROUTES.COMPANY_JOBS,
				icon: <AppstoreOutlined style={iconStyle} />,
				label: <Link to={APP_ROUTES.COMPANY_JOBS}>Jobs</Link>,
			},
		] : []),
		{
			key: APP_ROUTES.COMPANY_SETTINGS,
			icon: <SettingOutlined style={iconStyle} />,
			label: <Link to={APP_ROUTES.COMPANY_SETTINGS}>Settings</Link>,
		},
		{
			key: "logout",
			icon: <LogoutOutlined style={iconStyle} />,
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
				color: "var(--color-primary-dark)",
				background: "#fafafa",
				transition: "all 0.3s ease",
				fontWeight: "bold",
			}}
		>
			{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
		</div>
	);

	return (
		<Layout style={{ minHeight: "100vh", paddingRight: "8px" }}>
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
					width: collapsed ? "6%" : "15%",
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

			<Layout
				style={{
					flex: "1 1 auto",
					marginLeft: collapsed ? "6%" : "15%",
					transition: "all 0.3s ease",
				}}
			>
				<Content
					style={{
						transition: "all 0.3s ease",
					}}
				>
					<Outlet />
				</Content>
			</Layout>

		</Layout>
	);
}
