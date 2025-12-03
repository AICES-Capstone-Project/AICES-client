import api from "./api";
import { get } from "./api";
import { API_ENDPOINTS } from "./config";

import type { ApiResponse } from "../types/api.types";

// ================== TYPES / INTERFACES ==================

export interface DashboardSummary {
  activeJobs: number;       // Thay cho totalJobs
  totalMembers: number;  // Thay cho totalResumes
  aiProcessed: number;      // Thay cho totalViews
  creditsRemaining: number; // Trường mới
}

export interface TopCategory {
  categoryId: number;
  categoryName: string;
  specializationId: number;
  specializationName: string;
  resumeCount: number; // API trả về resumeCount
}

export interface TopCandidate {
  name: string;       // Thay vì fullName
  jobTitle: string;   // Thay vì email
  aiScore: number;    // Thay vì totalScore
  status: string;
  avatar?: string;
}

// ================== SERVICE ==================

export const companyDashboardService = {
  // GET Summary: /dashboard/summary
  // Dùng hàm get helper giống method getCurrentSubscription của bạn
  async getSummary(): Promise<ApiResponse<DashboardSummary>> {
    return await get<DashboardSummary>(
      API_ENDPOINTS.COMPANY_DASHBOARD.SUMMARY
    );
  },

  // GET Top Category: /dashboard/top-category-spec
  // Dùng api.get để truyền params giống method getList của bạn
  async getTopCategorySpec(top: number = 10): Promise<TopCategory[]> {
    const res = await api.get<ApiResponse<TopCategory[]>>(
      API_ENDPOINTS.COMPANY_DASHBOARD.TOP_CATE_SPEC,
      {
        params: { top },
      }
    );
    return res.data.data!;
  },

  // GET Top Candidates: /dashboard/top-rated-candidates
  // Dùng api.get để truyền params giống method getList của bạn
  async getTopRatedCandidates(limit: number = 5): Promise<TopCandidate[]> {
    const res = await api.get<ApiResponse<TopCandidate[]>>(
      API_ENDPOINTS.COMPANY_DASHBOARD.TOP_RATE_RESUME,
      {
        params: { limit },
      }
    );
    return res.data.data!;
  },
};

export default companyDashboardService;