import { post, postForm, get } from "./api";
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
}

export const companyService = {
	create: async (data: CreateCompanyRequest): Promise<ApiResponse<null>> => {
		return await post<null, CreateCompanyRequest>(API_ENDPOINTS.COMPANY.CREATE,data);
	},
	// Send multipart/form-data (for logo and document files)
	createForm: async (formData: FormData): Promise<ApiResponse<null>> => {
		return await postForm<null>(API_ENDPOINTS.COMPANY.CREATE, formData);
	},
	// Get current user's company
	getSelf: async (): Promise<ApiResponse<CompanyData>> => {
		return await get<CompanyData>(API_ENDPOINTS.COMPANY.GET);
	},
};
