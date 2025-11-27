//---------------------------------------------------------------
// Đây là file TESTTT, đừng quan tâm nó
//---------------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
	notificationService,
	type Notification,
	type NotificationDetail,
	type TestNotificationRequest,
} from "../services/notificationService";
import { API_CONFIG, STORAGE_KEYS } from "../services/config";

// Utils
const API_BASE_URL = API_CONFIG.BASE_URL;
const getToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

// Types
type NotificationType = "info" | "success" | "warning" | "error";

interface Toast {
	id: string;
	message: string;
	type: NotificationType;
	onView?: () => void;
}

// Helper: format date
function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	const now = new Date();
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
	if (diff < 60) return `${diff} giây trước`;
	if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
	return `${date.getHours().toString().padStart(2, "0")}:${date
		.getMinutes()
		.toString()
		.padStart(2, "0")} ${date.getDate().toString().padStart(2, "0")}/${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${date.getFullYear()}`;
}

// Helper: map notification type number to string
function getNotificationType(type: string | number): NotificationType {
	const typeStr = typeof type === "number" ? type.toString() : type;
	const typeMap: Record<string, NotificationType> = {
		"1": "info",
		System: "info",
		"2": "success",
		CompanyApproved: "success",
		"3": "info",
		Job: "info",
		"4": "warning",
		Payment: "warning",
		"5": "info",
		Subscription: "info",
		"10": "info",
		JobCreated: "info",
		"20": "info",
		CandidateApplied: "info",
		"30": "success",
		CompanySubscriptionPurchased: "success",
		"40": "success",
		PaymentSuccess: "success",
		"50": "info",
		UserRegistered: "info",
	};
	return typeMap[typeStr] || "info";
}

// Helper: format notification type display
function formatNotificationType(type: string | number): string {
	const typeStr = typeof type === "number" ? type.toString() : type;
	const typeNameMap: Record<string, string> = {
		"1": "SYSTEM",
		"2": "APPROVED",
		"3": "JOB",
		"4": "PAYMENT",
		"5": "SUBSCRIPTION",
		"10": "JOB CREATED",
		"20": "CANDIDATE APPLIED",
		"30": "SUBSCRIPTION PURCHASED",
		"40": "PAYMENT SUCCESS",
		"50": "USER REGISTERED",
	};
	return typeNameMap[typeStr] || String(type).toUpperCase();
}

