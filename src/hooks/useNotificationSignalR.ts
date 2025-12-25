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
	connectionRef: React.RefObject<signalR.HubConnection | null>;
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
			console.debug("SignalR: No token found, skipping connection");
			return;
		}

		const hubUrl = `${API_BASE_URL.replace("/api", "")}/hubs/notification`;
		console.debug("SignalR: Connecting to hub", hubUrl);

		const connection = new signalR.HubConnectionBuilder()
			.withUrl(hubUrl, {
				accessTokenFactory: () => token,
			})
			.withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals
			.configureLogging(signalR.LogLevel.Information)
			.build();

		connectionRef.current = connection;

		// Handle receiving new notification
		connection.on("ReceiveNotification", (notif: Notification) => {
			console.debug("SignalR: ReceiveNotification", notif);

			// Map backend data to frontend Notification type
			const mappedNotif: Notification = {
				notifId: notif.notifId,
				message: notif.message,
				detail: notif.detail,
				type: notif.type,
				isRead: notif.isRead,
				invitation: notif.invitation || null,
				createdAt: notif.createdAt,
			};

			onNewNotificationRef.current?.(mappedNotif);
		});

		// Handle connected event from server
		connection.on("Connected", (message: string) => {
			console.debug("SignalR: Server confirmed connection", message);
		});

		// Connection state handlers
		connection.onclose((err) => {
			console.error("SignalR: Disconnected", err);
			setIsConnected(false);
		});

		connection.onreconnecting((err) => {
			console.warn("SignalR: Reconnecting...", err);
			setIsConnected(false);
		});

		connection.onreconnected((connectionId) => {
			console.debug("SignalR: Reconnected", connectionId);
			setIsConnected(true);
		});

		// Start connection with a fallback: if negotiation fails, try direct WebSocket (skip negotiation)
		let attemptedFallback = false;
		const startConnection = async () => {
			try {
				await connection.start();
				console.debug("SignalR: Connection started successfully");
				setIsConnected(true);
				setError(null);
			} catch (err: any) {
				// If negotiation was stopped, attempt a WebSocket-only connection once
				const isNegotiationError = /negotiation|negotiat/i.test(String(err?.message || '')) || err?.name === 'AbortError';
				if (isNegotiationError && !attemptedFallback) {
					attemptedFallback = true;
					console.warn('SignalR: Negotiation failed, attempting WebSocket fallback (skip negotiation)');
					try {
						const wsConnection = new signalR.HubConnectionBuilder()
							.withUrl(hubUrl, {
								accessTokenFactory: () => token,
								skipNegotiation: true,
								transport: signalR.HttpTransportType.WebSockets,
							})
							.withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
							.configureLogging(signalR.LogLevel.Information)
							.build();

						// copy handlers from previous connection
						wsConnection.on("ReceiveNotification", (notif: Notification) => {
							console.debug("SignalR: ReceiveNotification", notif);
							const mappedNotif: Notification = {
								notifId: notif.notifId,
								message: notif.message,
								detail: notif.detail,
								type: notif.type,
								isRead: notif.isRead,
								invitation: notif.invitation || null,
								createdAt: notif.createdAt,
							};
							onNewNotificationRef.current?.(mappedNotif);
						});
						wsConnection.on("Connected", (message: string) => {
							console.debug("SignalR: Server confirmed connection", message);
						});
						wsConnection.onclose((err) => {
							console.error("SignalR: Disconnected", err);
							setIsConnected(false);
						});
						wsConnection.onreconnecting((err) => {
							console.warn("SignalR: Reconnecting...", err);
							setIsConnected(false);
						});
						wsConnection.onreconnected((connectionId) => {
							console.debug("SignalR: Reconnected", connectionId);
							setIsConnected(true);
						});

						connectionRef.current = wsConnection;
						await wsConnection.start();
						console.debug('SignalR: WebSocket fallback connection started');
						setIsConnected(true);
						setError(null);
						return;
					} catch (wsErr: any) {
						console.error('SignalR: WebSocket fallback failed', wsErr);
						setIsConnected(false);
						setError(`SignalR connection failed: ${wsErr?.message || wsErr}`);
						return;
					}
				}

				console.error("SignalR: Connection error", err);
				setIsConnected(false);
				setError(`SignalR connection failed: ${err?.message || err}`);
			}
		};

		startConnection();

		// Cleanup
		return () => {
			console.debug("SignalR: Stopping connection");
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
