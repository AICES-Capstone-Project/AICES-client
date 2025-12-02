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
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // Profile endpoints
  PROFILE: {
    UPDATE: "/auth/profile",
  },

  // User endpoints
  USER: {
    //------------------------------- SYSTEM -----------------------------------------
    GET_ALL: "/system/users",
    GET_BY_ID: (userId: number) => `/system/users/${userId}`,
    CREATE: "/system/users",
    UPDATE: (userId: number) => `/system/users/${userId}`,
    DELETE: (userId: number) => `/system/users/${userId}`,
    UPDATE_STATUS: (userId: number) => `/system/users/${userId}/status`,
  },

  // Company endpoints
  COMPANY: {
    //------------------------------- PUBLIC -----------------------------------------
    // role nào cũng xem dược
    PUBLIC_GET: "/public/companies",
    PUBLIC_GET_BY_ID: (companyId: number) => `/public/companies/${companyId}`,

    //------------------------------- COMPANY -----------------------------------------
    // HR xem company profile
    COMPANY_GET_PROFILE: "/companies/profile",

    // HR cập nhật company profile
    COMPANY_UPDATE_PROFILE: "/companies/profile",

    // HR_Recruiter tạo company
    COMPANY_CREATE: "/companies",

    // HR_Recruiter cập nhật lại company sau khi bị từ chối
    COMPANY_UPDATE: "/companies",

    // HR_Recruiter hủy company sau khi tạo
    COMPANY_CANCEL: "/companies/cancel",

    //------------------------------- SYSTEM -----------------------------------------
    // System xem company list và detail
    SYSTEM_GET: "/system/companies",
    SYSTEM_GET_BY_ID: (id: number) => `/system/companies/${id}`,

    // System tạo, cập nhật, xóa
    SYSTEM_CREATE: "/system/companies",
    SYSTEM_UPDATE: (companyId: number) => `/system/companies/${companyId}`,
    SYSTEM_DELETE: (companyId: number) => `/system/companies/${companyId}`,

    // System duyệt hoặc từ chối company
    SYSTEM_STATUS: (companyId: number) =>
      `/system/companies/${companyId}/status`,
  },

  // Employment Type endpoints
  EMPLOYMENT_TYPE: {
    //------------------------------- PUBLIC -----------------------------------------
    PUBLIC_GET: "/public/employment-types",
    PUBLIC_GET_BY_ID: (employmentTypeId: number) =>
      `/public/employment-types/${employmentTypeId}`,

    //------------------------------- SYSTEM -----------------------------------------

    SYSTEM_GET: "/public/employment-types",
    SYSTEM_GET_BY_ID: (employmentTypeId: number) =>
      `/public/employment-types/${employmentTypeId}`,
    SYSTEM_CREATE: "/system/employment-types",
    SYSTEM_UPDATE: (employmentTypeId: number) =>
      `/system/employment-types/${employmentTypeId}`,
    SYSTEM_DELETE: (employmentTypeId: number) =>
      `/system/employment-types/${employmentTypeId}`,
  },

  // Category endpoints
  CATEGORY: {
    //------------------------------- PUBLIC -----------------------------------------
    PUBLIC_GET: "/public/categories",
    PUBLIC_GET_BY_ID: (categoryId: number) =>
      `/public/categories/${categoryId}`,
    PUBLIC_GET_SPECIALIZATIONS: (categoryId: number) =>
      `/public/categories/${categoryId}/specializations`,
    //------------------------------- SYSTEM -----------------------------------------
    SYSTEM_GET: "/public/categories",
    SYSTEM_GET_BY_ID: (id: number) => `/public/categories/${id}`,
    SYSTEM_CREATE: "/system/categories",
    SYSTEM_UPDATE: (categoryId: number) => `/system/categories/${categoryId}`,
    SYSTEM_DELETE: (categoryId: number) => `/system/categories/${categoryId}`,
  },

  // Specialization endpoints
  SPECIALIZATION: {
    //------------------------------- PUBLIC -----------------------------------------
    PUBLIC_GET: "/public/specializations",
    PUBLIC_GET_BY_ID: (specializationId: number) =>
      `/public/specializations/${specializationId}`,

    //------------------------------- SYSTEM -----------------------------------------
    SYSTEM_GET: "/public/specializations",
    SYSTEM_GET_BY_ID: (specializationId: number) =>
      `/public/specializations/${specializationId}`,
    SYSTEM_CREATE: "/system/specializations",
    SYSTEM_UPDATE: (specializationId: number) =>
      `/system/specializations/${specializationId}`,
    SYSTEM_DELETE: (specializationId: number) =>
      `/system/specializations/${specializationId}`,
  },

  // Skill endpoints
  SKILL: {
    //------------------------------- PUBLIC -----------------------------------------
    PUBLIC_GET: "/public/skills",
    PUBLIC_GET_BY_ID: (skillId: number) => `/public/skills/${skillId}`,

    //------------------------------- SYSTEM -----------------------------------------
    SYSTEM_GET: "/public/skills",
    SYSTEM_GET_BY_ID: (skillId: number) => `/public/skills/${skillId}`,
    SYSTEM_CREATE: "/system/skills",
    SYSTEM_UPDATE: (skillId: number) => `/system/skills/${skillId}`,
    SYSTEM_DELETE: (skillId: number) => `/system/skills/${skillId}`,
  },

  // Banner Config endpoints
  BANNER_CONFIG: {
    //------------------------------- PUBLIC -----------------------------------------
    PUBLIC_GET: "/public/banner-configs",
    PUBLIC_GET_BY_ID: (bannerConfigId: number) =>
      `/public/banner-configs/${bannerConfigId}`,

    //------------------------------- SYSTEM -----------------------------------------
    SYSTEM_GET: "/system/banner-configs",
    SYSTEM_GET_BY_ID: (bannerConfigId: number) =>
      `/system/banner-configs/${bannerConfigId}`,
    SYSTEM_CREATE: "/system/banner-configs",
    SYSTEM_UPDATE: (bannerConfigId: number) =>
      `/system/banner-configs/${bannerConfigId}`,
    SYSTEM_DELETE: (bannerConfigId: number) =>
      `/system/banner-configs/${bannerConfigId}`,
  },

  // Job endpoints
  JOB: {
    //------------------------------- SYSTEM -----------------------------------------
    // System xem job trong 1 công ty
    SYSTEM_GET: (companyId: number) => `/system/company/${companyId}/jobs`,
    SYSTEM_GET_BY_ID: (companyId: number, jobId: number) =>
      `/system/company/${companyId}/jobs/${jobId}`,

    //------------------------------- COMPANY -----------------------------------------
    // Company xem các job đã đăng trong company
    COMPANY_PUBLISHED: "/jobs/published",
    COMPANY_PUBLISHED_BY_ID: (jobId: number) => `/jobs/published/${jobId}`,

    // HR_Manager xem các job đang chờ duyệt trong company
    COMPANY_PENDING: "/jobs/pending",
    COMPANY_PENDING_BY_ID: (jobId: number) => `/jobs/pending/${jobId}`,

    // Company xem các job của mình đã đăng
    COMPANY_ME: "/jobs/me",

    // Company tạo, cập nhật, xóa job
    COMPANY_CREATE: "/jobs",
    COMPANY_UPDATE: (jobId: number) => `/jobs/${jobId}`,
    COMPANY_DELETE: (jobId: number) => `/jobs/${jobId}`,

    // HR_Manager cập nhật trạng thái job (duyệt / từ chối)
    COMPANY_UPDATE_STATUS: (jobId: number) => `/jobs/${jobId}/status`,
  },

  // Subscription endpoints
  SUBSCRIPTION: {
    //------------------------------- PUBLIC -----------------------------------------
    PUBLIC_GET: "/public/subscriptions",
    PUBLIC_GET_BY_ID: (subscriptionId: number) =>
      `/public/subscriptions/${subscriptionId}`,

    //------------------------------- SYSTEM -----------------------------------------
    SYSTEM_GET: "/system/subscriptions",
    SYSTEM_GET_BY_ID: (subscriptionId: number) =>
      `/system/subscriptions/${subscriptionId}`,
    SYSTEM_CREATE: "/system/subscriptions",
    SYSTEM_UPDATE: (subscriptionId: number) =>
      `/system/subscriptions/${subscriptionId}`,
    SYSTEM_DELETE: (subscriptionId: number) =>
      `/system/subscriptions/${subscriptionId}`,

    //------------------------------- COMPANY -----------------------------------------
    COMPANY_CURRENT: "/subscriptions/current-subscription",
    COMPANY_CANCEL: "/subscriptions/subscription/cancel",
  },

  // Company User endpoints
  COMPANY_USER: {
    //------------------------------- SYSTEM -----------------------------------------
    // System xem danh sách thành viên của company
    SYSTEM_GET_MEMBERS: (companyId: number) =>
      `/system/companies/${companyId}/members`,

    //------------------------------- COMPANY -----------------------------------------
    // Company lấy danh sách thành viên của mình
    COMPANY_GET_MEMBERS: "/companies/members",

    // HR_Recruiter gửi lời mời tham gia company
    COMPANY_SEND_JOIN_REQUEST: (companyId: number) =>
      `/companies/${companyId}/join`,

    // HR_Manager xem các yêu cầu tham gia company
    COMPANY_GET_PENDING_JOIN_REQUESTS: "/companies/join-requests",

    // HR_Manager cập nhật trạng thái yêu cầu tham gia company (chấp nhận / từ chối)
    COMPANY_UPDATE_JOIN_REQUEST_STATUS: (comUserId: number) =>
      `/companies/join-requests/${comUserId}/status`,

    // HR_Recruiter hủy yêu cầu tham gia company đã gửi
    COMPANY_CANCEL_JOIN_REQUEST: "/companies/join-request/cancel",

    // HR_Manager xóa account Recruiter ra khỏi công ty
    COMPANY_DELETE_MEMBER: (comUserId: number) =>
      `/companies/members/${comUserId}`,
  },

  // Company Subscription endpoints
  COMPANY_SUBSCRIPTION: {
    //------------------------------- SYSTEM -----------------------------------------
    SYSTEM_GET: "/system/company-subscriptions",
    SYSTEM_GET_BY_ID: (companySubscriptionId: number) =>
      `/system/company-subscriptions/${companySubscriptionId}`,
    SYSTEM_CREATE: "/system/company-subscriptions",
    SYSTEM_UPDATE: (companySubscriptionId: number) =>
      `/system/company-subscriptions/${companySubscriptionId}`,
    SYSTEM_DELETE: (companySubscriptionId: number) =>
      `/system/company-subscriptions/${companySubscriptionId}`,

    //------------------------------- COMPANY -----------------------------------------
    // Company hủy gói subscription hiện tại
    COMPANY_CANCEL: "/company-subscriptions/cancel",

    // Company xem gói subscription hiện tại
    COMPANY_CURRENT: "/company-subscriptions/current-subscription",
  },

  PAYMENT: {
    //------------------------------- COMPANY -----------------------------------------
    // HR_Manager tạo thanh toán cho company
    COMPANY_CHECKOUT: "/payments/checkout",

    // HR_Manager xem lịch sử thanh toán của company
    COMPANY_GET: "/payments",
    COMPANY_GET_BY_ID: (paymentId: number) => `/payments/${paymentId}`,

    // Get Stripe session by sessionId
    COMPANY_GET_SESSION: (sessionId: string) =>
      `/payments/stripe/session?sessionId=${sessionId}`,
  },

  RESUME: {
    //------------------------------- COMPANY -----------------------------------------
    // Upload resume to a job
    COMPANY_UPLOAD: "/resumes/upload",

    // Get resumes for a job
    COMPANY_GET: (jobId: number) => `/jobs/${jobId}/resumes`,
    COMPANY_GET_BY_ID: (jobId: number, resumeId: number) =>
      `/jobs/${jobId}/resumes/${resumeId}`,

    // Gửi lại resume để AI phân tích lại
    COMPANY_RETRY: (resumeId: number) => `/resumes/${resumeId}/retry`,

    // Delete a resume
    COMPANY_DELETE: (resumeId: number) => `/resumes/${resumeId}`,
  },

  ROLE: {
    //------------------------------- SYSTEM -----------------------------------------
    SYSTEM_GET: "/system/roles",
    SYSTEM_GET_BY_ID: (roleId: number) => `/system/roles/${roleId}`,
  },

  NOTIFICATION: {
    //------------------------------- AUTH -----------------------------------------
    AUTH_GET: "/notifications/me",
    AUTH_MARK_AS_READ: (notificationId: number) =>
      `/notifications/mark-as-read/${notificationId}`,
    AUTH_MARK_ALL_AS_READ: "/notifications/mark-all-as-read",
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
  SUBSCRIPTIONS: "/subscriptions",

  // Profile routes
  PROFILE: "/profile",
  PROFILE_ACCOUNT_DETAIL: "/profile/account-detail",
  PROFILE_NOTIFICATION: "/profile/notification",
  PROFILE_SECURITY: "/profile/security",

  // System base routes per role
  SYSTEM_ADMIN: "/system",
  SYSTEM_MANAGER: "/system_manager",
  SYSTEM_STAFF: "/system_staff",

  // Optional: dashboard riêng cho Manager / Staff cho đẹp
  SYSTEM_MANAGER_DASHBOARD: "/system_manager/dashboard",
  SYSTEM_STAFF_DASHBOARD: "/system_staff/dashboard",

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
  SYSTEM_TAXONOMY_CATEGORY: "/system/taxonomy/categories",
  SYSTEM_TAXONOMY_SKILL: "/system/taxonomy/skills",
  SYSTEM_TAXONOMY_SPECIALIZATION: "/system/taxonomy/specializations",
  SYSTEM_TAXONOMY_RECRUITMENT_TYPE: "/system/taxonomy/recruitment-types",

  // Content
  SYSTEM_CONTENT_BANNERS: "/system/content/banners",
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
  COMPANY_AI_SCREENING_RESUMES: "/company/ai-screening/:jobId/resumes",
  COMPANY_AI_SCREENING_COMPARE: "/company/ai-screening/compare",
  COMPANY_SUBSCRIPTIONS: "/company/subscriptions",
  COMPANY_MY_SUBSCRIPTIONS: "/company/my-subscription",
  COMPANY_PAYMENT_HISTORY: "/company/payment-history",
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
