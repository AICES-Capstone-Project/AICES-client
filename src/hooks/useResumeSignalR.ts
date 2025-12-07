import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { API_CONFIG, STORAGE_KEYS } from "../services/config";

const API_BASE_URL = API_CONFIG.BASE_URL;
const getToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

interface ResumeUpdateData {
	eventType: string; // "uploaded", "status_changed", "deleted", "rescore_initiated"
	jobId: number;
	resumeId: number;
	status: string;
	fullName: string;
	totalResumeScore?: number | null;
	timestamp: string;
	data?: any;
}

interface ResumeListUpdateData {
	eventType: string; // "list_changed"
	jobId: number;
	timestamp: string;
}

type ResumeUpdateCallback = (data: ResumeUpdateData) => void;
type ResumeListUpdateCallback = (data: ResumeListUpdateData) => void;

interface UseResumeSignalROptions {
	onResumeUpdated?: ResumeUpdateCallback;
	onResumeListUpdated?: ResumeListUpdateCallback;
	enabled?: boolean;
	jobId?: number | null;
}

interface UseResumeSignalRReturn {
	isConnected: boolean;
	error: string | null;
	connectionRef: React.RefObject<signalR.HubConnection | null>;
	joinJobGroup: (jobId: number) => Promise<void>;
	leaveJobGroup: (jobId: number) => Promise<void>;
}