// Main Component
const NotificationTestPage: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [selectedNotification, setSelectedNotification] =
		useState<NotificationDetail | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [testUserId, setTestUserId] = useState<string>("1");
	const [testMessage, setTestMessage] = useState<string>("Test notification");
	const [testDetail, setTestDetail] = useState<string>(
		"This is a test notification via API"
	);
	const [testType, setTestType] = useState<string>("1"); // System = 1
	const [isSending, setIsSending] = useState(false);
	const connectionRef = useRef<signalR.HubConnection | null>(null);

	// Unread count
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	// SignalR Connection
	useEffect(() => {
		const token = getToken();
		if (!token) {
			setError("No token found in localStorage");
			return;
		}

		console.log(
			"🔵 Connecting to SignalR Hub:",
			`${API_BASE_URL.replace("/api", "")}/hubs/notification`
		);
		console.log("🔑 Using token:", token.substring(0, 20) + "...");

		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${API_BASE_URL.replace("/api", "")}/hubs/notification`, {
				accessTokenFactory: () => token,
			})
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build();

		connectionRef.current = connection;

		connection.on("ReceiveNotification", (notif: any) => {
			console.log("📨 SignalR: ReceiveNotification (raw)", notif);

			// Map backend data to frontend Notification type
			const mappedNotif: Notification = {
				id: String(notif.notifId || notif.id),
				message: notif.message,
				detail: notif.detail || "",
				type: getNotificationType(notif.type),
				isRead: notif.isRead || false,
				createdAt: notif.createdAt,
			};

			console.log("📨 SignalR: ReceiveNotification (mapped)", mappedNotif);

			setNotifications((prev) => [mappedNotif, ...prev]);
			setToasts((prev) => [
				...prev,
				{
					id: mappedNotif.id,
					message: mappedNotif.message,
					type: mappedNotif.type,
					onView: () => handleViewNotification(mappedNotif.id),
				},
			]);
		});

		connection.on("Connected", (message: string) => {
			console.log("✅ SignalR: Connected", message);
			setIsConnected(true);
		});

		connection.onclose((error) => {
			console.log("❌ SignalR: Disconnected", error);
			setIsConnected(false);
		});

		connection.onreconnecting((error) => {
			console.log("🔄 SignalR: Reconnecting...", error);
			setIsConnected(false);
		});

		connection.onreconnected((connectionId) => {
			console.log("✅ SignalR: Reconnected", connectionId);
			setIsConnected(true);
		});

		connection
			.start()
			.then(() => {
				console.log("✅ SignalR: Connection started successfully");
				setIsConnected(true);
			})
			.catch((err) => {
				console.error("❌ SignalR: Connection error", err);
				setIsConnected(false);
				setError(`SignalR connection failed: ${err.message}`);
			});

		return () => {
			console.log("🔴 SignalR: Disconnecting...");
			connection.stop();
		};
		// eslint-disable-next-line
	}, []);

	// Toast auto-remove
	useEffect(() => {
		if (toasts.length === 0) return;
		const timer = setTimeout(() => {
			setToasts((prev) => prev.slice(1));
		}, 5000);
		return () => clearTimeout(timer);
	}, [toasts]);

	// API: Load notifications
	const loadNotifications = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await notificationService.getMyNotifications();
			console.log("API: notifications", response);

			if (response.status === "Success" && response.data) {
				setNotifications(
					response.data.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					)
				);
			} else {
				throw new Error(response.message || "Failed to fetch notifications");
			}
		} catch (err: any) {
			setError(err.message || "Unknown error");
		}
		setIsLoading(false);
	};

	// API: Mark as read
	const markAsRead = async (notifId: string) => {
		try {
			const response = await notificationService.markAsRead(notifId);

			if (response.status === "Success") {
				setNotifications((prev) =>
					prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
				);
				showToast("Marked as read", "success");
			} else {
				throw new Error(response.message || "Failed to mark as read");
			}
		} catch (err: any) {
			showToast(err.message || "Failed to mark as read", "error");
		}
	};

	// API: Get notification detail
	const fetchNotificationDetail = async (notifId: string) => {
		try {
			const response = await notificationService.getDetail(notifId);
			console.log("API: notification detail", response);

			if (response.status === "Success" && response.data) {
				setSelectedNotification(response.data);
				setIsModalOpen(true);
				// Auto mark as read if unread
				if (!response.data.isRead) {
					await markAsRead(notifId);
				}
			} else {
				throw new Error(response.message || "Failed to fetch detail");
			}
		} catch (err: any) {
			showToast(err.message || "Failed to fetch detail", "error");
		}
	};

	// View notification (from toast or list)
	const handleViewNotification = (notifId: string) => {
		fetchNotificationDetail(notifId);
	};

	// Toast helper
	const showToast = (message: string, type: NotificationType = "info") => {
		setToasts((prev) => [
			...prev,
			{ id: Math.random().toString(), message, type },
		]);
	};

	// Test SignalR connection
	const handleTestConnection = () => {
		const connected = connectionRef.current?.state === "Connected";
		showToast(
			connected ? "SignalR Connected" : "SignalR Disconnected",
			connected ? "success" : "error"
		);
	};

	// Clear all notifications
	const handleClearAll = () => {
		setNotifications([]);
	};

	// Refresh notifications
	const handleRefresh = () => {
		loadNotifications();
	};

	// Modal close
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedNotification(null);
	};

	// Send test notification
	const handleSendTestNotification = async () => {
		if (!testUserId || !testMessage) {
			showToast("Please fill userId and message", "error");
			return;
		}

		setIsSending(true);
		try {
			const request: TestNotificationRequest = {
				userId: parseInt(testUserId),
				type: parseInt(testType),
				message: testMessage,
				detail: testDetail || undefined,
			};

			const response = await notificationService.sendTestNotification(request);

			if (response.status === "Success") {
				showToast("Test notification sent successfully!", "success");
				// Reload notifications to see the new one
				await loadNotifications();
			} else {
				throw new Error(response.message || "Failed to send test notification");
			}
		} catch (err: any) {
			showToast(err.message || "Failed to send test notification", "error");
		}
		setIsSending(false);
	};

	// Initial load
	useEffect(() => {
		loadNotifications();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-2">
			{/* Header */}
			<div className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
				<div className="flex items-center gap-3">
					<h1 className="text-2xl font-bold">Notification Test Page</h1>
					<span
						className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
							isConnected
								? "bg-blue-100 text-blue-600"
								: "bg-red-100 text-red-600"
						}`}
					>
						{isConnected ? "Connected" : "Disconnected"}
					</span>
					<span className="ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-bold">
						{unreadCount}
					</span>
				</div>
				<div className="flex gap-2 mt-2 sm:mt-0">
					<button
						className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
						onClick={handleRefresh}
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
						) : (
							"Refresh"
						)}
					</button>
					<button
						className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
						onClick={loadNotifications}
						disabled={isLoading}
					>
						Load Notifications
					</button>
					<button
						className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition"
						onClick={handleClearAll}
					>
						Clear All
					</button>
					<button
						className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
						onClick={handleTestConnection}
					>
						Test Connection
					</button>
				</div>
			</div>

			{/* Error */}
			{error && (
				<div className="w-full max-w-3xl mb-4">
					<div className="bg-red-100 text-red-700 px-4 py-2 rounded">
						{error}
					</div>
				</div>
			)}

			{/* Test Notification Section */}
			<div className="w-full max-w-3xl mb-6">
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-lg font-bold mb-3 flex items-center gap-2">
						🧪 Send Test Notification
						<span className="text-xs font-normal text-gray-500">
							(System_Admin/System_Manager only)
						</span>
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-semibold mb-1">
								User ID
							</label>
							<input
								type="number"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={testUserId}
								onChange={(e) => setTestUserId(e.target.value)}
								placeholder="1"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold mb-1">Type</label>
							<select
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={testType}
								onChange={(e) => setTestType(e.target.value)}
							>
								<option value="1">System (1)</option>
								<option value="2">CompanyApproved (2)</option>
								<option value="3">Job (3)</option>
								<option value="4">Payment (4)</option>
								<option value="5">Subscription (5)</option>
								<option value="10">JobCreated (10)</option>
								<option value="20">CandidateApplied (20)</option>
								<option value="30">CompanySubscriptionPurchased (30)</option>
								<option value="40">PaymentSuccess (40)</option>
								<option value="50">UserRegistered (50)</option>
							</select>
						</div>
						<div className="sm:col-span-2">
							<label className="block text-sm font-semibold mb-1">
								Message
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={testMessage}
								onChange={(e) => setTestMessage(e.target.value)}
								placeholder="Test notification message"
							/>
						</div>
						<div className="sm:col-span-2">
							<label className="block text-sm font-semibold mb-1">
								Detail (Optional)
							</label>
							<textarea
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows={2}
								value={testDetail}
								onChange={(e) => setTestDetail(e.target.value)}
								placeholder="Test notification detail"
							/>
						</div>
						<div className="sm:col-span-2">
							<button
								className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition font-semibold disabled:opacity-50"
								onClick={handleSendTestNotification}
								disabled={isSending}
							>
								{isSending ? "Sending..." : "🚀 Send Test Notification"}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Notification List */}
			<div className="w-full max-w-3xl">
				{isLoading ? (
					<div className="flex justify-center py-10">
						<span className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
					</div>
				) : notifications.length === 0 ? (
					<div className="text-center text-gray-400 py-10">
						No notifications found.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{notifications.map((notif) => (
							<div
								key={notif.id}
								className={`relative cursor-pointer rounded-lg shadow transition border ${
									notif.isRead
										? "bg-white border-gray-200"
										: "bg-red-50 border-red-200"
								} hover:shadow-lg`}
								onClick={() => handleViewNotification(notif.id)}
							>
								<div className="flex items-center justify-between px-4 pt-3">
									<span
										className={`font-bold text-base ${
											!notif.isRead ? "text-red-600" : "text-gray-800"
										}`}
									>
										{notif.message}
									</span>
									<span
										className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
											notif.isRead
												? "bg-gray-200 text-gray-600"
												: "bg-red-500 text-white"
										}`}
									>
										{formatNotificationType(notif.type)}
									</span>
								</div>
								<div className="px-4 pb-3 pt-1">
									<div className="text-sm text-gray-600 line-clamp-2">
										{notif.detail}
									</div>
									<div className="flex items-center justify-between mt-2">
										<span className="text-xs text-gray-400">
											{formatDate(notif.createdAt)}
										</span>
										{!notif.isRead && (
											<span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500"></span>
										)}
									</div>
								</div>
								{/* Mark as read button */}
								{!notif.isRead && (
									<button
										className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5 rounded shadow transition z-10"
										onClick={(e) => {
											e.stopPropagation();
											markAsRead(notif.id);
										}}
									>
										Mark as Read
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Detail Modal */}
			{isModalOpen && selectedNotification && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
						<h2 className="text-xl font-bold mb-2">Notification Detail</h2>
						<div className="mb-2">
							<span className="font-semibold">ID:</span>{" "}
							{selectedNotification.id}
						</div>
						<div className="mb-2">
							<span className="font-semibold">Message:</span>{" "}
							{selectedNotification.message}
						</div>
						<div className="mb-2">
							<span className="font-semibold">Detail:</span>{" "}
							{selectedNotification.detail}
						</div>
						<div className="mb-2">
							<span className="font-semibold">Type:</span>{" "}
							<span
								className={`px-2 py-0.5 rounded text-xs font-semibold ${
									selectedNotification.isRead
										? "bg-gray-200 text-gray-600"
										: "bg-red-500 text-white"
								}`}
							>
								{formatNotificationType(selectedNotification.type)}
							</span>
						</div>
						<div className="mb-2">
							<span className="font-semibold">Is Read:</span>{" "}
							{selectedNotification.isRead ? (
								<span className="text-green-600 font-bold">Yes</span>
							) : (
								<span className="text-red-600 font-bold">No</span>
							)}
						</div>
						<div className="mb-4">
							<span className="font-semibold">Created At:</span>{" "}
							{formatDate(selectedNotification.createdAt)}
						</div>
						<button
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
							onClick={handleCloseModal}
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Toast Container */}
			<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
				{toasts.map((toast, idx) => (
					<div
						key={toast.id}
						className={`min-w-[220px] px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-slide-in-right
							${
								toast.type === "success"
									? "bg-green-100 border-l-4 border-green-500 text-green-800"
									: toast.type === "error"
									? "bg-red-100 border-l-4 border-red-500 text-red-800"
									: toast.type === "warning"
									? "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800"
									: "bg-blue-100 border-l-4 border-blue-500 text-blue-800"
							}
						`}
						style={{
							animationDelay: `${idx * 0.1}s`,
						}}
					>
						<div className="flex-1">
							<div className="font-semibold">{toast.message}</div>
							{toast.type && (
								<div className="text-xs mt-1">{toast.type.toUpperCase()}</div>
							)}
						</div>
						{toast.onView && (
							<button
								className="ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5 rounded transition"
								onClick={() => {
									toast.onView?.();
									setToasts((prev) => prev.filter((t) => t.id !== toast.id));
								}}
							>
								View
							</button>
						)}
					</div>
				))}
			</div>

			{/* Animations */}
			<style>
				{`
				@keyframes slide-in-right {
					0% { transform: translateX(120%); opacity: 0; }
					100% { transform: translateX(0); opacity: 1; }
				}
				.animate-slide-in-right {
					animation: slide-in-right 0.4s cubic-bezier(0.4,0,0.2,1);
				}
				@keyframes fade-in {
					from { opacity: 0; transform: scale(0.95);}
					to { opacity: 1; transform: scale(1);}
				}
				.animate-fade-in {
					animation: fade-in 0.2s cubic-bezier(0.4,0,0.2,1);
				}
				`}
			</style>
		</div>
	);
};

export default NotificationTestPage;
