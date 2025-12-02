import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_CONFIG, STORAGE_KEYS } from "../services/config";
import type { Notification } from "../types/notification.types";

const API_BASE_URL = API_CONFIG.BASE_URL;
const getToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

interface UseNotificationSignalROptions {
	onNewNotification?: (notification: Notification) => void;
	enabled?: boolean;
}

interface UseNotificationSignalRReturn {
	isConnected: boolean;
	error: string | null;
	connectionRef: React.MutableRefObject<signalR.HubConnection | null>;
}

export const useNotificationSignalR = (
	options: UseNotificationSignalROptions = {}
): UseNotificationSignalRReturn => {
	const { onNewNotification, enabled = true } = options;
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const connectionRef = useRef<signalR.HubConnection | null>(null);
	const onNewNotificationRef = useRef(onNewNotification);

	// Keep callback ref updated
	useEffect(() => {
		onNewNotificationRef.current = onNewNotification;
	}, [onNewNotification]);

	useEffect(() => {
		if (!enabled) return;

		const token = getToken();
		if (!token) {
			console.log("🔴 SignalR: No token found, skipping connection");
			return;
		}

		const hubUrl = `${API_BASE_URL.replace("/api", "")}/hubs/notification`;
		console.log("🔵 Connecting to SignalR Hub:", hubUrl);

		const connection = new signalR.HubConnectionBuilder()
			.withUrl(hubUrl, {
				accessTokenFactory: () => token,
			})
			.withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals
			.configureLogging(signalR.LogLevel.Information)
			.build();

		connectionRef.current = connection;

		// Handle receiving new notification
		connection.on("ReceiveNotification", (notif: any) => {
			console.log("📨 SignalR: ReceiveNotification", notif);

			// Map backend data to frontend Notification type
			const mappedNotif: Notification = {
				notifId: notif.notifId || notif.id,
				message: notif.message,
				detail: notif.detail || "",
				type: notif.type,
				isRead: notif.isRead || false,
				invitation: notif.invitation || null,
				createdAt: notif.createdAt,
			};

			onNewNotificationRef.current?.(mappedNotif);
		});

		// Handle connected event from server
		connection.on("Connected", (message: string) => {
			console.log("✅ SignalR: Server confirmed connection:", message);
		});

		// Connection state handlers
		connection.onclose((err) => {
			console.log("❌ SignalR: Disconnected", err);
			setIsConnected(false);
		});

		connection.onreconnecting((err) => {
			console.log("🔄 SignalR: Reconnecting...", err);
			setIsConnected(false);
		});

		connection.onreconnected((connectionId) => {
			console.log("✅ SignalR: Reconnected", connectionId);
			setIsConnected(true);
		});

		// Start connection
		connection
			.start()
			.then(() => {
				console.log("✅ SignalR: Connection started successfully");
				setIsConnected(true);
				setError(null);
			})
			.catch((err) => {
				console.error("❌ SignalR: Connection error", err);
				setIsConnected(false);
				setError(`SignalR connection failed: ${err.message}`);
			});

		// Cleanup
		return () => {
			console.log("🔴 SignalR: Stopping connection...");
			connection.stop();
		};
	}, [enabled]);

	return {
		isConnected,
		error,
		connectionRef,
	};
};

export default useNotificationSignalR;
