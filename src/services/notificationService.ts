import { get, post } from "./api";
import { API_ENDPOINTS } from "./config";
import type { Notification } from "../types/notification.types";

export interface NotificationResponse {
	notifications: Notification[];
	unreadCount: number;
}

export const notificationService = {
	// Lấy danh sách thông báo của user
	getMyNotifications: () =>
		get<Notification[]>(API_ENDPOINTS.NOTIFICATION.AUTH_GET),

	// Đánh dấu thông báo đã đọc
	markAsRead: (notificationId: number) =>
		post<void>(API_ENDPOINTS.NOTIFICATION.AUTH_MARK_AS_READ(notificationId)),

	// Đánh dấu tất cả thông báo đã đọc
	markAllAsRead: () =>
		post<void>(API_ENDPOINTS.NOTIFICATION.AUTH_MARK_ALL_AS_READ),
};

export default notificationService;
