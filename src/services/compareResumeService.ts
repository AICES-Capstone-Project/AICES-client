import { post, get } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

// Payload types can be refined as needed
export const compareResumeService = {
  // POST /api/resumes/compare
  compare: async (body: { jobId?: number; campaignId?: number; applicationIds: number[] }): Promise<ApiResponse<any>> => {
    return await post<any>(API_ENDPOINTS.RESUME.COMPARE, body);
  },

  // POST /api/resumes/result/ai/comparison
  postAiComparisonResult: async (body: any): Promise<ApiResponse<any>> => {
    return await post<any>(API_ENDPOINTS.RESUME.COMPARISON_RESULT_AI, body);
  },

  // GET /api/resumes/comparisons/{comparisonId}
  getComparisonById: async (comparisonId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.RESUME.GET_COMPARISON_BY_ID(comparisonId));
  },

  // GET /api/resumes/comparisons/job/{jobId}/campaign/{campaignId}
  getComparisonsByJobCampaign: async (jobId: number, campaignId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.RESUME.GET_COMPARISONS_BY_JOB_CAMPAIGN(jobId, campaignId));
  },
};

export default compareResumeService;