export const useResumeSignalR = (
	options: UseResumeSignalROptions = {}
): UseResumeSignalRReturn => {
	const {
		onResumeUpdated,
		onResumeListUpdated,
		enabled = true,
		jobId,
	} = options;
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const connectionRef = useRef<signalR.HubConnection | null>(null);
	const onResumeUpdatedRef = useRef(onResumeUpdated);
	const onResumeListUpdatedRef = useRef(onResumeListUpdated);
	const currentJobIdRef = useRef<number | null>(null);

	// Keep callback refs updated
	useEffect(() => {
		onResumeUpdatedRef.current = onResumeUpdated;
	}, [onResumeUpdated]);

	useEffect(() => {
		onResumeListUpdatedRef.current = onResumeListUpdated;
	}, [onResumeListUpdated]);

	// Join job group when jobId changes and connection is established
	useEffect(() => {
		if (!isConnected || !jobId || !connectionRef.current) {
			if (jobId && !isConnected) {
				console.log(
					`⏳ SignalR: Waiting for connection to join job group ${jobId}...`
				);
			}
			return;
		}

		const joinGroup = async () => {
			try {
				// Leave previous group if different
				if (
					currentJobIdRef.current &&
					currentJobIdRef.current !== jobId &&
					connectionRef.current
				) {
					try {
						await connectionRef.current.invoke(
							"LeaveJobGroup",
							currentJobIdRef.current
						);
						console.log(
							`✅ SignalR: Left previous job group ${currentJobIdRef.current}`
						);
					} catch (err) {
						console.warn(
							`⚠️ SignalR: Failed to leave previous job group:`,
							err
						);
					}
				}

				// Only join if we haven't joined this job yet
				if (currentJobIdRef.current !== jobId) {
					await connectionRef.current?.invoke("JoinJobGroup", jobId);
					currentJobIdRef.current = jobId;
					console.log(`✅ SignalR: Joined job group ${jobId}`);
				}
			} catch (err) {
				console.error(`❌ SignalR: Failed to join job group ${jobId}:`, err);
			}
		};

		joinGroup();
	}, [isConnected, jobId]);

	useEffect(() => {
		if (!enabled) return;

		const token = getToken();
		if (!token) {
			console.log("🔴 SignalR: No token found, skipping ResumeHub connection");
			return;
		}

		const hubUrl = `${API_BASE_URL.replace("/api", "")}/hubs/resume`;
		console.log("🔵 Connecting to ResumeHub SignalR:", hubUrl);

		const connection = new signalR.HubConnectionBuilder()
			.withUrl(hubUrl, {
				accessTokenFactory: () => token,
			})
			.withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals
			.configureLogging(signalR.LogLevel.Information)
			.build();

		connectionRef.current = connection;

		// Handle connected event from server
		connection.on("Connected", (message: string) => {
			console.log(
				"✅ SignalR ResumeHub: Server confirmed connection:",
				message
			);
		});

		// Handle resume updated event
		connection.on("ResumeUpdated", (data: ResumeUpdateData) => {
			console.log("📨 SignalR ResumeHub: ResumeUpdated", data);
			console.log("📨 SignalR ResumeHub: Event details:", {
				eventType: data.eventType,
				jobId: data.jobId,
				resumeId: data.resumeId,
				status: data.status,
				currentJobId: jobId,
				callbackExists: !!onResumeUpdatedRef.current,
			});
			if (onResumeUpdatedRef.current) {
				try {
					onResumeUpdatedRef.current(data);
					console.log("✅ SignalR ResumeHub: Handler called successfully");
				} catch (err) {
					console.error("❌ SignalR ResumeHub: Error in handler:", err);
				}
			} else {
				console.warn("⚠️ SignalR ResumeHub: Handler callback is null!");
			}
		});

		// Handle resume list updated event
		connection.on("ResumeListUpdated", (data: ResumeListUpdateData) => {
			console.log("📋 SignalR ResumeHub: ResumeListUpdated", data);
			onResumeListUpdatedRef.current?.(data);
		});

		// Handle joined job group confirmation
		connection.on("JoinedJobGroup", (message: string) => {
			console.log("✅ SignalR ResumeHub: JoinedJobGroup", message);
		});

		// Handle left job group confirmation
		connection.on("LeftJobGroup", (message: string) => {
			console.log("✅ SignalR ResumeHub: LeftJobGroup", message);
		});

		// Handle errors
		connection.on("Error", (message: string) => {
			console.error("❌ SignalR ResumeHub: Error", message);
		});

		// Connection state handlers
		connection.onclose((err) => {
			console.log("❌ SignalR ResumeHub: Disconnected", err);
			setIsConnected(false);
			currentJobIdRef.current = null;
		});

		connection.onreconnecting((err) => {
			console.log("🔄 SignalR ResumeHub: Reconnecting...", err);
			setIsConnected(false);
		});

		connection.onreconnected(async (connectionId) => {
			console.log("✅ SignalR ResumeHub: Reconnected", connectionId);
			setIsConnected(true);
			// Rejoin job group if we had one
			if (currentJobIdRef.current) {
				try {
					await connection.invoke("JoinJobGroup", currentJobIdRef.current);
					console.log(
						`✅ SignalR ResumeHub: Rejoined job group ${currentJobIdRef.current}`
					);
				} catch (err) {
					console.error(
						`❌ SignalR ResumeHub: Failed to rejoin job group:`,
						err
					);
				}
			}
		});

		// Start connection
		connection
			.start()
			.then(() => {
				console.log("✅ SignalR ResumeHub: Connection started successfully");
				setIsConnected(true);
				setError(null);
			})
			.catch((err) => {
				console.error("❌ SignalR ResumeHub: Connection error", err);
				setIsConnected(false);
				setError(`SignalR ResumeHub connection failed: ${err.message}`);
			});

		// Cleanup
		return () => {
			console.log("🔴 SignalR ResumeHub: Stopping connection...");
			connection.stop();
			currentJobIdRef.current = null;
		};
	}, [enabled]);

	// Manual join/leave functions
	const joinJobGroup = useCallback(
		async (jobId: number) => {
			if (!connectionRef.current || !isConnected) {
				console.warn("⚠️ SignalR ResumeHub: Cannot join group, not connected");
				return;
			}
			try {
				await connectionRef.current.invoke("JoinJobGroup", jobId);
				currentJobIdRef.current = jobId;
				console.log(`✅ SignalR ResumeHub: Joined job group ${jobId}`);
			} catch (err) {
				console.error(
					`❌ SignalR ResumeHub: Failed to join job group ${jobId}:`,
					err
				);
				throw err;
			}
		},
		[isConnected]
	);

	const leaveJobGroup = useCallback(
		async (jobId: number) => {
			if (!connectionRef.current || !isConnected) {
				console.warn("⚠️ SignalR ResumeHub: Cannot leave group, not connected");
				return;
			}
			try {
				await connectionRef.current.invoke("LeaveJobGroup", jobId);
				if (currentJobIdRef.current === jobId) {
					currentJobIdRef.current = null;
				}
				console.log(`✅ SignalR ResumeHub: Left job group ${jobId}`);
			} catch (err) {
				console.error(
					`❌ SignalR ResumeHub: Failed to leave job group ${jobId}:`,
					err
				);
				throw err;
			}
		},
		[isConnected]
	);

	return {
		isConnected,
		error,
		connectionRef,
		joinJobGroup,
		leaveJobGroup,
	};
};

export default useResumeSignalR;
