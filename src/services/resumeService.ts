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

  uploadBatch: async (campaignId: number, jobId: number, files: File[]): Promise<ApiResponse<null>> => {
    const formData = new FormData();
    
    formData.append("CampaignId", String(campaignId));
    formData.append("JobId", String(jobId));
    
    // Append all files to FormData
    files.forEach(file => {
      formData.append("Files", file);
    });

    return await postForm<null>(API_ENDPOINTS.RESUME.COMPANY_UPLOAD_BATCH, formData);
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

    const q = params ? `?page=${params.page ?? 1}&pageSize=${params.pageSize ?? 10}` : "";

    if (campaignId != null) {
      return await get<Paginated<Resume>>(`${API_ENDPOINTS.RESUME.COMPANY_GET(campaignId, jobId)}${q}`);
    }
    return await get<Paginated<Resume>>(`/jobs/${jobId}/resumes${q}`);
  },

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

    // params may include extended filters: search, minScore, maxScore, applicationStatus, sortBy, processingMode
    const p = (params || {}) as Record<string, any>;
    const qp = new URLSearchParams();
    qp.append("page", String(p.page ?? 1));
    qp.append("pageSize", String(p.pageSize ?? 10));

    if (p.search) qp.append("search", String(p.search));
    if (p.minScore !== undefined && p.minScore !== null) qp.append("minScore", String(p.minScore));
    if (p.maxScore !== undefined && p.maxScore !== null) qp.append("maxScore", String(p.maxScore));
    if (p.applicationStatus) qp.append("applicationStatus", String(p.applicationStatus));
    if (p.sortBy) qp.append("sortBy", String(p.sortBy));
    if (p.processingMode) qp.append("processingMode", String(p.processingMode));

    const q = qp.toString() ? `?${qp.toString()}` : "";

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
      const campaignId = idOrCampaignId;
      const jobId = maybeJobIdOrResumeId;
      const applicationId = maybeResumeId;
      return await get<Resume>(API_ENDPOINTS.RESUME.COMPANY_GET_BY_ID(campaignId, jobId, applicationId));
    }

    const jobId = idOrCampaignId;
    const resumeId = maybeJobIdOrResumeId;
    return await get<Resume>(`/jobs/${jobId}/resumes/${resumeId}`);
  },

  retryAnalysis: async (resumeId: number): Promise<ApiResponse<null>> => {
    return await post<null>(API_ENDPOINTS.RESUME.COMPANY_RETRY(resumeId), {});
  },

  updateAdjustedScore: async (applicationId: number, adjustedScore: number): Promise<ApiResponse<null>> => {
    return await patch<null>(API_ENDPOINTS.RESUME.ADJUSTED_SCORE(applicationId), { adjustedScore });
  },

  updateApplicationStatus: async (applicationId: number, status: string, note?: string): Promise<ApiResponse<null>> => {
    return await patch<null>(API_ENDPOINTS.RESUME.UPDATE_STATUS(applicationId), { status, note });
  },

  delete: async (applicationId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.RESUME.COMPANY_DELETE(applicationId));
  },

  getApplicationsByResume: async (resumeId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.RESUME.APPLICATIONS_BY_RESUME(resumeId));
  },
  getApplicationById: async (resumeId: number, applicationId: number): Promise<ApiResponse<any>> => {
    return await get<any>(API_ENDPOINTS.RESUME.APPLICATION_BY_ID(resumeId, applicationId));
  },
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

    const q = params ? `?page=${params.page ?? 1}&pageSize=${params.pageSize ?? 10}` : "";

    if (campaignId != null) {
      return await get<Paginated<Resume>>(`${API_ENDPOINTS.RESUME.COMPANY_GET(campaignId, jobId)}${q}`);
    }

    return await get<Paginated<Resume>>(`/jobs/${jobId}/resumes${q}`);
  },

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
