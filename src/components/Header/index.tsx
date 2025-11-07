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
import { useTranslation } from 'react-i18next';
import defaultAvatar from "../../assets/images/Avatar_Default.jpg";
import logo from "../../assets/logo/logo_long.png";
import { APP_ROUTES, STORAGE_KEYS } from "../../services/config";
import { getRoleBasedRoute } from "../../routes/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUser, logoutUser } from "../../stores/slices/authSlice";
import VietnamFlag from '../../assets/images/vietnam.png';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const unreadCount = 3;
  const { t, i18n } = useTranslation();

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
            isActive ? "font-semibold" : "text-slate-800"
          }
          onClick={() => setDrawerOpen(false)}
        >
          {t('app.howItWorks')}
        </NavLink>
      ),
    },
    {
      key: "/resources",
      label: (
        <NavLink
          to="/resources"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
          onClick={() => setDrawerOpen(false)}
        >
          {t('app.resources')}
        </NavLink>
      ),
    },
    {
      key: "/pricing",
      label: (
        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
          onClick={() => setDrawerOpen(false)}
        >
          {t('app.pricing')}
        </NavLink>
      ),
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "works",
      label: <span>{t('app.works', 'Works')}</span>,
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: <span>{t('app.logout', 'Log out')}</span>,
    },
  ];

  const languageMenuItems: MenuProps["items"] = [
    {
      key: 'en',
      label: (
        <span>
          <span role="img" aria-label="globe">🌐</span> English
        </span>
      ),
    },
    {
      key: 'vi',
      label: (
        <span className="flex items-center gap-2">
          <img src={VietnamFlag} alt="Vietnam flag" style={{ width: 14, height: 14 }} />
          Tiếng Việt
        </span>
      ),

    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      dispatch(logoutUser());
      navigate(APP_ROUTES.HOME);
    }

    if (e.key === "works") {
      // navigate to role-based route
      const roleName = user?.roleName ?? null;
      const route = getRoleBasedRoute(roleName);
      navigate(route);
    }
  };

  return (
    <>
      <AntHeader
        className="flex items-center justify-between h-[70px] px-6 md:px-24 border-b border-gray-100"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          zIndex: 1000,
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
                <Link to={APP_ROUTES.LOGIN}>{t('app.signIn')}</Link>
              </Button>

              <Button
                type="primary"
                style={{
                  backgroundColor: "var(--color-primary-dark)",
                  borderColor: "var(--color-primary-dark)",
                }}
              >
                <Link to={APP_ROUTES.SIGN_UP}>{t('app.signUp')}</Link>
              </Button>
            </>
          )}
        </Space>

        <div className="ml-4">
          {/* Language selector */}
          <Dropdown
            menu={{
              items: languageMenuItems,
              onClick: (e) => {
                const lang = e.key as 'en' | 'vi';
                i18n.changeLanguage(lang);
                localStorage.setItem('lang', lang);
              }
            }}
            placement="bottomRight"
          >
            <Button type="text" aria-label="language selector" style={{ marginTop: 20 }}>
              {i18n.language === 'vi' ? (
                <span className="flex items-center gap-1">
                  <img src={VietnamFlag} alt="Vietnam flag" style={{ width: 18, height: 18 }} />
                  VI
                </span>
              ) : (
                <span>🌐 EN</span>
              )}
            </Button>
          </Dropdown>
        </div>

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
        styles={{ body: { padding: 0 } }}
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
