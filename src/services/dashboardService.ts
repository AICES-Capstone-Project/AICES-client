import api from "./api";
import { get } from "./api";
import { API_ENDPOINTS } from "./config";

export interface DashboardSummary {
  activeJobs: number;      
  totalMembers: number; 
  aiProcessed: number;     
  resumeCreditsRemaining: number;
  totalPublicCampaigns: number;
  totalCampaigns: number;
  comparisonCreditsRemaining: number;
  resumeTimeRemaining: string;
  comparisonTimeRemaining: string;
}

export interface TopCategory {
  categoryId: number;
  categoryName: string;
  specializationId: number;
  specializationName: string;
  resumeCount: number; 
}

export interface TopCandidate {
  name: string;      
  jobTitle: string;  
  aiScore: number;    
  status: string;
  avatar?: string;
}

export interface SubscriptionUsageHistory {
  range: string;
  unit: string;
  labels: string[];
  resumeUploads: number[];
  aiComparisons: number[];
  resumeLimit: number;
  aiComparisonLimit: number;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const dashboardService = {
  async getSummary() {
    try {
      const resp = await get(API_ENDPOINTS.COMPANY_DASHBOARD.SUMMARY);
      console.log('Summary API response:', resp);
      
      // Handle API response format: { status: "Success", message: "...", data: {...} }
      if (resp && resp.status === 'Success' && resp.data) {
        const apiData: any = resp.data;
        // Return the actual API data directly
        return {
          activeJobs: apiData.activeJobs || 0,
          totalMembers: apiData.totalMembers || 0,
          aiProcessed: apiData.aiProcessed || 0,
          resumeCreditsRemaining: apiData.resumeCreditsRemaining || 0,
          totalPublicCampaigns: apiData.totalPublicCampaigns || 0,
          totalCampaigns: apiData.totalCampaigns || 0,
          comparisonCreditsRemaining: apiData.comparisonCreditsRemaining || 0,
          resumeTimeRemaining: apiData.resumeTimeRemaining || '',
          comparisonTimeRemaining: apiData.comparisonTimeRemaining || '',
        };
      } else if (resp && resp.data) {
        return resp.data;
      }
      return resp;
    } catch (err) {
      console.error('getSummary error:', err);
      await delay(300);
      return {
        activeJobs: 16,
        totalMembers: 2,
        aiProcessed: 16,
        resumeCreditsRemaining: 100,
        totalPublicCampaigns: 4,
        totalCampaigns: 18,
        comparisonCreditsRemaining: 100,
        resumeTimeRemaining: '2025-12-23T07:00:00Z',
        comparisonTimeRemaining: '2025-12-23T07:00:00Z',
      };
    }
  },

  async getKpiJob() {
    try {
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

  async getPipelineFunnel(params?: { jobId?: number; campaignId?: number; startDate?: string; endDate?: string }) {
    try {
      const res = await api.get(API_ENDPOINTS.COMPANY_DASHBOARD.PIPELINE_FUNNEL, { params: params || {} });
      return (res && (res as any).data) ? (res as any).data : res;
    } catch (err) {
      await delay(200);
      return { stages: [] };
    }
  },

  async getSubscriptionUsageHistory(range: string = "month") {
    try {
      const res = await api.get(API_ENDPOINTS.COMPANY_DASHBOARD.SUBSCRIPTION_USAGE_HISTORY, { 
        params: { range } 
      });
      console.log('Raw API response:', res);
      // Extract data from ApiResponse structure: { status, message, data }
      if (res && res.data && res.data.status === 'Success') {
        return res.data.data; // Return the nested data object
      } else if (res && res.data) {
        return res.data; // Fallback if structure is different
      }
      return res;
    } catch (err) {
      console.error('Usage history API error:', err);
      await delay(200);
      return {
        range: "month",
        unit: "day",
        labels: [],
        resumeUploads: [],
        aiComparisons: [],
        resumeLimit: 100,
        aiComparisonLimit: 100
      };
    }
  },

  async getStatsOverview() {
    try {
      const res = await api.get(API_ENDPOINTS.COMPANY_DASHBOARD.STATS_OVERVIEW);
      console.log('Stats overview API response:', res);
      // Extract data from ApiResponse structure: { status, message, data }
      if (res && res.data && res.data.status === 'Success') {
        return res.data.data; // Return the nested data object
      } else if (res && res.data) {
        return res.data; // Fallback if structure is different
      }
      return res;
    } catch (err) {
      console.error('Stats overview API error:', err);
      await delay(200);
      return {
        totalJobs: 0,
        top5JobsInCampaigns: [],
        top5CampaignsWithMostJobs: [],
        top5CandidatesWithMostJobs: [],
        top5HighestScoreCVs: [],
        onTimeCampaignsThisMonth: 0
      };
    }
  },
};

export default dashboardService;