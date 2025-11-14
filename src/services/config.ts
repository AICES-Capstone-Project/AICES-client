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

  // 💛 Subscription endpoints (Plans)
  SUBSCRIPTION: {
    PUBLIC_LIST: "/subscriptions/public",
    PUBLIC_DETAIL: (id: number) => `/subscriptions/public/${id}`,

    LIST: "/subscriptions", // GET all (kể cả inactive)
    CREATE: "/subscriptions", // POST
    GET_BY_ID: (id: number) => `/subscriptions/${id}`,
    UPDATE: (id: number) => `/subscriptions/${id}`, // PATCH
    DELETE: (id: number) => `/subscriptions/${id}`, // DELETE
  },
  // Company subscriptions (Subscribed Companies)
  COMPANY_SUBSCRIPTION: {
    LIST: "/company-subscriptions",
    GET_BY_ID: (id: number) => `/company-subscriptions/${id}`,
    CREATE: "/company-subscriptions",
    DELETE: (id: number) => `/company-subscriptions/${id}`,
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

  // Reports
  SYSTEM_REPORTS: "/system/reports",

  // Notifications
  SYSTEM_NOTIFICATION_TEMPLATES: "/system/notifications/templates",
  SYSTEM_EMAIL_TEMPLATES: "/system/notifications/email",

  // Settings
  SYSTEM_ROLES: "/system/settings/roles",
  SYSTEM_AI_ENDPOINTS: "/system/settings/ai-endpoints",
  SYSTEM_FEATURE_FLAGS: "/system/settings/feature-flags",
  SYSTEM_EMAIL_CONFIG: "/system/settings/email",
  SYSTEM_API_KEYS: "/system/settings/api-keys",

  // Subscriptions
  SYSTEM_SUBSCRIPTIONS: "/system/subscriptions",
  SYSTEM_SUBSCRIPTIONS_COMPANIES: "/system/subscriptions/companies",
  SYSTEM_SUBSCRIPTION_DETAIL: "/system/subscriptions/:id",

  // Payments
  SYSTEM_PAYMENTS: "/system/payments",
  SYSTEM_PAYMENT_DETAIL: "/system/payments/:paymentId",

  // Taxonomy
  SYSTEM_CATEGORY: "/system/category",
  SYSTEM_SKILL: "/system/skill",
  SYSTEM_SPECIALIZATION: "/system/specialization",
  SYSTEM_RECRUITMENT_TYPE: "/system/recruitment-type",
  // Content
  SYSTEM_BANNERS: "/system/banners",
  SYSTEM_BANNER_DETAIL: "/system/banners/:bannerId",
  SYSTEM_BLOGS: "/system/blogs",
  SYSTEM_BLOG_DETAIL: "/system/blogs/:blogId",
  SYSTEM_TAGS: "/system/tags",

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
