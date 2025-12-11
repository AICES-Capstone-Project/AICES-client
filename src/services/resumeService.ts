import { postForm, post, get, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { Resume, Paginated } from "../types/company.types";

export const resumeService = {
  // Upload a resume file to a job (multipart/form-data)
  // Supports three calling styles for backward compatibility:
  //  - uploadToJob(formData: FormData)
  //  - uploadToJob(jobId: number | string, file: File)
  //  - uploadToJob(campaignId: number, jobId: number, file: File)
  uploadToJob: async (...args: any[]): Promise<ApiResponse<null>> => {
    let formData: FormData;

    // If first arg is FormData, use it directly
    if (args[0] instanceof FormData) {
      formData = args[0] as FormData;
    } else {
      // Determine which signature was used
      // Case: (jobId, file)
      if (
        (typeof args[0] === "number" || typeof args[0] === "string") &&
        args[1] instanceof File
      ) {
        const jobId = args[0];
        const file = args[1] as File;
        formData = new FormData();
        formData.append("JobId", String(jobId));
        formData.append("File", file);
      } else {
        // Assume (campaignId, jobId, file)
        const campaignId = args[0];
        const jobId = args[1];
        const file = args[2] as File;
        formData = new FormData();
        if (campaignId !== undefined && campaignId !== null) {
          formData.append("CampaignId", String(campaignId));
        }
        formData.append("JobId", String(jobId));
        formData.append("File", file);
      }
    }

    return await postForm<null>(API_ENDPOINTS.RESUME.COMPANY_UPLOAD, formData);
  },

  // Get resumes for a job (paged)
  // Supports two signatures for backward compatibility:
  //  - getByJob(jobId, params?)
  //  - getByJob(campaignId, jobId, params?)
  getByJob: async (
    idOrCampaignId: number,
    maybeJobIdOrParams?: number | { page?: number; pageSize?: number },
    maybeParams?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<Paginated<Resume>>> => {
    let campaignId: number | null = null;
    let jobId: number;
    let params: { page?: number; pageSize?: number } | undefined;

    if (typeof maybeJobIdOrParams === "number") {
      // Called as (campaignId, jobId, params?)
      campaignId = idOrCampaignId;
      jobId = maybeJobIdOrParams;
      params = maybeParams;
    } else {
      // Called as (jobId, params?)
      jobId = idOrCampaignId;
      params = maybeJobIdOrParams as { page?: number; pageSize?: number } | undefined;
    }

    const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";

    if (campaignId != null) {
      return await get<Paginated<Resume>>(`${API_ENDPOINTS.RESUME.COMPANY_GET(campaignId, jobId)}${q}`);
    }

    // Fallback to legacy route if campaignId not provided
    return await get<Paginated<Resume>>(`/jobs/${jobId}/resumes${q}`);
  },

  // Get resume detail by id (for a job)
  // Supports: getById(jobId, resumeId) or getById(campaignId, jobId, resumeId)
  getById: async (
    idOrCampaignId: number,
    maybeJobIdOrResumeId: number,
    maybeResumeId?: number
  ): Promise<ApiResponse<Resume>> => {
    if (typeof maybeResumeId === "number") {
      // Called as (campaignId, jobId, resumeId)
      const campaignId = idOrCampaignId;
      const jobId = maybeJobIdOrResumeId;
      const resumeId = maybeResumeId;
      return await get<Resume>(API_ENDPOINTS.RESUME.COMPANY_GET_BY_ID(campaignId, jobId, resumeId));
    }

    // Called as (jobId, resumeId) -> fallback to legacy route
    const jobId = idOrCampaignId;
    const resumeId = maybeJobIdOrResumeId;
    return await get<Resume>(`/jobs/${jobId}/resumes/${resumeId}`);
  },

  // Retry analysis / reprocess a resume
  retryAnalysis: async (resumeId: number): Promise<ApiResponse<null>> => {
    // Use POST for retry requests (server may expect POST even without a body)
    return await post<null>(API_ENDPOINTS.RESUME.COMPANY_RETRY(resumeId), {});
  },

  // Resend resume to AI for re-analysis// Resend resume (e.g., resend email to candidate or reviewer)
  resend: async (jobId: number, resumeId: number): Promise<ApiResponse<null>> => {
    return await post<null>(
      API_ENDPOINTS.RESUME.COMPANY_RESEND(jobId, resumeId),
      {} // Body rỗng vì data đã có sẵn theo resumeId, method POST yêu cầu phải có body
    );
  },

  // Delete a resume
  delete: async (resumeId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.RESUME.COMPANY_DELETE(resumeId));
  },
  // 🔹 System Admin: xem resumes theo job
  getSystemResumes: async (
    idOrCampaignId: number,
    maybeJobIdOrParams?: number | { page?: number; pageSize?: number },
    maybeParams?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<Paginated<Resume>>> => {
    let campaignId: number | null = null;
    let jobId: number;
    let params: { page?: number; pageSize?: number } | undefined;

    if (typeof maybeJobIdOrParams === "number") {
      campaignId = idOrCampaignId;
      jobId = maybeJobIdOrParams;
      params = maybeParams;
    } else {
      jobId = idOrCampaignId;
      params = maybeJobIdOrParams as { page?: number; pageSize?: number } | undefined;
    }

    const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";

    if (campaignId != null) {
      return await get<Paginated<Resume>>(`${API_ENDPOINTS.RESUME.COMPANY_GET(campaignId, jobId)}${q}`);
    }

    return await get<Paginated<Resume>>(`/jobs/${jobId}/resumes${q}`);
  },

  // 🔹 System Admin: xem chi tiết 1 resume trong job
  getSystemResumeById: async (
    idOrCampaignId: number,
    maybeJobIdOrResumeId: number,
    maybeResumeId?: number
  ): Promise<ApiResponse<Resume>> => {
    if (typeof maybeResumeId === "number") {
      const campaignId = idOrCampaignId;
      const jobId = maybeJobIdOrResumeId;
      const resumeId = maybeResumeId;
      return await get<Resume>(API_ENDPOINTS.RESUME.COMPANY_GET_BY_ID(campaignId, jobId, resumeId));
    }

    const jobId = idOrCampaignId;
    const resumeId = maybeJobIdOrResumeId;
    return await get<Resume>(`/jobs/${jobId}/resumes/${resumeId}`);
  },
};

export default resumeService;
