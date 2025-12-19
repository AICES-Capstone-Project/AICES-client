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
  Drawer,
} from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { NotificationDropdown } from "../Notification";
import { useTranslation } from "react-i18next";
import defaultAvatar from "../../assets/images/Avatar_Default.jpg";
import logo from "../../assets/logo/logo_long.png";
import { APP_ROUTES, STORAGE_KEYS } from "../../services/config";
import { getRoleBasedRoute } from "../../routes/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUser, logoutUser } from "../../stores/slices/authSlice";
import VietnamFlag from "../../assets/images/vietnam.png";

// ✨ TODO: Import action fetch thông báo của bạn ở đây
// import { fetchNotifications } from "../../stores/slices/notificationSlice";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    // Logic: Nếu có token mà chưa có user -> Fetch User
    if (token && !user) {
      dispatch(fetchUser());
    }

    // ✨ FIX QUAN TRỌNG:
    // Nếu đã có user (hoặc token), phải gọi API lấy thông báo ngay lập tức
    // để cái chuông (NotificationDropdown) có số count hiển thị.
    if (token) {
      // dispatch(fetchNotifications({ page: 1, limit: 10 })); // <-- Bỏ comment và dùng action của bạn
    }
  }, [dispatch, user]);

  /** ===== Resources dropdown items ===== */
  const resourcesMenuItems: MenuProps["items"] = [
    {
      key: APP_ROUTES.RESOURCES_BLOG,
      label: (
        <NavLink
          to={APP_ROUTES.RESOURCES_BLOG}
          onClick={() => setDrawerOpen(false)}
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
        >
          Blog
        </NavLink>
      ),
    },
    {
      key: APP_ROUTES.RESOURCES_HELP_CENTER,
      label: (
        <NavLink
          to={APP_ROUTES.RESOURCES_HELP_CENTER}
          onClick={() => setDrawerOpen(false)}
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
        >
          Help Center
        </NavLink>
      ),
    },
    {
      key: APP_ROUTES.RESOURCES_CONTACT_US,
      label: (
        <NavLink
          to={APP_ROUTES.RESOURCES_CONTACT_US}
          onClick={() => setDrawerOpen(false)}
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
        >
          Contact Us
        </NavLink>
      ),
    },
  ];

  /** ===== Top nav ===== */
  const navItems: MenuProps["items"] = [
    {
      key: APP_ROUTES.PRODUCT_HOW_IT_WORKS,
      label: (
        <NavLink
          to={APP_ROUTES.PRODUCT_HOW_IT_WORKS}
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
          onClick={() => setDrawerOpen(false)}
        >
          {t("app.howItWorks")}
        </NavLink>
      ),
    },
    {
      key: "resources",
      label: <span className="text-slate-800">{t("app.resources")}</span>,
      children: resourcesMenuItems,
    },
    {
      key: APP_ROUTES.SUBSCRIPTIONS,
      label: (
        <NavLink
          to={APP_ROUTES.SUBSCRIPTIONS}
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
          onClick={() => setDrawerOpen(false)}
        >
          {t("app.subscriptions")}
        </NavLink>
      ),
    },
    {
      key: APP_ROUTES.RANKING,
      label: (
        <NavLink
          to={APP_ROUTES.RANKING}
          end
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-slate-800"
          }
          onClick={() => setDrawerOpen(false)}
        >
          Ranking
        </NavLink>
      ),
    },
  ];

  /** ===== Menu selected key (supports submenu active) ===== */
  const selectedKey = location.pathname.startsWith(
    APP_ROUTES.PRODUCT_HOW_IT_WORKS
  )
    ? APP_ROUTES.PRODUCT_HOW_IT_WORKS
    : location.pathname.startsWith("/resources")
    ? "resources"
    : location.pathname;

  const userMenuItems: MenuProps["items"] = [
    {
      key: "works",
      label: <span>{t("app.works", "Works")}</span>,
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: <span>{t("app.logout", "Log out")}</span>,
    },
  ];

  const languageMenuItems: MenuProps["items"] = [
    {
      key: "en",
      label: (
        <span>
          <span role="img" aria-label="globe">
            🌐
          </span>{" "}
          English
        </span>
      ),
    },
    {
      key: "vi",
      label: (
        <span className="flex items-center gap-2">
          <img
            src={VietnamFlag}
            alt="Vietnam flag"
            style={{ width: 14, height: 14 }}
          />
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
            selectedKeys={[selectedKey]}
            items={navItems}
            rootClassName="custom-menu"
            className="app-header-menu"
            style={{ borderBottom: "none" }}
            overflowedIndicator={null} // ⬅️ QUAN TRỌNG
            disabledOverflow
          />
        </div>

        <Space size={16} align="center" className="hidden md:flex">
          {user ? (
            <>
              <NotificationDropdown style={{ margin: "10px" }} />
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
                <Link to={APP_ROUTES.LOGIN}>{t("app.signIn")}</Link>
              </Button>

              <Button
                type="primary"
                style={{
                  backgroundColor: "var(--color-primary-dark)",
                  borderColor: "var(--color-primary-dark)",
                }}
              >
                <Link to={APP_ROUTES.SIGN_UP}>{t("app.signUp")}</Link>
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
                const lang = e.key as "en" | "vi";
                i18n.changeLanguage(lang);
                localStorage.setItem("lang", lang);
              },
            }}
            placement="bottomRight"
          >
            <Button
              type="text"
              aria-label="language selector"
              style={{ marginTop: 20 }}
            >
              {i18n.language === "vi" ? (
                <span className="flex items-center gap-1">
                  <img
                    src={VietnamFlag}
                    alt="Vietnam flag"
                    style={{ width: 18, height: 18 }}
                  />
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
          selectedKeys={[selectedKey]}
          items={navItems}
          className="border-none"
        />
      </Drawer>
    </>
  );
};

export default AppHeader;
