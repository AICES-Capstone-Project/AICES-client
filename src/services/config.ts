// API Configuration
export const API_CONFIG = {
	BASE_URL: import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:7220/api",
} as const;

// Storage Keys
export const STORAGE_KEYS = {
	ACCESS_TOKEN: "access_token",
	REFRESH_TOKEN: "refresh_token",
	USER_DATA: "user_data",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
	// Auth endpoints
	AUTH: {
		REGISTER: "/auth/register",
		LOGIN: "/auth/login",
	},
} as const;

// App Routes Configuration
export const APP_ROUTES = {
	// Public routes
	// HOME: "/",
	// EVENTS: "/events",
	// EVENT_DETAIL: (id: number) => `/events/${id}`,
	// EVENT_BOOKING: (eventId: number, showtimeId: number) =>
	// 	`/events/${eventId}/booking/${showtimeId}`,
	// Auth routes
	// SIGN_IN: "/sign-in",
	// SIGN_UP: "/sign-up",
	// Role-based routes
	// ADMIN_DASHBOARD: "/admin",
	// ADMIN_USERS: "/admin/users",
	// ADMIN_EVENTS: "/admin/events",
	// STAFF_DASHBOARD: "/staff",
	// STAFF_EVENTS: "/staff/events",
} as const;

export default {
	API_CONFIG,
	STORAGE_KEYS,
	API_ENDPOINTS,
	APP_ROUTES,
};
