import React from "react";
import { Layout, Menu, Button, Typography, ConfigProvider } from "antd";
import "../../assets/styles/system.css";
import {
  DashboardOutlined,
  TeamOutlined,
  GlobalOutlined,
  // FileDoneOutlined,
  BranchesOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  // BellOutlined,
  // SettingOutlined,
  ApartmentOutlined,
  PartitionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RiseOutlined,
  PoweroffOutlined,
  TagsOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logoLong from "../../assets/logo/logo_long.png";

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
          key: APP_ROUTES.SYSTEM_TAXONOMY_LANGUAGE,
          icon: <GlobalOutlined />,
          label: (
            <Link to={APP_ROUTES.SYSTEM_TAXONOMY_LANGUAGE}>Languages</Link>
          ),
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_LEVEL,
          icon: <RiseOutlined />,
          label: <Link to={APP_ROUTES.SYSTEM_TAXONOMY_LEVEL}>Levels</Link>,
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_CATEGORY,
          icon: <AppstoreOutlined />,
          label: (
            <Link to={APP_ROUTES.SYSTEM_TAXONOMY_CATEGORY}>Categories</Link>
          ),
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_SKILL,
          icon: <TagsOutlined />,
          label: <Link to={APP_ROUTES.SYSTEM_TAXONOMY_SKILL}>Skills</Link>,
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_SPECIALIZATION,
          icon: <ApartmentOutlined />,
          label: (
            <Link to={APP_ROUTES.SYSTEM_TAXONOMY_SPECIALIZATION}>
              Specializations
            </Link>
          ),
        },
        {
          key: APP_ROUTES.SYSTEM_TAXONOMY_RECRUITMENT_TYPE,
          icon: <BranchesOutlined />,
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
    // Feedbacks
    {
      key: APP_ROUTES.SYSTEM_FEEDBACKS,
      icon: <MessageOutlined />,
      label: <Link to={APP_ROUTES.SYSTEM_FEEDBACKS}>Feedbacks</Link>,
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
  background: linear-gradient(
    180deg,
    #c8e8d7 0%,     /* đậm nhất - dưới */
    #e7f4ed 55%,    /* trung gian mềm */
    #ffffff 100%    /* nhạt nhất - trên */
  );
  border-bottom: 1px solid #d7eee3;
  box-shadow: 0 2px 10px rgba(15, 32, 39, 0.12);
}

  .ant-layout-sider-trigger {
    background: linear-gradient(90deg, #0F2027 0%, #28623A 100%) !important;
    color: #E9F5EC !important;
    border-top: 1px solid #1A302E;
  }


        .aices-sider {
    background: linear-gradient(90deg, #0F2027 0%, #16392E 40%, #1F4A38 75%, #28623A 100%) !important;
    border-right: 1px solid rgba(255,255,255,0.06) !important;
    box-shadow: 4px 0 18px rgba(0, 0, 0, 0.45); /* thêm dòng này */
  }


        .aices-brand {
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 14px;
  color: #FFD500;

  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* giúp nổi trên nền xanh */
}


        .aices-sider .ant-menu {
          background: transparent !important;
        }

        .aices-sider .ant-menu-item,
        .aices-sider .ant-menu-submenu-title {
          transition: background-color .18s ease, transform .12s ease;
          border-radius: 999px !important;
          margin: 4px 6px !important;
          color: #E9F5EC !important;
        }
          .aices-sider .ant-menu-sub .ant-menu-item {
  border-radius: 999px !important;
  margin: 2px 10px !important;
  padding-left: 40px !important; /* vẫn thụt vào nhẹ */
  font-size: 13px;
  opacity: 0.9;
}
        .aices-sider .ant-menu-item-icon,
        .aices-sider .ant-menu-submenu-arrow {
          color: #9CC5A1 !important;
        }

        .aices-sider .ant-menu-item:hover,
        .aices-sider .ant-menu-submenu-title:hover {
          background: rgba(40, 98, 58, 0.18) !important;
          transform: translateX(2px);
        }

        .aices-sider .ant-menu-item-selected {
          background: rgba(40, 98, 58, 0.28) !important;
          color: #E9F5EC !important;
          box-shadow: 0 6px 18px rgba(0,0,0,0.32);
        }

        .aices-sider .ant-menu-item-selected .ant-menu-item-icon {
          color: #E9F5EC !important;
        }

        /* Hover chung cho button text (Logout + nút toggle) */
        .ant-btn-text:hover {
          background: rgba(40, 98, 58, 0.25) !important;
          color: #E9F5EC !important;
        }

        /* Phần còn lại giữ nguyên */
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
            .aices-sider .logout-section {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .aices-sider .logout-section .ant-btn-text {
    color: #9CC5A1;
    opacity: 0.85;
  }

  .aices-sider .logout-section .ant-btn-text:hover {
    opacity: 1;
    background: rgba(40, 98, 58, 0.28) !important;
  }
.aices-sider {
  overflow: hidden; /* ⭐ KHÔNG CHO PILL TRÀN RA NGOÀI */
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
              justifyContent: "center",
              paddingInline: 12,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")} // điều hướng về trang chủ admin
          >
            {collapsed ? (
              <img
                src={logoLong}
                style={{ height: 28, objectFit: "contain" }}
              />
            ) : (
              <img
                src={logoLong}
                style={{ height: 36, objectFit: "contain" }}
              />
            )}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={items}
            style={{ flex: 1 }}
          />

          <div className="logout-section" style={{ padding: 16 }}>
            <Button
              type="text"
              onClick={handleLogout}
              icon={<PoweroffOutlined />}
              style={{
                width: "100%",
                textAlign: "left",
                // ❌ bỏ color ở đây để CSS mới ăn
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
              System Admin
            </Title>
          </Header>

          <Content
            style={{
              padding: 24,
              height: "calc(100vh - 64px)", // 64 = height header
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
