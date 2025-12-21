// src/components/Layout/system/SystemLayout.tsx
import React from "react";
import { Layout, Menu, Button, Typography, ConfigProvider, Modal, message } from "antd";
import "../../../assets/styles/system.css";

import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import { PoweroffOutlined } from "@ant-design/icons";

import logoLong from "../../../assets/logo/logo_long.png";
import { authService } from "../../../services/authService";
import { APP_ROUTES, STORAGE_KEYS } from "../../../services/config";

import { systemAntdTheme } from "./systemTheme";
import { SYSTEM_ROLE_CONFIG, type SystemRole } from "./systemRole.config";
import { buildSystemMenuItems } from "./systemMenu.config";
import { getOpenKeysBySelectedKey, getSelectedKeyByLocation } from "./systemNav.utils";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

interface SystemLayoutProps {
  role: SystemRole;
}

export default function SystemLayout({ role }: SystemLayoutProps) {
  const cfg = SYSTEM_ROLE_CONFIG[role];

  const [collapsed, setCollapsed] = React.useState(false);
  const [logoutLoading, setLogoutLoading] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const items = React.useMemo(() => buildSystemMenuItems(cfg), [cfg]);

  const selectedKey = React.useMemo(() => {
    const fallback = `${cfg.basePath}/dashboard`;
    return getSelectedKeyByLocation(location.pathname, items, fallback);
  }, [location.pathname, items, cfg.basePath]);

  React.useEffect(() => {
    setOpenKeys(getOpenKeysBySelectedKey(selectedKey, items));
  }, [selectedKey, items]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to log out?",
      okText: "Logout",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: { loading: logoutLoading, className: "btn-aices-logout" },
      onOk: async () => {
        setLogoutLoading(true);
        try {
          await authService.logout();
          message.success("Logged out successfully");
        } catch {
          message.warning("Logout API failed. Logged out locally.");
        } finally {
          setLogoutLoading(false);

          // ✅ LOCAL LOGOUT (use STORAGE_KEYS)
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);

          navigate(APP_ROUTES.LOGIN, { replace: true });
        }
      },
    });
  };

  return (
    <ConfigProvider theme={systemAntdTheme as any}>
      

      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          width={240}
          trigger={null}
          className="aices-sider"
          style={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            zIndex: 100,
          }}
        >
          <div
            className="sys-sidebar-header"
            style={{
              height: 64,
              minHeight: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingInline: 12,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => navigate(APP_ROUTES.HOME)}
          >
            <div
              className="sys-sidebar-logo"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                transition: "opacity 0.2s",
                opacity: 1,
              }}
            >
              <img
                src={logoLong}
                style={{
                  height: collapsed ? 28 : 36,
                  maxWidth: collapsed ? 44 : "80%",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>

            <div
              className="sys-collapse-trigger"
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(!collapsed);
              }}
              style={{
                cursor: "pointer",
                padding: 8,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: "50%",
                right: collapsed ? "50%" : 10,
                transform: collapsed ? "translate(50%, -50%)" : "translateY(-50%)",
                color: "#9CC5A1",
                opacity: collapsed ? 0 : 1,
                transition: "opacity 0.2s, background 0.15s, transform 0.15s",
              }}
            >
              <PanelLeft size={18} />
            </div>

            {collapsed && (
              <style>{`
                .sys-sidebar-header:hover .sys-sidebar-logo { opacity: 0 !important; }
                .sys-sidebar-header:hover .sys-collapse-trigger { opacity: 1 !important; }
                .sys-collapse-trigger { opacity: 0; right: 50% !important; transform: translate(50%, -50%) !important; }
              `}</style>
            )}
          </div>

          <div
            className="aices-sider-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              paddingBottom: 8,
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys as string[])}
              items={items}
              style={{ borderRight: 0, background: "transparent" }}
            />
          </div>

          <div className="logout-section" style={{ padding: 16 }}>
            <Button
              type="text"
              onClick={handleLogout}
              icon={<PoweroffOutlined />}
              style={{ width: "100%", textAlign: "left" }}
            >
              Logout
            </Button>
          </div>
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 240,
            minHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <Header
            className="aices-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "sticky",
              top: 0,
              zIndex: 90,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {cfg.title}
            </Title>
          </Header>

          <Content
            style={{
              padding: 24,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              background: "#f6fbf8",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
