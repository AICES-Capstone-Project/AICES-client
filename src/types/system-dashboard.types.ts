// src/types/system-dashboard.types.ts

// Generic base response cho tất cả API dashboard
export interface SystemDashboardApiResponse<T> {
  status: string; // "Success" | "Error" ...
  message: string;
  data: T;
}

/* =========================
 * 1. /api/system/dashboard/overview
 * ========================= */

export interface SystemOverviewData {
  totalCompanies: number;
  totalUsers: number;
  totalJobs: number;
  totalResumes: number;
  totalCompanySubscriptions: number;
  totalSubscriptions: number;
  totalRevenue: number;
}

export type SystemOverviewResponse =
  SystemDashboardApiResponse<SystemOverviewData>;

/* =========================
 * 2. /api/system/dashboard/companies
 * ========================= */

export interface SystemCompaniesStatsData {
  totalCompanies: number;
  approvedCompanies: number;
  pendingCompanies: number;
  rejectedCompanies: number;
  suspendedCompanies: number;
  newCompaniesThisMonth: number;
}

export type SystemCompaniesStatsResponse =
  SystemDashboardApiResponse<SystemCompaniesStatsData>;

/* =========================
 * 3. /api/system/dashboard/company-subscriptions
 * ========================= */

export interface SystemCompanySubscriptionsData {
  totalCompanySubscriptions: number;
  active: number;
  expired: number;
  newThisMonth: number;
}

export type SystemCompanySubscriptionsResponse =
  SystemDashboardApiResponse<SystemCompanySubscriptionsData>;

/* =========================
 * 4. /api/system/dashboard/top-companies
 * ========================= */

export interface SystemTopCompanyItem {
  companyId: number;
  companyName: string;
  resumeCount: number;
  jobCount: number;
}

export type SystemTopCompaniesResponse =
  SystemDashboardApiResponse<SystemTopCompanyItem[]>;

/* =========================
 * 5. /api/system/dashboard/revenue
 * ========================= */

export interface SystemRevenueData {
  month: string; // "2025-12"
  totalRevenue: number;
  fromNewSubscriptions: number;
}

export type SystemRevenueResponse =
  SystemDashboardApiResponse<SystemRevenueData>;

/* =========================
 * 6. /api/system/dashboard/users
 * ========================= */

export interface SystemUsersByRoleItem {
  role: string; // "HR_Recruiter" | "System_Admin" ...
  count: number;
}

export interface SystemUsersData {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  newUsersThisMonth: number;
  byRole: SystemUsersByRoleItem[];
}

export type SystemUsersResponse =
  SystemDashboardApiResponse<SystemUsersData>;

/* =========================
 * 7. /api/system/dashboard/jobs
 * ========================= */

export interface SystemJobsData {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  expiredJobs: number;
  newJobsThisMonth: number;
}

export type SystemJobsResponse =
  SystemDashboardApiResponse<SystemJobsData>;

/* =========================
 * 8. /api/system/dashboard/resumes
 * ========================= */

export interface SystemResumesData {
  totalResumes: number;
  newResumesThisMonth: number;
  appliedThisMonth: number;
}

export type SystemResumesResponse =
  SystemDashboardApiResponse<SystemResumesData>;

/* =========================
 * 9. /api/system/dashboard/subscription-plans
 * ========================= */

export interface SystemSubscriptionPlanItem {
  planName: string;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

export type SystemSubscriptionPlansResponse =
  SystemDashboardApiResponse<SystemSubscriptionPlanItem[]>;
