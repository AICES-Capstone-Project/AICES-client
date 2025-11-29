import React, { useEffect, useState, useCallback } from "react";
import {
	Popover,
	Badge,
	Button,
	Spin,
	Empty,
	Avatar,
	Dropdown,
	Tooltip,
	notification as antNotification,
} from "antd";
import type { MenuProps } from "antd";
import {
	BellOutlined,
	MoreOutlined,
	CheckOutlined,
	SettingOutlined,
	BellFilled,
	InfoCircleOutlined,
	CheckCircleOutlined,
	DollarOutlined,
	FileTextOutlined,
	UserAddOutlined,
	TeamOutlined,
	EllipsisOutlined,
	ReloadOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { notificationService } from "../../services/notificationService";
import { useNotificationSignalR } from "../../hooks/useNotificationSignalR";
import type { Notification } from "../../types/notification.types";

// Helper: format time like Facebook
const formatTimeAgo = (dateStr: string) => {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);
	const diffWeek = Math.floor(diffDay / 7);

	if (diffSec < 60) return "Vừa xong";
	if (diffMin < 60) return `${diffMin} phút`;
	if (diffHour < 24) return `${diffHour} giờ`;
	if (diffDay < 7) return `${diffDay} ngày`;
	if (diffWeek < 4) return `${diffWeek} tuần`;
	return date.toLocaleDateString("vi-VN");
};

// Get notification icon based on type
const getNotificationIcon = (type: string) => {
	const typeMap: Record<string, { icon: React.ReactNode; color: string }> = {
		System: { icon: <InfoCircleOutlined />, color: "#1890ff" },
		CompanyApproved: { icon: <CheckCircleOutlined />, color: "#52c41a" },
		Job: { icon: <FileTextOutlined />, color: "#722ed1" },
		Payment: { icon: <DollarOutlined />, color: "#faad14" },
		Subscription: { icon: <CheckCircleOutlined />, color: "#13c2c2" },
		JobCreated: { icon: <FileTextOutlined />, color: "#722ed1" },
		CandidateApplied: { icon: <UserAddOutlined />, color: "#eb2f96" },
		CompanySubscriptionPurchased: {
			icon: <CheckCircleOutlined />,
			color: "#52c41a",
		},
		PaymentSuccess: { icon: <DollarOutlined />, color: "#52c41a" },
		UserRegistered: { icon: <TeamOutlined />, color: "#1890ff" },
	};

	return typeMap[type] || { icon: <BellFilled />, color: "#1890ff" };
};

