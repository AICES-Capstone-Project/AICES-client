import { useState, useEffect } from "react";
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Typography,
    Badge,
} from "antd";
import type { MenuProps } from "antd";
import {
    FileUser,
    PanelLeft,
    SwatchBook,
    Users,
    Building,
    ChartLine,
    BadgeDollarSign,
    Settings,
    LogOut,
    UserCog,
    Rocket,
    Bell,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo_long.png";
import defaultAvatar from "../../assets/images/Avatar_Default.jpg";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutUser } from "../../stores/slices/authSlice";
import { APP_ROUTES, ROLES, STORAGE_KEYS } from "../../services/config";
import { notificationService } from "../../services/notificationService";
import { useNotificationSignalR } from "../../hooks/useNotificationSignalR";
import { companySubscriptionService } from "../../services/companySubscriptionService";

const { Text } = Typography;
const { Sider, Content } = Layout;

export default function CompanyLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [subscriptionName, setSubscriptionName] = useState("");
    const [notifCount, setNotifCount] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useAppSelector((s) => s.auth.user);
    const userRole = user?.roleName ?? null;
    const hasCompany = Boolean(user?.companyName);

    const defaultCompanyRoute = hasCompany
        ? APP_ROUTES.COMPANY_DASHBOARD
        : APP_ROUTES.COMPANY_MY_APARTMENTS;

    const selectedKey = location.pathname.startsWith(APP_ROUTES.COMPANY)
        ? location.pathname
        : defaultCompanyRoute;

    const iconStyle = { color: "var(--color-primary-medium)", fontWeight: "bold" };

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser());
        } finally {
            navigate("/");
        }
    };

    useEffect(() => {
        const handler = (e: Event) => {
            const anyE = e as CustomEvent<{ count: number }>;
            setNotifCount(anyE?.detail?.count ?? 0);
        };
        window.addEventListener("notifications:count", handler as EventListener);
        return () =>
            window.removeEventListener(
                "notifications:count",
                handler as EventListener
            );
    }, []);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
            : null;

    useNotificationSignalR({
        enabled: !!token,
        onNewNotification: (n) => {
            if (!n.isRead) setNotifCount((s) => s + 1);
        },
    });

    useEffect(() => {
        const load = async () => {
            try {
                const resp = await notificationService.getMyNotifications();
                if (resp?.status === "Success" && Array.isArray(resp.data)) {
                    setNotifCount(resp.data.filter((n: any) => !n.isRead).length);
                }
            } catch { }
        };
        load();
    }, []);

    useEffect(() => {
        if (!hasCompany) return;
        companySubscriptionService
            .getCurrentSubscription()
            .then((res) => {
                if (res.status === "Success" && res.data) {
                    setSubscriptionName(res.data.subscriptionName);
                }
            })
            .catch(() => { });
    }, [hasCompany]);

    const displayBadge =
        notifCount > 0 ? (notifCount > 99 ? "99+" : notifCount) : undefined;

    const mainMenuItems = [
        ...(hasCompany
            ? [
                {
                    key: APP_ROUTES.COMPANY_DASHBOARD,
                    icon: <ChartLine size={18} style={iconStyle} />,
                    label: <Link to={APP_ROUTES.COMPANY_DASHBOARD}>Dashboard</Link>,
                },
            ]
            : []),
        {
            key: APP_ROUTES.COMPANY_MY_APARTMENTS,
            icon: <Building size={18} style={iconStyle} />,
            label: <Link to={APP_ROUTES.COMPANY_MY_APARTMENTS}>My Company</Link>,
        },
        {
            key: APP_ROUTES.COMPANY_NOTIFICATION,
            icon: (
                <Badge count={displayBadge} size="small">
                    <Bell size={18}  />
                </Badge>
            ),
            label: <Link to={APP_ROUTES.COMPANY_NOTIFICATION}>Notification</Link>,
        },
        ...(userRole?.toLowerCase() === ROLES.Hr_Manager?.toLowerCase()
            ? [
                {
                    key: APP_ROUTES.COMPANY_STAFFS,
                    icon: <Users size={18} style={iconStyle} />,
                    label: <Link to={APP_ROUTES.COMPANY_STAFFS}>Staffs</Link>,
                },
            ]
            : []),
        ...(hasCompany
            ? [
                {
                    key: APP_ROUTES.COMPANY_JOBS,
                    icon: <SwatchBook size={18} style={iconStyle} />,
                    label: <Link to={APP_ROUTES.COMPANY_JOBS}>Jobs</Link>,
                },
                {
                    key: APP_ROUTES.COMPANY_CAMPAIN,
                    icon: <Rocket size={18} style={iconStyle} />,
                    label: <Link to={APP_ROUTES.COMPANY_CAMPAIN}>Campaign</Link>,
                },
                {
                    key: APP_ROUTES.COMPANY_CANDIDATE,
                    icon: <FileUser size={18} style={iconStyle} />,
                    label: <Link to={APP_ROUTES.COMPANY_CANDIDATE}>Candidate</Link>,
                },
            ]
            : []),
    ];

    const userMenuItems: MenuProps["items"] = [
        ...(userRole?.toLowerCase() === ROLES.Hr_Manager?.toLowerCase() && hasCompany
            ? [
                {
                    key: APP_ROUTES.COMPANY_SUBSCRIPTIONS,
                    icon: <BadgeDollarSign size={18} style={iconStyle}/>,
                    label: <Link to={APP_ROUTES.COMPANY_SUBSCRIPTIONS}>Subscription</Link>,
                },
            ]
            : []),
        {
            key: APP_ROUTES.COMPANY_SETTINGS,
            icon: <Settings size={18} style={iconStyle} />,
            label: <Link to={APP_ROUTES.COMPANY_SETTINGS}>Settings</Link>,
        },
        { type: "divider" },
        {
            key: "logout",
            icon: <LogOut size={18} />,
            danger: true,
            label: "Logout",
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                trigger={null}
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    width: collapsed ? "6%" : "15%",
                    background: "#fff",
                    borderRight: "1px solid #f0f0f0",
                    overflow: "hidden",
                }}
            >

                <div
                    className="sidebar-header"
                    style={{
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "1px solid #f0f0f0",
                        position: "relative",
                        cursor: collapsed ? "pointer" : "default",
                    }}
                    onClick={collapsed ? () => setCollapsed(false) : undefined}
                >
                    <img
                        src={logo}
                        alt="logo"
                        className="sidebar-logo"
                        style={{
                            height: 32,
                            maxWidth: collapsed ? 40 : "70%",
                            objectFit: "contain",
                            transition: "opacity 0.2s",
                        }}
                    />
                    <div
                        onClick={!collapsed ? () => setCollapsed(true) : undefined}
                        className="collapse-trigger"
                        style={{
                            cursor: "pointer",
                            color: "var(--color-primary-light)",
                            fontSize: 14,
                            padding: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: collapsed ? 0 : 1,
                            transition: "opacity 0.2s, transform 0.15s, background 0.15s",
                            position: "absolute",
                            top: "50%",
                            right: 12,
                            transform: "translateY(-50%)",
                            zIndex: 5,
                        }}
                    >
                        <PanelLeft size={16} />
                    </div>
                    
                    {/* Hover icon for collapsed state */}
                    {collapsed && (
                        <div
                            className="expand-hint"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                opacity: 0,
                                transition: "opacity 0.2s",
                                color: "var(--color-primary-light)",
                                fontSize: 14,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 6,
                            }}
                        >
                            <PanelLeft size={16} style={{ transform: "scaleX(-1)" }} />
                        </div>
                    )}
                    
                    {collapsed && (
                        <style>{`
                            .sidebar-header:hover .sidebar-logo {
                                opacity: 0.3;
                            }
                            .sidebar-header:hover .expand-hint {
                                opacity: 1 !important;
                            }
                        `}</style>
                    )}
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 64,        
                        bottom: 72,     
                        left: 0,
                        right: 0,
                        overflowY: "auto",
                    }}
                >

                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        items={mainMenuItems}
                        style={{ borderRight: 0 }}
                        theme="light"
                        className="custom-menu"
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 72,           
                        padding: 8,
                        borderTop: "1px solid #f0f0f0",
                        background: "#fff",
                    }}
                >

                    <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                cursor: "pointer",
                                padding: 6,
                                borderRadius: 8,
                            }}
                        >
                            <Avatar
                                src={user?.avatarUrl || defaultAvatar}
                                icon={<UserCog />}
                                size={collapsed ? 40 : 28}
                            />

                            {!collapsed && (
                                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                                    <Text strong ellipsis>
                                        {user?.fullName || user?.email}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {subscriptionName || "Upgrade"}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </Dropdown>
                </div>

            </Sider>

            <Layout
                style={{
                    marginLeft: collapsed ? "6%" : "15%",
                    transition: "margin-left 0.2s",
                }}
            >
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
