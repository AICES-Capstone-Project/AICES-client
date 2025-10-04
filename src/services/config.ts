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
		SIGN_UP: "/auth/register",
		LOGIN: "/auth/login",
		GOOGLE_LOGIN: "/auth/google",
		VERIFY_EMAIL: (token: string) => `/auth/verify-email?token=${token}`,
		ME: "/auth/me",
		REFRESH: "/auth/refresh",
		LOGOUT: "/auth/logout",
		REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
		RESET_PASSWORD: "/auth/reset-password",
	},
} as const;

// App Routes Configuration
export const APP_ROUTES = {
	// Public routes
	HOME: "/",
	TEST: "/test",

	// Auth routes
	LOGIN: "/login",
	SIGN_UP: "/sign-up",
	VERIFY_EMAIL: "/verify-email",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",

	// Role-based routes
	ADMIN: "/admin",
	ADMIN_DASHBOARD: "/admin/dashboard",
	ADMIN_USERS: "/admin/users",
} as const;

export default {
	API_CONFIG,
	STORAGE_KEYS,
	API_ENDPOINTS,
	APP_ROUTES,
};
