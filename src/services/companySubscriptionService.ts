// src/services/companySubscriptionService.ts
import api from "./api";
import { API_ENDPOINTS } from "./config";
import type {
  ApiResponse,
  CompanySubscription,
  CompanySubscriptionListData,
} from "../types/subscription.types";

// payload để tạo mới (theo schema swagger)
export interface CreateCompanySubscriptionPayload {
  companyId: number;
  subscriptionId: number;
  startDate: string; // ISO string
  renew: boolean;
  status: string; // "Pending", "Active", ...
}

// query cho list
export type CompanySubscriptionQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const companySubscriptionService = {
  // GET /api/company-subscriptions?page=&pageSize=&search=
  async getList(
    params: CompanySubscriptionQuery = {}
  ): Promise<CompanySubscriptionListData> {
    const res = await api.get<ApiResponse<CompanySubscriptionListData>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_GET,
      { params }
    );

    // BE trả dạng { status, message, data }
    return res.data.data;
  },

  // GET /api/company-subscriptions/{id}
  async getById(companySubscriptionId: number): Promise<CompanySubscription> {
    const res = await api.get<ApiResponse<CompanySubscription>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_GET_BY_ID(companySubscriptionId)
    );
    return res.data.data;
  },

  // POST /api/company-subscriptions
  async create(payload: CreateCompanySubscriptionPayload) {
    const res = await api.post<ApiResponse<CompanySubscription>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_CREATE,
      payload
    );
    return res.data.data;
  },

  // DELETE /api/company-subscriptions/{id}
  async delete(companySubscriptionId: number) {
    const res = await api.delete<ApiResponse<null>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_DELETE(companySubscriptionId)
    );
    return res.data.data;
  },
};
