import { useState, useEffect } from "react"; 
import { Layout, Menu, Avatar, Dropdown, Typography, Button, Badge } from "antd";
import { notificationService } from "../../services/notificationService";
import { STORAGE_KEYS } from "../../services/config";
import { useNotificationSignalR } from "../../hooks/useNotificationSignalR";
import type { MenuProps } from "antd";
import { FileUser, PanelLeft, SwatchBook, Users, Building, ChartLine, BadgeDollarSign, Settings, LogOut, UserCog, Rocket, Bell} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo_long.png";
import defaultAvatar from "../../assets/images/Avatar_Default.jpg";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutUser } from "../../stores/slices/authSlice";
import { APP_ROUTES, ROLES } from "../../services/config";
import { companySubscriptionService } from "../../services/companySubscriptionService";

const { Text } = Typography;

const { Sider, Content } = Layout;

export default function CompanyLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [subscriptionName, setSubscriptionName] = useState<string>("");
    const location = useLocation();

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

    // Use `inherit` so icons follow the surrounding text color (avoids always using the "light" primary variable)
    const iconStyle = { color: "inherit", fontWeight: "bold" };
    const [notifCount, setNotifCount] = useState<number>(0);

    useEffect(() => {
        const handler = (e: Event) => {
            const anyE = e as CustomEvent<{ count: number }>;
            const c = anyE?.detail?.count ?? 0;
            setNotifCount(Number(c));
        };
        window.addEventListener("notifications:count", handler as EventListener);
        return () => window.removeEventListener("notifications:count", handler as EventListener);
    }, []);

    // Also subscribe to SignalR notifications directly so sidebar updates in real-time
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    useNotificationSignalR({
        onNewNotification: (n) => {
            try {
                if (!n.isRead) {
                    setNotifCount((s) => s + 1);
                }
            } catch (e) {
                // ignore
            }
        },
        enabled: !!token,
    });

    // Also fetch unread count directly so sidebar shows count even when header/dropdown isn't mounted
    useEffect(() => {
        const load = async () => {
            try {
                const resp = await notificationService.getMyNotifications();
                if (resp && resp.status === "Success" && Array.isArray(resp.data)) {
                    const unread = resp.data.filter((n: any) => !n.isRead).length;
                    setNotifCount(unread);
                }
            } catch (e) {
                // ignore errors here; listener/event will update when possible
                // console.error("Failed to load notifications for sidebar badge", e);
            }
        };
        load();
    }, []);
    
    // Fetch current subscription
    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await companySubscriptionService.getCurrentSubscription();
                console.log("Subscription API response:", response);
                if (response.status === "Success" && response.data) {
                    console.log("Setting subscription:", response.data.subscriptionName);
                    setSubscriptionName(response.data.subscriptionName);
                }
            } catch (error) {
                console.error("Failed to fetch subscription:", error);
            }
        };

        if (hasCompany) {
            fetchSubscription();
        }
    }, [hasCompany]);

    // Main navigation items (Dashboard -> AI CV Review)
    const displayBadge = notifCount > 0 ? (notifCount > 99 ? "99+" : notifCount) : undefined;

    const mainMenuItems = [
        // 1. Dashboard (Only if has company)
        ...(hasCompany ? [
            {
                key: APP_ROUTES.COMPANY_DASHBOARD,
                icon: <ChartLine size={18} style={iconStyle} />,
                label: <Link to={APP_ROUTES.COMPANY_DASHBOARD}>Dashboard</Link>,
            },
        ] : []),

        // 2. My Company (Always visible)
        {
            key: APP_ROUTES.COMPANY_MY_APARTMENTS,
            icon: <Building size={18} style={iconStyle} />,
            label: <Link to={APP_ROUTES.COMPANY_MY_APARTMENTS}>My Company</Link>,
        },
        {
            key: APP_ROUTES.COMPANY_NOTIFICATION,
            icon: (
                <Badge count={displayBadge} size="small" offset={[0, 0]}>
                    <Bell size={18} style={iconStyle} />
                </Badge>
            ),
            label: <Link to={APP_ROUTES.COMPANY_NOTIFICATION}>Notification</Link>,
        },

        // 3. Staffs (Only for HR Manager)
        ...(userRole?.toLowerCase() === ROLES.Hr_Manager?.toLowerCase()
            ? [
                {
                    key: APP_ROUTES.COMPANY_STAFFS,
                    icon: <Users size={18} style={iconStyle} />,
                    label: <Link to={APP_ROUTES.COMPANY_STAFFS}>Staffs</Link>,
                },
            ]
            : []),

        // 4. Jobs & AI Screening (Only if has company)
        ...(hasCompany ? [
            {
                key: APP_ROUTES.COMPANY_JOBS,
                icon: <SwatchBook size={18} style={iconStyle} />,
                label: <Link to={APP_ROUTES.COMPANY_JOBS}>Jobs</Link>,
            },
            {
                key: APP_ROUTES.COMPANY_CAMPAIN,
                icon: <Rocket size={18}  style={iconStyle} />,
                label: <Link to={APP_ROUTES.COMPANY_CAMPAIN}>Campain</Link>,
            },
            {
                key: APP_ROUTES.COMPANY_CANDIDATE,
                icon: <FileUser size={18} style={iconStyle} />,
                label: <Link to={APP_ROUTES.COMPANY_CANDIDATE}>Candidate</Link>,
            },
        ] : []),
    ];

    // Dropdown menu items for user menu at bottom
    const userMenuItems: MenuProps['items'] = [
        // Subscription Plans (Only for HR Manager)
        ...(userRole?.toLowerCase() === ROLES.Hr_Manager?.toLowerCase() && hasCompany
            ? [
                {
                    key: APP_ROUTES.COMPANY_SUBSCRIPTIONS,
                    icon: <BadgeDollarSign size={18} style={iconStyle} />,
                    label: <Link to={APP_ROUTES.COMPANY_SUBSCRIPTIONS}>Subscription Plans</Link>,
                    title: "",
                },
            ]
            : []),
        {
            key: APP_ROUTES.COMPANY_SETTINGS,
            icon: <Settings size={18} style={iconStyle} />,
            label: <Link to={APP_ROUTES.COMPANY_SETTINGS}>Settings</Link>,
            title: "",
        },
        {
            type: 'divider',
        },
        {
            key: "logout",
            icon: <LogOut size={18} />,
            danger: true,
            label: "Logout",
            onClick: () => handleLogout(),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh", paddingRight: "8px" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="lg"
                trigger={null}
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
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header: Logo + Collapse Button (10% height when expanded) */}
                <div
                    className="sidebar-header"
                    style={{
                        height: collapsed ? 64 : "10vh",
                        minHeight: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingInline: collapsed ? 12 : 16,
                        borderBottom: "1px solid #f0f0f0",
                        position: "relative",
                    }}
                >
                    <Link
                        to="/"
                        className="sidebar-logo"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            flex: "none",
                            opacity: 1,
                            transition: "opacity 0.2s",
                        }}
                    >
                        <img
                            src={logo}
                            alt="AICES"
                            style={{
                                height: 32,
                                maxWidth: collapsed ? "48px" : "70%",
                                objectFit: "contain",
                                display: "block",
                                margin: "0 auto",
                            }}
                        />
                    </Link>
                    <div
                        onClick={() => setCollapsed(!collapsed)}
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
                            left: collapsed ? "50%" : "auto",
                            right: collapsed ? "auto" : 12,
                            transform: collapsed ? "translate(-50%, -50%)" : "translateY(-50%)",
                            zIndex: 5,
                        }}
                    >
                        <PanelLeft size={16} />
                    </div>
                    {collapsed && (
                        <style>{`
                            .sidebar-header:hover .sidebar-logo {
                                opacity: 0 !important;
                            }
                            .sidebar-header:hover .collapse-trigger {
                                opacity: 1 !important;
                            }
                            .collapse-trigger {
                                opacity: 0;
                            }
                        `}</style>
                    )}
                </div>

                {/* Main Menu (70% height when expanded, scrollable) */}
                <div style={{ height: collapsed ? "calc(100vh - 64px - 80px)" : "77vh", overflow: "auto" }}>
                    <Menu
                        mode="inline"
                        className="custom-menu"
                        selectedKeys={[selectedKey]}
                        items={mainMenuItems}
                        style={{ 
                            borderRight: 0,
                            paddingTop: 8,
                        }}
                    />
                </div>

                {/* User Menu (footer) - 20% height when expanded */}
                <div
                    style={{
                        height: collapsed ? 80 : "13vh",
                        padding: collapsed ? "4px" : "4px",
                        boxSizing: "border-box",
                        background: "transparent",
                    }}
                >
                    <Dropdown 
                        menu={{ items: userMenuItems }} 
                        trigger={['click']}
                        placement="topLeft"
                    >
                        <div
                            style={
                                collapsed
                                    ? { display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 8 }
                                    : { display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 8, borderRadius: 8, transition: "background 0.2s" }
                            }
                            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <Avatar 
                                src={user?.avatarUrl || defaultAvatar}
                                icon={<UserCog  />}
                                size={collapsed ? 40 : 27}
                            />
                            {!collapsed && (
                                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <div style={{ minWidth: 0 }}>
                                        <Text 
                                            strong 
                                            style={{ 
                                                display: "block",
                                                fontSize: 14,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {user?.fullName || user?.email || "User"}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {subscriptionName || 'Upgrade'}
                                        </Text>
                                    </div>

                                    {subscriptionName?.toLowerCase() === 'free' && (
                                        <Button
                                            className="company-btn"
                                            size="small"
                                            onClick={() => navigate('/subscriptions')}
                                            style={{ padding: '1px 4px', borderRadius: 12, whiteSpace: 'nowrap', fontSize: 12, height: 25, lineHeight: '20px' }}
                                        >
                                            Upgrade
                                        </Button>
                                    )}
                                </div>
                            )}
                            {/* Dropdown chevron removed per UI update */}
                        </div>
                    </Dropdown>
                </div>
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