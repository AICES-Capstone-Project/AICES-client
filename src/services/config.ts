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
		GITHUB_LOGIN: "/auth/github",
		VERIFY_EMAIL: (token: string) => `/auth/verify-email?token=${token}`,
		ME: "/auth/me",
		REFRESH: "/auth/refresh",
		LOGOUT: "/auth/logout",
		REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
		RESET_PASSWORD: "/auth/reset-password",
	},

	// Admin endpoints
	ADMIN: {
		USERS: {
			LIST: "/admin/users",
			CREATE: "/admin/users",
			DETAIL: (id: number | string) => `/admin/users/${id}`,
			UPDATE: (id: number | string) => `/admin/users/${id}`,
			DELETE: (id: number | string) => `/admin/users/${id}`,
		},
	},
} as const;

// App Routes Configuration
export const APP_ROUTES = {
	// Public routes
	HOME: "/",
	TEST: "/test",

	// Auth routes
	
	PRICING: "/pricing",
	LOGIN: "/login",
	SIGN_UP: "/sign-up",
	VERIFY_EMAIL: "/verify-email",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	AUTH_CALLBACK: "/auth/callback",

	// Recruiter routes
	RECRUITER: "/recruiter",

	// Admin routes
	ADMIN: "/admin",
	ADMIN_DASHBOARD: "/admin/dashboard",
	ADMIN_USERS: "/admin/users",
	ADMIN_RECRUITMENT_APPROVAL: "/admin/recruitment-approval",
	ADMIN_JOBS: "/admin/jobs",
	ADMIN_ASSESSMENTS: "/admin/assessments",
	ADMIN_REPORTS: "/admin/reports",
	ADMIN_SETTINGS: "/admin/settings",
	ADMIN_NOTIFICATIONS: "/admin/notifications",
	ADMIN_LOGS: "/admin/logs",
} as const;

export default {
	API_CONFIG,
	STORAGE_KEYS,
	API_ENDPOINTS,
	APP_ROUTES,
};
