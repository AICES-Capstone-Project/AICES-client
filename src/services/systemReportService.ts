// src/services/systemReportService.ts
import { get } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

import type {
  SystemExecutiveSummary,
  SystemCompaniesOverviewReport,
  SystemCompaniesUsageReport,
  SystemJobsStatisticsReport,
  SystemJobsEffectivenessReport,
  SystemAiParsingReport,
  SystemAiScoringReport,
  SystemSubscriptionsReport,
} from "../types/systemReport.types";

const unwrap = <T>(res: ApiResponse<T>): T => {
  // BE trả { status, message, data }
  // Nếu fail thì requestApi đã return data: null
  if (res?.data == null) {
    // ném error để container bắt và show error đúng
    throw new Error(res?.message || "No data returned from API");
  }
  return res.data as T;
};

export const systemReportService = {
  async getExecutiveSummary(): Promise<SystemExecutiveSummary> {
    const res = await get<SystemExecutiveSummary>(
      API_ENDPOINTS.SYSTEM_REPORTS.EXECUTIVE_SUMMARY
    );
    return unwrap(res);
  },

  async getCompanyOverview(): Promise<SystemCompaniesOverviewReport> {
    const res = await get<SystemCompaniesOverviewReport>(
      API_ENDPOINTS.SYSTEM_REPORTS.COMPANIES_OVERVIEW
    );
    return unwrap(res);
  },

  async getCompanyUsage(): Promise<SystemCompaniesUsageReport> {
    const res = await get<SystemCompaniesUsageReport>(
      API_ENDPOINTS.SYSTEM_REPORTS.COMPANIES_USAGE
    );
    return unwrap(res);
  },

  async getJobStatistics(): Promise<SystemJobsStatisticsReport> {
    const res = await get<SystemJobsStatisticsReport>(
      API_ENDPOINTS.SYSTEM_REPORTS.JOBS_STATISTICS
    );
    return unwrap(res);
  },

  async getJobEffectiveness(): Promise<SystemJobsEffectivenessReport> {
    const res = await get<SystemJobsEffectivenessReport>(
      API_ENDPOINTS.SYSTEM_REPORTS.JOBS_EFFECTIVENESS
    );
    return unwrap(res);
  },

  async getAiParsingQuality(): Promise<SystemAiParsingReport> {
    const res = await get<SystemAiParsingReport>(
      API_ENDPOINTS.SYSTEM_REPORTS.AI_PARSING
    );
    return unwrap(res);
  },

  async getAiScoringDistribution(): Promise<SystemAiScoringReport> {
    const res = await get<SystemAiScoringReport>(
      API_ENDPOINTS.SYSTEM_REPORTS.AI_SCORING
    );
    return unwrap(res);
  },

  async getSubscriptionRevenue(): Promise<SystemSubscriptionsReport> {
    const res = await get<SystemSubscriptionsReport>(
      API_ENDPOINTS.SYSTEM_REPORTS.SUBSCRIPTIONS
    );
    return unwrap(res);
  },
};
