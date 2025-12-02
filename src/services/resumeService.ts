import { postForm, post, get, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { Resume, Paginated } from "../types/company.types";

export const resumeService = {
  // Upload a resume file to a job (multipart/form-data)
  uploadToJob: async (formData: FormData): Promise<ApiResponse<null>> => {
    return await postForm<null>(API_ENDPOINTS.RESUME.COMPANY_UPLOAD, formData);
  },

  // Get resumes for a job (paged)
  getByJob: async (
    jobId: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<Paginated<Resume>>> => {
    const q = params
      ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}`
      : "";
    return await get<Paginated<Resume>>(
      `${API_ENDPOINTS.RESUME.COMPANY_GET(jobId)}${q}`
    );
  },

  // Get resume detail by id (for a job)
  getById: async (
    jobId: number,
    resumeId: number
  ): Promise<ApiResponse<Resume>> => {
    return await get<Resume>(
      API_ENDPOINTS.RESUME.COMPANY_GET_BY_ID(jobId, resumeId)
    );
  },

  // Retry analysis / reprocess a resume
  retryAnalysis: async (resumeId: number): Promise<ApiResponse<null>> => {
    // Use POST for retry requests (server may expect POST even without a body)
    return await post<null>(API_ENDPOINTS.RESUME.COMPANY_RETRY(resumeId), {});
  },

  // Delete a resume
  delete: async (resumeId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.RESUME.COMPANY_DELETE(resumeId));
  },
  // 🔹 System Admin: xem resumes theo job
  getSystemResumes: async (
    jobId: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<Paginated<Resume>>> => {
    const q = params
      ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}`
      : "";
    return await get<Paginated<Resume>>(
      `${API_ENDPOINTS.RESUME.COMPANY_GET(jobId)}${q}`
    );
  },

  // 🔹 System Admin: xem chi tiết 1 resume trong job
  getSystemResumeById: async (
    jobId: number,
    resumeId: number
  ): Promise<ApiResponse<Resume>> => {
    return await get<Resume>(
      API_ENDPOINTS.RESUME.COMPANY_GET_BY_ID(jobId, resumeId)
    );
  },
};

export default resumeService;
