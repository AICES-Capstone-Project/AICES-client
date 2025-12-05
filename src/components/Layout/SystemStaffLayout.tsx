import React from "react";
import { Layout, Menu, Button, Typography, ConfigProvider } from "antd";
import "../../assets/styles/system.css";
import {
  DashboardOutlined,
  // FileDoneOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  // BellOutlined,
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

// Base cho System_Staff
const BASE_PATH = APP_ROUTES.SYSTEM_STAFF;

const toStaffPath = (systemRoute: string) =>
  systemRoute.replace(APP_ROUTES.SYSTEM, BASE_PATH);

export default function SystemStaffLayout() {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = location.pathname.startsWith(BASE_PATH)
    ? location.pathname
    : toStaffPath(APP_ROUTES.SYSTEM_DASHBOARD);

  // Menu cho System_Staff (theo use case bạn mô tả)
  const items = [
    // Dashboard
    {
      key: toStaffPath(APP_ROUTES.SYSTEM_DASHBOARD),
      icon: <DashboardOutlined />,
      label: (
        <Link to={toStaffPath(APP_ROUTES.SYSTEM_DASHBOARD)}>Dashboard</Link>
      ),
    },
    // Companies group: xem công ty + subscribed companies
    {
      key: "companies",
      icon: <ApartmentOutlined />,
      label: "Companies",
      children: [
        {
          key: toStaffPath(APP_ROUTES.SYSTEM_COMPANY),
          label: (
            <Link to={toStaffPath(APP_ROUTES.SYSTEM_COMPANY)}>
              Company Management
            </Link>
          ),
        },
        {
          key: toStaffPath(APP_ROUTES.SYSTEM_SUBSCRIPTIONS_COMPANIES),
          label: (
            <Link to={toStaffPath(APP_ROUTES.SYSTEM_SUBSCRIPTIONS_COMPANIES)}>
              Subscribed Companies
            </Link>
          ),
        },
      ],
    },
    // Subscriptions: chỉ còn 1 item, mở thẳng trang Plans
    {
      key: toStaffPath(APP_ROUTES.SYSTEM_SUBSCRIPTIONS),
      icon: <BarChartOutlined />,
      label: (
        <Link to={toStaffPath(APP_ROUTES.SYSTEM_SUBSCRIPTIONS)}>
          Subscriptions
        </Link>
      ),
    },

    // Taxonomy CRUD (Category, Skill, RecruitmentType, Specialization)
    {
      key: "taxonomy",
      icon: <PartitionOutlined />,
      label: "Taxonomy Management",
      children: [
        {
          key: toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_CATEGORY),
          label: (
            <Link to={toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_CATEGORY)}>
              Categories
            </Link>
          ),
        },
        {
          key: toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_SKILL),
          label: (
            <Link to={toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_SKILL)}>
              Skills
            </Link>
          ),
        },
        {
          key: toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_SPECIALIZATION),
          label: (
            <Link to={toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_SPECIALIZATION)}>
              Specializations
            </Link>
          ),
        },
        {
          key: toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_RECRUITMENT_TYPE),
          label: (
            <Link to={toStaffPath(APP_ROUTES.SYSTEM_TAXONOMY_RECRUITMENT_TYPE)}>
              Recruitment Types
            </Link>
          ),
        },
      ],
    },
    // Content: Blogs + Tags (Staff CRUD Blog)
    {
      key: "content",
      icon: <AppstoreOutlined />,
      label: "Content",
      children: [
        {
          key: toStaffPath(APP_ROUTES.SYSTEM_BLOGS),
          label: <Link to={toStaffPath(APP_ROUTES.SYSTEM_BLOGS)}>Blogs</Link>,
        },
      ],
    },
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
    #c8e8d7 0%,
    #e7f4ed 55%,
    #ffffff 100%
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
  box-shadow: 4px 0 18px rgba(0, 0, 0, 0.45);
  overflow: hidden; /* không cho pill tràn ra ngoài */
}

.aices-brand {
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 14px;
  color: #FFD500;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
  padding-left: 40px !important;
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

/* Table hover */
.ant-table-tbody > tr.ant-table-row:hover > td {
  background: ${GOLD.cream2} !important;
}

/* Scrollbar */
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: #ffffff; }
*::-webkit-scrollbar-thumb {
  background: ${GOLD.border};
  border-radius: 10px;
  border: 2px solid #ffffff;
}
*::-webkit-scrollbar-thumb:hover { background: ${GOLD.hover}; }

/* Focus states */
.ant-input:focus, .ant-input-focused,
.ant-select-focused .ant-select-selector,
.ant-picker-focused, .ant-btn:focus-visible {
  box-shadow: 0 0 0 2px rgba(245,196,0,0.25) !important;
}

/* Logout section */
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
            onClick={() => navigate("/")}
          >
            {collapsed ? (
              <img
                src="/src/assets/logo/logo_long.png"
                style={{ height: 28, objectFit: "contain" }}
              />
            ) : (
              <img
                src="/src/assets/logo/logo_long.png"
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
              }}
            >
              Logout
            </Button>
          </div>
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 240, // 80 = width khi collapse
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
              System Staff
            </Title>
          </Header>

          <Content
            style={{
              padding: 24,
              height: "calc(100vh - 64px)", // 64 = chiều cao header
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
