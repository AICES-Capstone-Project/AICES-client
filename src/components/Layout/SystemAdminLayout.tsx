import React from "react";
import { Layout, Menu, Button, Typography, ConfigProvider } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  // FileDoneOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  // BellOutlined,
  // SettingOutlined,
  ApartmentOutlined,
  // TagsOutlined,
  PartitionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { APP_ROUTES } from "../../services/config";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const GOLD = {
  primary: "#F5C400",
  hover: "#E1B800",
  active: "#CFA800",
  cream: "#FFFBE6",
  cream2: "#FFF7D6",
  border: "#FFE58F",
  textOnCream: "#614700",
  shadow: "rgba(245,196,0,0.18)",
};

export default function SystemAdminLayout() {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    // Companies group (gồm Company Management + Subscription History)
    {
      key: "companies",
      icon: <ApartmentOutlined />,
      label: "Companies",
      children: [
        {
          key: APP_ROUTES.SYSTEM_COMPANY,
          label: <Link to={APP_ROUTES.SYSTEM_COMPANY}>Company Management</Link>,
        },
        {
          key: APP_ROUTES.SYSTEM_SUBSCRIPTIONS_COMPANIES,
          label: (
            <Link to={APP_ROUTES.SYSTEM_SUBSCRIPTIONS_COMPANIES}>
              Subscribed Companies
            </Link>
          ),
        },
      ],
    },
    // Subscriptions: chỉ còn Plans
    {
      key: APP_ROUTES.SYSTEM_SUBSCRIPTIONS,
      icon: <BarChartOutlined />,
      label: <Link to={APP_ROUTES.SYSTEM_SUBSCRIPTIONS}>Subscriptions</Link>,
    },

    // Taxonomy
    {
      key: "taxonomy",
      icon: <PartitionOutlined />,
      label: "Taxonomy Management",
      children: [
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_CATEGORY,
          label: (
            <Link to={APP_ROUTES.SYSTEM_TAXONOMY_CATEGORY}>Categories</Link>
          ),
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_SKILL,
          label: <Link to={APP_ROUTES.SYSTEM_TAXONOMY_SKILL}>Skills</Link>,
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_SPECIALIZATION,
          label: (
            <Link to={APP_ROUTES.SYSTEM_TAXONOMY_SPECIALIZATION}>
              Specializations
            </Link>
          ),
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_RECRUITMENT_TYPE,
          label: (
            <Link to={APP_ROUTES.SYSTEM_TAXONOMY_RECRUITMENT_TYPE}>
              Recruitment Types
            </Link>
          ),
        },
      ],
    },
    // Content
    {
      key: "content",
      icon: <AppstoreOutlined />,
      label: "Content",
      children: [
        {
          key: APP_ROUTES.SYSTEM_CONTENT_BANNERS,
          label: <Link to={APP_ROUTES.SYSTEM_CONTENT_BANNERS}>Banners</Link>,
        },
        {
          key: APP_ROUTES.SYSTEM_BLOGS,
          label: <Link to={APP_ROUTES.SYSTEM_BLOGS}>Blogs</Link>,
        },
      ],
    },
    // // Notifications
    // {
    //   key: "notifications",
    //   icon: <BellOutlined />,
    //   label: "Notifications",
    //   children: [
    //     {
    //       key: APP_ROUTES.SYSTEM_NOTIFICATION_TEMPLATES,
    //       label: (
    //         <Link to={APP_ROUTES.SYSTEM_NOTIFICATION_TEMPLATES}>
    //           Notification Templates
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: APP_ROUTES.SYSTEM_EMAIL_TEMPLATES,
    //       label: (
    //         <Link to={APP_ROUTES.SYSTEM_EMAIL_TEMPLATES}>Email Templates</Link>
    //       ),
    //     },
    //   ],
    // },
    // Reports
    // {
    //   key: APP_ROUTES.SYSTEM_REPORTS,
    //   icon: <FileDoneOutlined />,
    //   label: <Link to={APP_ROUTES.SYSTEM_REPORTS}>Reports</Link>,
    // },
    // System Settings
    // {
    //   key: "settings",
    //   icon: <SettingOutlined />,
    //   label: "System Settings",
    //   children: [
    //     {
    //       key: APP_ROUTES.SYSTEM_ROLES,
    //       label: <Link to={APP_ROUTES.SYSTEM_ROLES}>Roles & Permissions</Link>,
    //     },
    //     {
    //       key: APP_ROUTES.SYSTEM_AI_ENDPOINTS,
    //       label: <Link to={APP_ROUTES.SYSTEM_AI_ENDPOINTS}>AI Endpoints</Link>,
    //     },
    //     {
    //       key: APP_ROUTES.SYSTEM_FEATURE_FLAGS,
    //       label: (
    //         <Link to={APP_ROUTES.SYSTEM_FEATURE_FLAGS}>
    //           Feature Flags & Limits
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: APP_ROUTES.SYSTEM_EMAIL_CONFIG,
    //       label: (
    //         <Link to={APP_ROUTES.SYSTEM_EMAIL_CONFIG}>Email Configuration</Link>
    //       ),
    //     },
    //     {
    //       key: APP_ROUTES.SYSTEM_API_KEYS,
    //       label: <Link to={APP_ROUTES.SYSTEM_API_KEYS}>API Keys</Link>,
    //     },
    //   ],
    // },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: GOLD.primary,
          colorLink: GOLD.primary,
          colorText: "#1F1F1F",
          colorBorder: "#F0F0F0",
          borderRadius: 10,
          controlOutline: "rgba(245,196,0,0.28)",
          controlItemBgActive: GOLD.cream,
        },
        components: {
          Menu: {
            itemSelectedBg: GOLD.cream,
            itemActiveBg: GOLD.cream,
            itemSelectedColor: GOLD.textOnCream,
            itemBorderRadius: 8,
          },
          Button: {
            colorPrimary: GOLD.primary,
            colorPrimaryHover: GOLD.hover,
            colorPrimaryActive: GOLD.active,
            defaultBorderColor: GOLD.border,
            defaultColor: GOLD.textOnCream,
            defaultHoverBorderColor: GOLD.hover,
            borderRadius: 10,
          },
          Tag: {
            defaultBg: GOLD.cream,
            defaultColor: GOLD.textOnCream,
            defaultBorderColor: GOLD.border,
            borderRadiusSM: 8,
          },
          Pagination: {
            itemActiveBg: GOLD.cream,
            itemInputBg: "#fff",
            colorPrimary: GOLD.primary,
          },
          Input: {
            activeBorderColor: GOLD.primary,
            hoverBorderColor: GOLD.primary,
            activeShadow: `0 0 0 2px rgba(245,196,0,0.25)`,
            borderRadius: 10,
          },
          Table: {
            headerBg: "#FAFAFA",
            rowHoverBg: GOLD.cream2,
            borderColor: "#F5F5F5",
            headerSplitColor: "#F0F0F0",
          },
          Tabs: {
            itemActiveColor: GOLD.textOnCream,
            inkBarColor: GOLD.primary,
          },
          Badge: {
            colorBgDefault: GOLD.cream,
            colorText: GOLD.textOnCream,
          },
        } as any,
      }}
    >
      <style>{`
        .aices-header {
          background: linear-gradient(90deg, #FFFFFF, ${GOLD.cream});
          border-bottom: 1px solid #f0f0f0;
          box-shadow: 0 2px 10px ${GOLD.shadow};
        }
        .aices-sider {
          background: #fff !important;
          border-right: 1px solid #f0f0f0 !important;
        }
        .aices-brand {
          letter-spacing: 0.2px;
          background: linear-gradient(90deg, ${GOLD.primary}, ${GOLD.hover});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 1px 0 rgba(0,0,0,0.04);
        }
        .ant-menu-item {
          transition: background-color .18s ease, transform .12s ease;
          border-radius: 8px !important;
        }
        .ant-menu-item:hover {
          background: ${GOLD.cream};
          transform: translateX(2px);
        }
        .ant-btn-text:hover {
          background: ${GOLD.cream};
        }
        .ant-table-tbody > tr.ant-table-row:hover > td {
          background: ${GOLD.cream2} !important;
        }
        *::-webkit-scrollbar { width: 10px; height: 10px; }
        *::-webkit-scrollbar-track { background: #ffffff; }
        *::-webkit-scrollbar-thumb {
          background: ${GOLD.border};
          border-radius: 10px;
          border: 2px solid #ffffff;
        }
        *::-webkit-scrollbar-thumb:hover { background: ${GOLD.hover}; }
        .ant-input:focus, .ant-input-focused,
        .ant-select-focused .ant-select-selector,
        .ant-picker-focused, .ant-btn:focus-visible {
          box-shadow: 0 0 0 2px rgba(245,196,0,0.25) !important;
        }
      `}</style>

      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          width={240}
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
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              paddingInline: 16,
              fontWeight: 800,
              fontSize: 18,
            }}
            className="aices-brand"
          >
            {collapsed ? "S" : "System Admin"}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={items}
            style={{ flex: 1 }}
          />

          <div style={{ padding: 16, borderTop: "1px solid #f0f0f0" }}>
            <Button
              type="text"
              onClick={handleLogout}
              icon={<PoweroffOutlined />}
              style={{
                width: "100%",
                textAlign: "left",
                color: GOLD.primary,
              }}
            >
              Logout
            </Button>
          </div>
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 240, // 80 = width sider khi collapsed
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

          <Content
            style={{
              padding: 24,
              height: "calc(100vh - 64px)", // 64 = height header
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
