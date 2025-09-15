import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
	Layout,
	Menu,
	Avatar,
	Dropdown,
	Button,
	Typography,
	Space,
	Badge,
	Divider,
} from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, BellOutlined } from "@ant-design/icons";
import defaultAvatar from "../../assets/logo/logo_AICES_sample.png";
import logo from "../../assets/logo/logo_long.png";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

type User = {
	name: string;
	avatarUrl?: string;
};

const AppHeader: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [user, setUser] = useState<User | null>({
		name: "SNEYTAA",
		avatarUrl: defaultAvatar,
	});
	const unreadCount = 3;

	const navItems: MenuProps["items"] = [
		{
			key: "/",
			label: (
				<NavLink
					to="/"
					style={({ isActive }) => ({
						fontWeight: 700,
						color: isActive ? "#16a34a" : "#1e293b",
						fontSize: 18,
						margin: 30,
					})}
				>
					Home
				</NavLink>
			),
		},
		{
			key: "/find-job",
			label: (
				<NavLink
					to="/find-job"
					style={({ isActive }) => ({
						fontWeight: 700,
						color: isActive ? "#16a34a" : "#1e293b",
						fontSize: 18,
						margin: 30,
					})}
				>
					Find Job
				</NavLink>
			),
		},
		{
			key: "/company",
			label: (
				<NavLink
					to="/company"
					style={({ isActive }) => ({
						fontWeight: 700,
						color: isActive ? "#16a34a" : "#1e293b",
						fontSize: 18,
						margin: 30,
					})}
				>
					Company
				</NavLink>
			),
		},
		{
			key: "/candidate",
			label: (
				<NavLink
					to="/candidate"
					style={({ isActive }) => ({
						fontWeight: 700,
						color: isActive ? "#16a34a" : "#1e293b",
						fontSize: 18,
						margin: 30,
					})}
				>
					Candidate
				</NavLink>
			),
		},
		{
			key: "/contact-us",
			label: (
				<NavLink
					to="/contact-us"
					style={({ isActive }) => ({
						fontWeight: 700,
						color: isActive ? "#16a34a" : "#1e293b",
						fontSize: 18,
						margin: 30,
					})}
				>
					Contact Us
				</NavLink>
			),
		},
	];

	const userMenuItems: MenuProps["items"] = [
		{
			key: "profile",
			label: (
				<Link to="/profile" style={{ fontWeight: 600 }}>
					Profile
				</Link>
			),
		},
		{ type: "divider" },
		{
			key: "logout",
			danger: true,
			label: <span style={{ fontWeight: 600 }}>Log out</span>,
		},
	];

	const handleUserMenuClick: MenuProps["onClick"] = (e) => {
		if (e.key === "logout") {
			console.log("logout clicked");
			setUser(null);
			navigate("/login");
		}
	};

	return (
		<AntHeader
			style={{
				position: "sticky",
				top: 0,
				zIndex: 1000,
				width: "100%",
				display: "flex",
				alignItems: "center",
				padding: "10 16px",
				background: "#fff",
				borderBottom: "1px solid #f0f0f0",
				gap: 16,
				height: 80,
				lineHeight: "80px",
			}}
		>
			<Link to="/" style={{ display: "flex", alignItems: "center" }}>
				<img
					src={logo}
					alt="MetaJobs Logo"
					style={{ height: 40, width: "auto" }}
				/>
			</Link>

			<Menu
				mode="horizontal"
				selectedKeys={[location.pathname]}
				items={navItems}
				style={{
					flex: 1,
					marginLeft: 16,
					borderBottom: "none",
					fontWeight: 600,
				}}
			/>

			{!user ? (
				<Space>
					<Button style={{ fontWeight: 600 }}>
						<Link to="/login">Sign In</Link>
					</Button>
					<Button type="primary" style={{ fontWeight: 600 }}>
						<Link to="/register">Sign Up</Link>
					</Button>
				</Space>
			) : (
				<Space size={16} align="center">
					<Badge count={unreadCount} size="default">
						<Button
							type="text"
							icon={<BellOutlined style={{ fontSize: 20 }} />}
						/>
					</Badge>
					<Divider type="vertical" />
					<Dropdown
						menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
						placement="bottomRight"
						trigger={["click"]}
					>
						<Space style={{ cursor: "pointer" }}>
							<Avatar
								size={36}
								src={user.avatarUrl}
								icon={!user.avatarUrl ? <UserOutlined /> : undefined}
							/>
							<Text style={{ color: "#0f172a", fontWeight: 600 }}>
								{user.name}
							</Text>
						</Space>
					</Dropdown>
				</Space>
			)}
		</AntHeader>
	);
};

export default AppHeader;
