import { post, postForm, get, put, patchForm } from "./api";
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
	companyStatus: string;
	rejectionReason?: string | null;
	documents?: { documentType: string; fileUrl: string }[];
	isActive?: boolean;
	createdAt?: string;
}

export const companyService = {
	create: async (data: CreateCompanyRequest): Promise<ApiResponse<null>> => {
		return await post<null, CreateCompanyRequest>(API_ENDPOINTS.COMPANY.CREATE, data);
	},
	// Send multipart/form-data (for logo and document files)
	createForm: async (formData: FormData): Promise<ApiResponse<null>> => {
		return await postForm<null>(API_ENDPOINTS.COMPANY.CREATE, formData);
	},
	// Get current user's company
	getSelf: async (): Promise<ApiResponse<CompanyData>> => {
		return await get<CompanyData>(API_ENDPOINTS.COMPANY.GET);
	},
	// Get company members (paged)
	getMembers: async (companyId?: number, params?: { page?: number; pageSize?: number }) : Promise<ApiResponse<any>> => {
		const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";
		if (companyId) {
			return await get<any>(`${API_ENDPOINTS.COMPANY.GET_MEMBERS(companyId)}${q}`);
		}
		// fallback to current user's company members endpoint
		return await get<any>(`/companies/self/members${q}`);
	},

	getById: async (companyId: number) => {
		return await get<CompanyData>(API_ENDPOINTS.COMPANY.GET_BY_ID(companyId));
	},

	// Get job detail for a company
	getJobDetail: async (companyId: number, jobId: number) => {
		return await get<any>(`${API_ENDPOINTS.COMPANY.GET_JOBS(companyId)}/${jobId}`);
	},

	// Get resumes for a job
	getResumes: async (companyId: number, jobId: number, params?: { page?: number; pageSize?: number }) : Promise<ApiResponse<{ items: any[]; totalPages: number }>> => {
		const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";
		return await get<{ items: any[]; totalPages: number }>(`${API_ENDPOINTS.COMPANY.GET_JOBS(companyId)}/${jobId}/resumes${q}`);
	},

	getResumeDetail: async (companyId: number, jobId: number, resumeId: number) : Promise<ApiResponse<any>> => {
		return await get<any>(`${API_ENDPOINTS.COMPANY.GET_JOBS(companyId)}/${jobId}/resumes/${resumeId}`);
	},

	// Get public list of companies (for joining)
	getPublicCompanies: async (): Promise<ApiResponse<CompanyData[]>> => {
		return await get<CompanyData[]>(API_ENDPOINTS.COMPANY.PUBLIC);
	},

	getCompanies: async (): Promise<ApiResponse<CompanyData[]>> => {
		return await get<CompanyData[]>(API_ENDPOINTS.COMPANY.LIST);
	},

	// Get paginated companies (for admin listing)
	getAll: async (params?: { page?: number; pageSize?: number; search?: string }) : Promise<ApiResponse<{ items: CompanyData[]; totalPages: number }>> => {
		const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}${params.search ? `&search=${encodeURIComponent(params.search)}` : ''}` : '';
		return await get<{ items: CompanyData[]; totalPages: number }>(`${API_ENDPOINTS.COMPANY.LIST}${q}`);
	},

	getJobs: async (companyId: number, params?: { page?: number; pageSize?: number }) : Promise<ApiResponse<{ items: any[]; totalPages: number }>> => {
		const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";
		return await get<{ items: any[]; totalPages: number }>(`${API_ENDPOINTS.COMPANY.GET_JOBS(companyId)}${q}`);
	},

	// Join a company by ID
	joinCompany: async (companyId: number): Promise<ApiResponse<null>> => {
		return await post<null, null>(API_ENDPOINTS.COMPANY.JOIN(companyId), null as any);
	},

	// Get pending join requests for current company
	getJoinRequests: async (): Promise<ApiResponse<any[]>> => {
		return await get<any[]>(`/companies/self/join-requests`);
	},

	// Update join request status for a user (approve/reject)
	updateJoinRequestStatus: async (comUserId: number, joinStatus: string): Promise<ApiResponse<null>> => {
		return await put<null, { joinStatus: string }>(`/companies/self/join-requests/${comUserId}/status`, { joinStatus });
	},

	// Update current company profile (supports FormData for file upload)
	updateProfile: async (formData: FormData): Promise<ApiResponse<any>> => {
		return await patchForm<any>(`/companies/self/profile`, formData);
	},
};
