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
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.LIST,
      { params }
    );

    // BE trả dạng { status, message, data }
    return res.data.data;
  },

  // GET /api/company-subscriptions/{id}
  async getById(id: number): Promise<CompanySubscription> {
    const res = await api.get<ApiResponse<CompanySubscription>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.GET_BY_ID(id)
    );
    return res.data.data;
  },

  // POST /api/company-subscriptions
  async create(payload: CreateCompanySubscriptionPayload) {
    const res = await api.post<ApiResponse<CompanySubscription>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.CREATE,
      payload
    );
    return res.data.data;
  },

  // DELETE /api/company-subscriptions/{id}
  async delete(id: number) {
    const res = await api.delete<ApiResponse<null>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.DELETE(id)
    );
    return res.data.data;
  },
};
