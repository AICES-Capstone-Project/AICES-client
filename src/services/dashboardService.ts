import api from "./api";
import { get } from "./api";
import { API_ENDPOINTS } from "./config";

// (removed unused ApiResponse import)

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

// Helper delay for mock fallback
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const dashboardService = {
  // Try to fetch real summary from API, otherwise return mock
  async getSummary() {
    try {
      const resp = await get(API_ENDPOINTS.COMPANY_DASHBOARD.SUMMARY);
      // support both shapes: { data: {...} } or direct object
      return (resp && (resp as any).data) ? (resp as any).data : resp;
    } catch (err) {
      await delay(300);
      return {
        campaigns: 18,
        jobs: 42,
        cvSubmitted: 320,
        cvHired: 48,
        totalCandidates: 560,
      };
    }
  },

  async getKpiJob() {
    // No dedicated endpoint in config — return mocked KPI for now
    try {
      // if API existed, call it here
      await delay(200);
      return { successOnTime: 32, failed: 10 };
    } catch (err) {
      return { successOnTime: 0, failed: 0 };
    }
  },

  async getKpiCampaign() {
    try {
      await delay(200);
      return { successOnTime: 12, failed: 6 };
    } catch (err) {
      return { successOnTime: 0, failed: 0 };
    }
  },

  // Top categories - attempt API then fallback
  async getTopCategorySpec(top: number = 10) {
    try {
      const res = await api.get(API_ENDPOINTS.COMPANY_DASHBOARD.TOP_CATE_SPEC, { params: { top } });
      return (res && (res as any).data) ? (res as any).data : [];
    } catch (err) {
      await delay(200);
      return [];
    }
  },

  async getTopRatedCandidates(limit: number = 5) {
    try {
      const res = await api.get(API_ENDPOINTS.COMPANY_DASHBOARD.TOP_RATE_RESUME, { params: { limit } });
      return (res && (res as any).data) ? (res as any).data : [];
    } catch (err) {
      await delay(200);
      return [];
    }
  },
};

export default dashboardService;