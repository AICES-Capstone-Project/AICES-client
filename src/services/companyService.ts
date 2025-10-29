import { post, postForm } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type {
    CreateCompanyRequest,
} from "../types/company.type";

export const companyService = {
    create: async (data: CreateCompanyRequest): Promise<ApiResponse<null>> => {
        return await post<null, CreateCompanyRequest>(API_ENDPOINTS.COMPANY.CREATE, data);
    },
    // Send multipart/form-data (for logo and document files)
    createForm: async (formData: FormData): Promise<ApiResponse<null>> => {
        return await postForm<null>(API_ENDPOINTS.COMPANY.CREATE, formData);
    },
};