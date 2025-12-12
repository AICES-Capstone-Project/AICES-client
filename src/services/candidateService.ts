import { get, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export const candidateService = {
  // Get candidates (company/system)
  // Supports optional paging params
  getCandidates: async (
    params?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<any>> => {
    const q = params
      ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}`
      : "";
    return await get<any>(`${API_ENDPOINTS.CANDIDATE.COMPANY_GET_ALL}${q}`);
  },

  // Get candidate by id
  getCandidateById: async (candidateId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.CANDIDATE.COMPANY_GET_BY_ID(candidateId));
  },

  // Delete candidate
  deleteCandidate: async (candidateId: number): Promise<ApiResponse<any>> => {
    return await remove<any>(API_ENDPOINTS.CANDIDATE.COMPANY_DELETE(candidateId));
  },

};

export default candidateService;
