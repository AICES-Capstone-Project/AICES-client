import { get } from "./api";
import { API_ENDPOINTS } from "./config";

import type {
  SystemOverviewData,
  SystemCompaniesStatsData,
  SystemCompanySubscriptionsData,
  SystemTopCompanyItem,
  SystemRevenueData,
  SystemUsersData,
  SystemJobsData,
  SystemResumesData,
  SystemSubscriptionPlanItem,
  SystemResumeEffectivenessData,
} from "../types/system-dashboard.types";

export const systemDashboardService = {
  getOverview() {
    return get<SystemOverviewData>(API_ENDPOINTS.SYSTEM_DASHBOARD.OVERVIEW);
  },

  getCompanies() {
    return get<SystemCompaniesStatsData>(API_ENDPOINTS.SYSTEM_DASHBOARD.COMPANIES);
  },

  getCompanySubscriptions() {
    return get<SystemCompanySubscriptionsData>(
      API_ENDPOINTS.SYSTEM_DASHBOARD.COMPANY_SUBSCRIPTIONS
    );
  },

  getTopCompanies() {
    return get<SystemTopCompanyItem[]>(API_ENDPOINTS.SYSTEM_DASHBOARD.TOP_COMPANIES);
  },

  getRevenue() {
    return get<SystemRevenueData>(API_ENDPOINTS.SYSTEM_DASHBOARD.REVENUE);
  },

  getUsers() {
    return get<SystemUsersData>(API_ENDPOINTS.SYSTEM_DASHBOARD.USERS);
  },

  getJobs() {
    return get<SystemJobsData>(API_ENDPOINTS.SYSTEM_DASHBOARD.JOBS);
  },

  getResumes() {
    return get<SystemResumesData>(API_ENDPOINTS.SYSTEM_DASHBOARD.RESUMES);
  },

  getSubscriptionPlans() {
    return get<SystemSubscriptionPlanItem[]>(
      API_ENDPOINTS.SYSTEM_DASHBOARD.SUBSCRIPTION_PLANS
    );
  },

  getResumeEffectiveness() {
    return get<SystemResumeEffectivenessData>(
      API_ENDPOINTS.SYSTEM_DASHBOARD.RESUME_EFFECTIVENESS
    );
  },
};
