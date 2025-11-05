import { get, post, patch, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export interface CompanyJob {
  jobId: number;
  title: string;
  description?: string;
  slug?: string;
  requirements?: string;
  createdAt: string;
  categoryName?: string | null;
  specializationName?: string | null;
  employmentTypes?: any[];
  criteria?: any[];
  skills?: any[];
}

export interface JobsResponse {
  jobs: CompanyJob[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const jobService = {
  // Get company jobs with pagination
  getCompanyJobs: async (page = 1, pageSize = 10): Promise<ApiResponse<JobsResponse>> => {
    return await get<JobsResponse>(`${API_ENDPOINTS.COMPANY.GET_JOBS}?page=${page}&pageSize=${pageSize}`);
  },
  
  // Get single job by ID
  getJobById: async (jobId: number): Promise<ApiResponse<CompanyJob>> => {
    return await get<CompanyJob>(`${API_ENDPOINTS.COMPANY.GET_JOBS}/${jobId}`);
  },
  
  // Create new job
  createJob: async (jobData: Partial<CompanyJob>): Promise<ApiResponse<CompanyJob>> => {
    return await post<CompanyJob, Partial<CompanyJob>>(API_ENDPOINTS.COMPANY.GET_JOBS, jobData);
  },
  
  // Update job by ID
  updateJob: async (jobId: number, jobData: Partial<CompanyJob>): Promise<ApiResponse<CompanyJob>> => {
    // The API expects the job fields directly in the request body (not wrapped in a `data` key)
    return await patch<CompanyJob>(`${API_ENDPOINTS.COMPANY.GET_JOBS}/${jobId}`, jobData as Record<string, unknown>);
  },
  
  // Delete job by ID
  deleteJob: async (jobId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(`${API_ENDPOINTS.COMPANY.GET_JOBS}/${jobId}`);
  },
};