interface NotificationDropdownProps {
	className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	className,
}) => {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	// Handle new notification from SignalR
	const handleNewNotification = useCallback((newNotif: Notification) => {
		console.log("📨 New notification received:", newNotif);

		// Add to notifications list
		setNotifications((prev) => {
			// Check if notification already exists
			const exists = prev.some((n) => n.notifId === newNotif.notifId);
			if (exists) return prev;
			return [newNotif, ...prev];
		});

		// Show toast notification
		const { icon, color } = getNotificationIcon(newNotif.type);
		antNotification.open({
			message: (
				<span className="font-semibold text-gray-900">Thông báo mới</span>
			),
			description: (
				<div>
					<p
						className="text-gray-700 mb-1"
						dangerouslySetInnerHTML={{ __html: newNotif.message }}
					/>
					{newNotif.detail && (
						<p className="text-gray-500 text-sm">{newNotif.detail}</p>
					)}
				</div>
			),
			icon: <Avatar size={32} style={{ backgroundColor: color }} icon={icon} />,
			placement: "topRight",
			duration: 5,
			className: "notification-toast",
			onClick: () => {
				setOpen(true);
			},
		});
	}, []);

	// SignalR connection
	const { isConnected } = useNotificationSignalR({
		onNewNotification: handleNewNotification,
		enabled: true,
	});

	// Load notifications from API
	const loadNotifications = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await notificationService.getMyNotifications();
			if (response.status === "Success" && response.data) {
				// Sort by createdAt desc
				const sorted = [...response.data].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				setNotifications(sorted);
			} else if (response.status === "Error" || response.message) {
				setError(response.message || "Không thể tải thông báo");
			}
		} catch (err) {
			console.error("Failed to load notifications:", err);
			setError("Không thể tải thông báo. Vui lòng thử lại.");
		}
		setLoading(false);
	}, []);

	// Load notifications on mount and when dropdown opens
	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	useEffect(() => {
		if (open) {
			loadNotifications();
		}
	}, [open, loadNotifications]);

	const handleMarkAsRead = async (notifId: number, e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			const response = await notificationService.markAsRead(notifId);
			if (response.status === "Success") {
				setNotifications((prev) =>
					prev.map((n) => (n.notifId === notifId ? { ...n, isRead: true } : n))
				);
			}
		} catch (error) {
			console.error("Failed to mark as read:", error);
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			// Mark all unread notifications as read
			const unreadNotifs = notifications.filter((n) => !n.isRead);
			await Promise.all(
				unreadNotifs.map((n) => notificationService.markAsRead(n.notifId))
			);
			setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
		} catch (error) {
			console.error("Failed to mark all as read:", error);
		}
	};

	const handleNotificationClick = async (notif: Notification) => {
		if (!notif.isRead) {
			await notificationService.markAsRead(notif.notifId);
			setNotifications((prev) =>
				prev.map((n) =>
					n.notifId === notif.notifId ? { ...n, isRead: true } : n
				)
			);
		}
		// TODO: Navigate to notification detail or related page
		setOpen(false);
	};

	const filteredNotifications =
		activeTab === "unread"
			? notifications.filter((n) => !n.isRead)
			: notifications;

	const moreMenuItems: MenuProps["items"] = [
		{
			key: "markAllRead",
			icon: <CheckOutlined />,
			label: t("notification.markAllAsRead", "Đánh dấu tất cả đã đọc"),
			onClick: handleMarkAllAsRead,
		},
		{
			key: "settings",
			icon: <SettingOutlined />,
			label: t("notification.settings", "Cài đặt thông báo"),
		},
	];

	const content = (
		<div className="w-[360px] max-h-[80vh] flex flex-col bg-white">
			{/* Header */}
			<div className="flex items-center justify-between px-4 pt-3 pb-2">
				<div className="flex items-center gap-2">
					<h3 className="text-2xl font-bold text-gray-900 m-0">
						{t("notification.title", "Thông báo")}
					</h3>
					{/* Connection status indicator */}
					<Tooltip
						title={
							isConnected
								? t("notification.connected", "Đã kết nối realtime")
								: t("notification.disconnected", "Chưa kết nối realtime")
						}
					>
						<span
							className={`w-2 h-2 rounded-full ${
								isConnected ? "bg-green-500" : "bg-gray-400"
							}`}
						/>
					</Tooltip>
				</div>
				<Dropdown
					menu={{ items: moreMenuItems }}
					trigger={["click"]}
					placement="bottomRight"
				>
					<Button
						type="text"
						icon={<MoreOutlined />}
						className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
					/>
				</Dropdown>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 px-4 pb-3">
				<button
					className={`px-3 py-2 rounded-full text-[15px] font-semibold transition-all border-none cursor-pointer ${
						activeTab === "all"
							? "bg-blue-50 text-blue-600"
							: "bg-gray-100 text-gray-900 hover:bg-gray-200"
					}`}
					onClick={() => setActiveTab("all")}
				>
					{t("notification.all", "Tất cả")}
				</button>
				<button
					className={`px-3 py-2 rounded-full text-[15px] font-semibold transition-all border-none cursor-pointer ${
						activeTab === "unread"
							? "bg-blue-50 text-blue-600"
							: "bg-gray-100 text-gray-900 hover:bg-gray-200"
					}`}
					onClick={() => setActiveTab("unread")}
				>
					{t("notification.unread", "Chưa đọc")}
				</button>
			</div>

			{/* Section Header */}
			<div className="flex items-center justify-between px-4 py-2">
				<span className="text-[17px] font-semibold text-gray-900">
					{t("notification.earlier", "Trước đó")}
				</span>
				<Button
					type="link"
					className="text-[15px] text-blue-600 p-0 h-auto hover:bg-transparent"
				>
					{t("notification.seeAll", "Xem tất cả")}
				</Button>
			</div>

			{/* Notification List */}
			<div className="flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
				{loading ? (
					<div className="flex items-center justify-center py-10">
						<Spin />
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center py-10 px-4">
						<ExclamationCircleOutlined className="text-4xl text-gray-400 mb-3" />
						<p className="text-gray-500 text-center mb-3">{error}</p>
						<Button
							type="primary"
							icon={<ReloadOutlined />}
							onClick={loadNotifications}
							className="bg-blue-500 hover:bg-blue-600"
						>
							{t("notification.retry", "Thử lại")}
						</Button>
					</div>
				) : filteredNotifications.length === 0 ? (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={t("notification.empty", "Không có thông báo")}
						className="py-10"
					/>
				) : (
					filteredNotifications.map((notif) => {
						const { icon, color } = getNotificationIcon(notif.type);
						const itemMenuItems: MenuProps["items"] = !notif.isRead
							? [
									{
										key: "markRead",
										icon: <CheckOutlined />,
										label: t("notification.markAsRead", "Đánh dấu là đã đọc"),
										onClick: (info) => {
											info.domEvent.stopPropagation();
											handleMarkAsRead(
												notif.notifId,
												info.domEvent as unknown as React.MouseEvent
											);
										},
									},
							  ]
							: [];

						return (
							<div
								key={notif.notifId}
								className={`group flex items-start p-2 mx-2 rounded-lg cursor-pointer transition-colors ${
									!notif.isRead
										? "bg-blue-50 hover:bg-blue-100"
										: "hover:bg-gray-100"
								}`}
								onClick={() => handleNotificationClick(notif)}
							>
								{/* Avatar */}
								<div className="flex-shrink-0 mr-3">
									<Avatar
										size={56}
										style={{ backgroundColor: color }}
										icon={icon}
									/>
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="text-[15px] leading-tight text-gray-900 mb-0.5">
										<span
											className="line-clamp-3"
											dangerouslySetInnerHTML={{
												__html: notif.message,
											}}
										/>
									</div>
									{notif.detail && (
										<div className="text-[13px] text-gray-500 line-clamp-2 mb-0.5">
											{notif.detail}
										</div>
									)}
									<div
										className={`text-[13px] mt-0.5 ${
											!notif.isRead
												? "text-blue-600 font-semibold"
												: "text-gray-500"
										}`}
									>
										{formatTimeAgo(notif.createdAt)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex-shrink-0 flex items-center gap-1 pl-2 min-w-[50px] justify-end">
									{!notif.isRead && (
										<Tooltip
											title={t("notification.unreadIndicator", "Chưa đọc")}
										>
											<span className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0" />
										</Tooltip>
									)}
									{itemMenuItems.length > 0 && (
										<Dropdown
											menu={{ items: itemMenuItems }}
											trigger={["click"]}
											placement="bottomRight"
										>
											<Button
												type="text"
												icon={<EllipsisOutlined />}
												className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
												onClick={(e) => e.stopPropagation()}
											/>
										</Dropdown>
									)}
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* Footer */}
			{filteredNotifications.length > 0 && (
				<div className="border-t border-gray-200 p-1">
					<Button
						type="link"
						block
						className="text-gray-900 text-[15px] font-semibold h-11 rounded-lg hover:bg-gray-100"
					>
						{t("notification.seePrevious", "Xem các thông báo trước đó")}
					</Button>
				</div>
			)}
		</div>
	);

	return (
		<Popover
			content={content}
			trigger="click"
			open={open}
			onOpenChange={setOpen}
			placement="bottomRight"
			overlayInnerStyle={{ padding: 0, borderRadius: 8 }}
			arrow={false}
		>
			<Badge count={unreadCount} size="default" className={className}>
				<Button
					type="text"
					icon={
						<BellOutlined
							className="text-xl"
							style={{ color: open ? "#1877f2" : undefined }}
						/>
					}
					className={`w-10 h-10 rounded-full flex items-center justify-center ${
						open ? "bg-blue-50" : "bg-gray-200 hover:bg-gray-300"
					}`}
				/>
			</Badge>
		</Popover>
	);
};

export default NotificationDropdown;
