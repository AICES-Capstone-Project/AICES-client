//---------------------------------------------------------------
// Đây là file TESTTT, đừng quan tâm nó
//---------------------------------------------------------------

import { get, post } from "./api";
import { API_CONFIG } from "./config";

// Types
export interface Notification {
	id: string;
	message: string;
	detail: string;
	type: "info" | "success" | "warning" | "error";
	isRead: boolean;
	createdAt: string;
}

export interface NotificationDetail extends Notification {}

// Request type for test notification
export interface TestNotificationRequest {
	userId: number;
	type: number; // NotificationTypeEnum (1-51)
	message: string;
	detail?: string;
}

// Base URL cho SignalR (bỏ /api vì SignalR Hub map ở root)
export const SIGNALR_HUB_URL = `${API_CONFIG.BASE_URL.replace(
	"/api",
	""
)}/notificationHub`;

// ⚠️ Nếu BASE_URL = https://localhost:7220/api
// → SIGNALR_HUB_URL = https://localhost:7220/notificationHub ✅

// Notification Service
export const notificationService = {
	// Get all notifications for current user
	getMyNotifications: () => get<Notification[]>("/notifications/me"),

	// Mark notification as read
	markAsRead: (notifId: string) =>
		post<void, void>(`/notifications/mark-as-read/${notifId}`),

	// Get notification detail
	getDetail: (notifId: string) =>
		get<NotificationDetail>(`/notifications/detail/${notifId}`),

	// Send test notification (requires System_Admin or System_Manager role)
	sendTestNotification: (request: TestNotificationRequest) =>
		post<void, TestNotificationRequest>(`/notifications/test/send`, request),
};
