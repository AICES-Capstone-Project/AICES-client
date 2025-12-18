import { get, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export const candidateService = {
  // [CHANGED] Cập nhật hàm getCandidates để nhận thêm tham số search
  getCandidates: async (
    params?: { page?: number; pageSize?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<ApiResponse<any>> => {
    
    // Lấy giá trị default
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    
    // Tạo query string cơ bản
    let queryString = `?page=${page}&pageSize=${pageSize}`;

    // [NEW] Nếu có search, nối thêm vào chuỗi query
    if (params?.search) {
      // encodeURIComponent để xử lý các ký tự đặc biệt (dấu cách, tiếng Việt,...)
      queryString += `&search=${encodeURIComponent(params.search)}`;
    }

    // Nếu có sortBy/sortOrder, nối vào
    if (params?.sortBy) {
      queryString += `&sortBy=${encodeURIComponent(params.sortBy)}`;
    }
    if (params?.sortOrder) {
      queryString += `&sortOrder=${encodeURIComponent(params.sortOrder)}`;
    }

    return await get<any>(`${API_ENDPOINTS.CANDIDATE.COMPANY_GET_ALL}${queryString}`);
  },

  // Get candidate by id
  getCandidateById: async (candidateId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.CANDIDATE.COMPANY_GET_BY_ID(candidateId));
  },

  // Delete candidate
  deleteCandidate: async (candidateId: number): Promise<ApiResponse<any>> => {
    return await remove<any>(API_ENDPOINTS.CANDIDATE.COMPANY_DELETE(candidateId));
  },

  // Get applications for a resume
  getApplicationsByResume: async (resumeId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.RESUME.APPLICATIONS_BY_RESUME(resumeId));
  },

  // Get a single application by resumeId and applicationId
  getApplicationById: async (
    resumeId: number,
    applicationId: number
  ): Promise<ApiResponse<any>> => {
    return await get<any>(
      API_ENDPOINTS.RESUME.APPLICATION_BY_ID(resumeId, applicationId)
    );
  },
};

export default candidateService;