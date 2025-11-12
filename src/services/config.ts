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

	// Profile endpoints
	PROFILE: {
		UPDATE: "/profile/update",
	},

	// User endpoints
	USER: {
		GET_ALL: "/user",
		GET_BY_ID: (id: number) => `/user/${id}`,
		CREATE: "/user",
		UPDATE: (id: number) => `/user/${id}`,
		DELETE: (id: number) => `/user/${id}`,
		RESTORE: (id: number) => `/user/${id}/restore`,
	},

	// Company endpoints
	COMPANY: {
		CREATE: "/companies/self",
		GET: "/companies/self",
		GET_BY_ID: (id: number) => `/companies/${id}`,
		GET_MEMBERS: (id: number) => `/companies/${id}/members`,
		// Public company list and join
		LIST: "/companies",
		JOIN: (id: number) => `/companies/${id}/join`,
		GET_JOBS: (id: number) => `/companies/${id}/jobs`,
		GET_JOBS_PUBLIC: "/company/self/jobs/published",
		GET_JOBS_PENDING: "/company/self/jobs/pending",
		GET_JOBS_ME: "/company/self/jobs/me",
		JOB: "/company/self/jobs",
		// Public companies list for join modal
		PUBLIC: "/companies/public",
	},

	// System endpoints (categories, skills, specializations)
	SYSTEM: {
		CATEGORIES: "/categories",
		SKILLS: "/skills",
		EMPLOYMENT_TYPES: "/employment-types",
		// specializations endpoint will be used as /system/category/{id}/specializations
	},
} as const;

// App Routes Configuration
export const APP_ROUTES = {
	// Public routes
	HOME: "/",
	TEST: "/test",
	NOTFOUND: "*",

	// Auth routes
	LOGIN: "/login",
	SIGN_UP: "/sign-up",
	VERIFY_EMAIL: "/verify-email",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	AUTH_CALLBACK: "/auth/callback",

	// General routes
	PRICING: "/pricing",

	// Profile routes
	PROFILE: "/profile",
	PROFILE_ACCOUNT_DETAIL: "/profile/account-detail",
	PROFILE_NOTIFICATION: "/profile/notification",
	PROFILE_SECURITY: "/profile/security",

	// System routes
	SYSTEM: "/system",
	SYSTEM_DASHBOARD: "/system/dashboard",
	SYSTEM_USERS: "/system/users",
	SYSTEM_RECRUITMENT_APPROVAL: "/system/recruitment-approval",
	SYSTEM_JOBS: "/system/jobs",
	
	// === Newly added System routes ===
	SYSTEM_COMPANY: "/system/company",
	SYSTEM_REPORTS: "/system/reports",
	SYSTEM_EMPLOYMENT_TYPE: "/system/employment-type",
	SYSTEM_CATEGORY: "/system/category",
	SYSTEM_NOTIFICATIONS: "/system/notifications",
	SYSTEM_SETTINGS: "/system/settings",

	// Optional detail routes (for future expansion)
	SYSTEM_COMPANY_DETAIL: "/system/company/:companyId",
	SYSTEM_COMPANY_JOB_DETAIL: "/system/company/:companyId/jobs/:jobId",
	SYSTEM_COMPANY_RESUME_DETAIL:
		"/system/company/:companyId/jobs/:jobId/resumes/:resumeId",

	// Company routes
	COMPANY: "/company",
	COMPANY_DASHBOARD: "/company/dashboard",
	COMPANY_STAFFS: "/company/staffs",
	COMPANY_JOBS: "/company/jobs",
	COMPANY_SETTINGS: "/company/settings",
	COMPANY_MY_APARTMENTS: "/company/my-apartments",
	COMPANY_PENDING_APPROVAL: "/company/pending-approval",
	COMPANY_AI_SCREENING: "/company/ai-screening",
	COMPANY_CLIENTS: "/company/clients",
} as const;

export const ROLES = {
	System_Admin: "system_admin",
	System_Manager: "system_manager",
	System_Staff: "system_staff",
	Hr_Manager: "hr_manager",
	Hr_Recruiter: "hr_recruiter",
} as const;

export default {
	API_CONFIG,
	STORAGE_KEYS,
	API_ENDPOINTS,
	APP_ROUTES,
};

