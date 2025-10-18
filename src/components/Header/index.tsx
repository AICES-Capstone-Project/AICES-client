import React, { useEffect, useState } from "react";
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
  Drawer,
} from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  BellOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import defaultAvatar from "../../assets/images/Avatar_Default.jpg";
import logo from "../../assets/logo/logo_long.png";
import { APP_ROUTES, STORAGE_KEYS } from "../../services/config";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUser, logoutUser } from "../../stores/slices/authSlice";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const unreadCount = 3;

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  const navItems: MenuProps["items"] = [
    {
      key: "/how-it-works",
      label: (
        <NavLink
          to="/how-it-works"
          className={({ isActive }) =>
            isActive ? "text-primary font-bold" : "text-slate-800"
          }
          style={({ isActive }) => ({
            color: isActive ? "var(--color-primary)" : undefined,
          })}
          onClick={() => setDrawerOpen(false)}
        >
          How It Works
        </NavLink>
      ),
    },
    {
      key: "/resources",
      label: (
        <NavLink
          to="/resources"
          className={({ isActive }) =>
            isActive ? "text-primary font-bold" : "text-slate-800"
          }
          style={({ isActive }) => ({
            color: isActive ? "var(--color-primary)" : undefined,
          })}
          onClick={() => setDrawerOpen(false)}
        >
          Resources
        </NavLink>
      ),
    },
    {
      key: "/pricing",
      label: (
        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            isActive ? "text-primary font-bold" : "text-slate-800"
          }
          style={({ isActive }) => ({
            color: isActive ? "var(--color-primary)" : undefined,
          })}
          onClick={() => setDrawerOpen(false)}
        >
          Pricing
        </NavLink>
      ),
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link to={APP_ROUTES.PROFILE}>Profile</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: <span>Log out</span>,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      dispatch(logoutUser());
      navigate(APP_ROUTES.HOME);
    }
  };

  return (
    <>
      <AntHeader
        className="flex items-center justify-between h-[70px] px-6 md:px-24 border-b border-gray-100 sticky top-0 z-[1000]"
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="AICES Logo"
            style={{ height: 50, width: "auto", cursor: "pointer" }}
          />
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={navItems}
            rootClassName="custom-menu"
            style={{ borderBottom: "none" }}
          />
        </div>

        <Space size={16} align="center" className="hidden md:flex">
          {user ? (
            <>
              <Badge count={unreadCount} size="default">
                <Button
                  type="text"
                  icon={<BellOutlined className="text-xl" />}
                />
              </Badge>
              <Divider type="vertical" />
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Space className="cursor-pointer">
                  <Avatar
                    size={36}
                    src={user.avatarUrl || defaultAvatar}
                    icon={<UserOutlined />}
                  />
                  <Text className="hidden md:inline text-slate-900 font-semibold">
                    {user.fullName || user.email}
                  </Text>
                </Space>
              </Dropdown>
            </>
          ) : (
            <>
              <Button
                style={{
                  color: "var(--color-primary-dark)",
                  borderColor: "var(--color-primary-dark)",
                }}
              >
                <Link to={APP_ROUTES.LOGIN}>Sign In</Link>
              </Button>

              <Button
                type="primary"
                style={{
                  backgroundColor: "var(--color-primary-dark)",
                  borderColor: "var(--color-primary-dark)",
                }}
              >
                <Link to={APP_ROUTES.SIGN_UP}>Sign Up</Link>
              </Button>
            </>
          )}
        </Space>

        <Button
          className="inline-flex md:!hidden"
          type="text"
          icon={<MenuOutlined className="text-[22px]" />}
          onClick={() => setDrawerOpen(true)}
        />
      </AntHeader>

      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span className="font-semibold">Menu</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDrawerOpen(false)}
            />
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={navItems}
          className="border-none"
        />
      </Drawer>
    </>
  );
};

export default AppHeader;
