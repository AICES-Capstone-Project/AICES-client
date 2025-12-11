import { post, postForm, get, put, patchForm, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { CreateCompanyRequest } from "../types/company.types";

interface CompanyData {
  companyId: number;
  name: string;
  description?: string;
  address?: string;
  websiteUrl?: string;
  taxCode?: string | null;
  logoUrl?: string;
  companyStatus:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Suspended"
    | "Canceled"
    | string;

  rejectionReason?: string | null;
  managerName?: string | null;
  documents?: { documentType: string; fileUrl: string }[];

  createdBy?: string | number | null;
  approvalBy?: string | number | null;

  createdAt?: string;
}

export const companyService = {
  create: async (data: CreateCompanyRequest): Promise<ApiResponse<null>> => {
    return await post<null, CreateCompanyRequest>(
      API_ENDPOINTS.COMPANY.COMPANY_CREATE,
      data
    );
  },
  // Send multipart/form-data (for logo and document files)
  createForm: async (formData: FormData): Promise<ApiResponse<null>> => {
    return await postForm<null>(API_ENDPOINTS.COMPANY.COMPANY_CREATE, formData);
  },
  // === NEW: Create company as System Admin (POST /api/companies) ===
  createAdminForm: async (formData: FormData): Promise<ApiResponse<null>> => {
    return await postForm<null>(API_ENDPOINTS.COMPANY.SYSTEM_CREATE, formData);
  },

  // Get current user's company
  getSelf: async (): Promise<ApiResponse<CompanyData>> => {
    return await get<CompanyData>(API_ENDPOINTS.COMPANY.COMPANY_GET_PROFILE);
  },
  // Get company members (paged)
  getMembers: async (
    companyId?: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<any>> => {
    const q = params
      ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}`
      : "";
    if (companyId) {
      return await get<any>(
        `${API_ENDPOINTS.COMPANY_USER.SYSTEM_GET_MEMBERS(companyId)}${q}`
      );
    }
    // fallback to current user's company members endpoint
    return await get<any>(API_ENDPOINTS.COMPANY_USER.COMPANY_GET_MEMBERS);
  },

  getById: async (companyId: number) => {
    return await get<CompanyData>(
      API_ENDPOINTS.COMPANY.PUBLIC_GET_BY_ID(companyId)
    );
  },

  // Get job detail for a company
  getJobDetail: async (jobId: number) => {
    return await get<any>(API_ENDPOINTS.JOB.COMPANY_PUBLISHED_BY_ID(jobId));
  },

  // Get resumes for a job
  // Supports: getResumes(jobId, params?) or getResumes(campaignId, jobId, params?)
  getResumes: async (
    idOrCampaignId: number,
    maybeJobIdOrParams?: number | { page?: number; pageSize?: number },
    maybeParams?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<{ items: any[]; totalPages: number }>> => {
    let campaignId: number | null = null;
    let jobId: number;
    let params: { page?: number; pageSize?: number } | undefined;

    if (typeof maybeJobIdOrParams === "number") {
      // called as (campaignId, jobId, params?)
      campaignId = idOrCampaignId;
      jobId = maybeJobIdOrParams;
      params = maybeParams;
    } else {
      // called as (jobId, params?)
      jobId = idOrCampaignId;
      params = maybeJobIdOrParams as { page?: number; pageSize?: number } | undefined;
    }

    const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";

    if (campaignId != null) {
      return await get<{ items: any[]; totalPages: number }>(
        `${API_ENDPOINTS.RESUME.COMPANY_GET(campaignId, jobId)}${q}`
      );
    }

    // Fallback to legacy route
    return await get<{ items: any[]; totalPages: number }>(`/jobs/${jobId}/resumes${q}`);
  },

  // Get resume detail by id
  // Supports: getResumeDetail(jobId, resumeId) or getResumeDetail(campaignId, jobId, resumeId)
  getResumeDetail: async (
    idOrCampaignId: number,
    maybeJobIdOrResumeId: number,
    maybeResumeId?: number
  ): Promise<ApiResponse<any>> => {
    if (typeof maybeResumeId === "number") {
      const campaignId = idOrCampaignId;
      const jobId = maybeJobIdOrResumeId;
      const resumeId = maybeResumeId;
      return await get<any>(API_ENDPOINTS.RESUME.COMPANY_GET_BY_ID(campaignId, jobId, resumeId));
    }

    const jobId = idOrCampaignId;
    const resumeId = maybeJobIdOrResumeId;
    return await get<any>(`/jobs/${jobId}/resumes/${resumeId}`);
  },

  // Get public list of companies (for joining)
  getPublicCompanies: async (): Promise<ApiResponse<CompanyData[]>> => {
    return await get<CompanyData[]>(API_ENDPOINTS.COMPANY.PUBLIC_GET);
  },

  getCompanies: async (): Promise<ApiResponse<CompanyData[]>> => {
    return await get<CompanyData[]>(API_ENDPOINTS.COMPANY.SYSTEM_GET);
  },

  // Get paginated companies (for admin listing)
  // ⛳️ Thay thế nguyên hàm getAll hiện tại bằng đoạn này
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<
    ApiResponse<{
      companies: CompanyData[];
      totalPages: number;
      currentPage: number;
      pageSize: number;
    }>
  > => {
    const q = params
      ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}${
          params.search ? `&search=${encodeURIComponent(params.search)}` : ""
        }`
      : "";
    return await get<{
      companies: CompanyData[];
      totalPages: number;
      currentPage: number;
      pageSize: number;
    }>(`${API_ENDPOINTS.COMPANY.SYSTEM_GET}${q}`);
  },

  getJobs: async (
    companyId: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<{ items: any[]; totalPages: number }>> => {
    const q = params
      ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}`
      : "";
    return await get<{ items: any[]; totalPages: number }>(
      `${API_ENDPOINTS.JOB.SYSTEM_GET(companyId)}${q}`
    );
  },

  // Join a company by ID
  joinCompany: async (companyId: number): Promise<ApiResponse<null>> => {
    return await post<null, null>(
      API_ENDPOINTS.COMPANY_USER.COMPANY_SEND_JOIN_REQUEST(companyId),
      null as any
    );
  },

  // Get pending join requests for current company
  getJoinRequests: async (): Promise<ApiResponse<any[]>> => {
    return await get<any[]>(
      API_ENDPOINTS.COMPANY_USER.COMPANY_GET_PENDING_JOIN_REQUESTS
    );
  },

  // Update join request status for a user (approve/reject)
  updateJoinRequestStatus: async (
    comUserId: number,
    joinStatus: string
  ): Promise<ApiResponse<null>> => {
    return await put<null, { joinStatus: string }>(
      API_ENDPOINTS.COMPANY_USER.COMPANY_UPDATE_JOIN_REQUEST_STATUS(comUserId),
      { joinStatus }
    );
  },

  // Delete a member from company (HR_Manager)
  deleteMember: async (comUserId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(
      API_ENDPOINTS.COMPANY_USER.COMPANY_DELETE_MEMBER(comUserId)
    );
  },

  // Update current company profile (supports FormData for file upload)
  updateProfile: async (formData: FormData): Promise<ApiResponse<any>> => {
    return await patchForm<any>(
      API_ENDPOINTS.COMPANY.COMPANY_UPDATE_PROFILE,
      formData
    );
  },

  deleteCompany: async (companyId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.COMPANY.SYSTEM_DELETE(companyId));
  },
  updateStatus: async (
    companyId: number,
    payload: {
      status: "Approved" | "Rejected" | "Pending" | "Suspended";
      rejectionReason?: string | null;
    }
  ): Promise<ApiResponse<null>> => {
    return await put<null, typeof payload>(
      API_ENDPOINTS.COMPANY.SYSTEM_STATUS(companyId),
      payload
    );
  },

  // 🔹 System Admin: lấy chi tiết company qua /system/companies/{id}
  getSystemCompanyById: async (companyId: number) => {
    return await get<CompanyData>(
      API_ENDPOINTS.COMPANY.SYSTEM_GET_BY_ID(companyId)
    );
  },
};
