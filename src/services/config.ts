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
	},
} as const;

// App Routes Configuration
export const APP_ROUTES = {
	// Public routes
	HOME: "/",

	// Auth routes
	LOGIN: "/login",
	SIGN_UP: "/sign-up",

	// Role-based routes
	ADMIN_DASHBOARD: "/admin",
} as const;

export default {
	API_CONFIG,
	STORAGE_KEYS,
	API_ENDPOINTS,
	APP_ROUTES,
};
