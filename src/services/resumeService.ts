import { postForm, post, get, remove, patch } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { Resume, Paginated } from "../types/company.types";

export const resumeService = {
  uploadToJob: async (...args: any[]): Promise<ApiResponse<null>> => {
    let formData: FormData;

    if (args[0] instanceof FormData) {
      formData = args[0] as FormData;
    } else {
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

  // Backwards-compatible fetch helper with signature (jobId, campaignId?, params?)
  fetchResumes: async (
    jobId: number,
    campaignIdOrParams?: number | { page?: number; pageSize?: number },
    maybeParams?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<Paginated<Resume>>> => {
    let campaignId: number | null = null;
    let actualJobId: number = jobId;
    let params: { page?: number; pageSize?: number } | undefined;

    if (typeof campaignIdOrParams === "number") {
      campaignId = campaignIdOrParams;
      params = maybeParams;
    } else {
      params = campaignIdOrParams as { page?: number; pageSize?: number } | undefined;
    }

    const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";

    if (campaignId != null) {
      return await get<Paginated<Resume>>(`${API_ENDPOINTS.RESUME.COMPANY_GET(campaignId, actualJobId)}${q}`);
    }

    return await get<Paginated<Resume>>(`/jobs/${actualJobId}/resumes${q}`);
  },

  getById: async (
    idOrCampaignId: number,
    maybeJobIdOrResumeId: number,
    maybeResumeId?: number
  ): Promise<ApiResponse<Resume>> => {
    if (typeof maybeResumeId === "number") {
      // Called as (campaignId, jobId, resumeId)
      const campaignId = idOrCampaignId;
      const jobId = maybeJobIdOrResumeId;
      const applicationId = maybeResumeId;
      return await get<Resume>(API_ENDPOINTS.RESUME.COMPANY_GET_BY_ID(campaignId, jobId, applicationId));
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

  // Update adjusted score for an application
  updateAdjustedScore: async (applicationId: number, adjustedScore: number): Promise<ApiResponse<null>> => {
    return await patch<null>(API_ENDPOINTS.RESUME.ADJUSTED_SCORE(applicationId), { adjustedScore });
  },

  // Update application status (e.g., Pending, Reviewed, Rejected)
  updateApplicationStatus: async (applicationId: number, status: string, note?: string): Promise<ApiResponse<null>> => {
    return await patch<null>(API_ENDPOINTS.RESUME.UPDATE_STATUS(applicationId), { status, note });
  },

  // Delete a resume
  delete: async (applicationId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.RESUME.COMPANY_DELETE(applicationId));
  },

  getApplicationsByResume: async (resumeId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.RESUME.APPLICATIONS_BY_RESUME(resumeId));
  },
  getApplicationById: async (resumeId: number, applicationId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.RESUME.APPLICATION_BY_ID(resumeId, applicationId));
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
