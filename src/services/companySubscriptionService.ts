// src/services/companySubscriptionService.ts
import api from "./api";
import { API_ENDPOINTS } from "./config";

import type { ApiResponse } from "../types/subscription.types";
import type {
  CompanySubscription,
  CompanySubscriptionListData,
} from "../types/companySubscription.types";

export interface CreateCompanySubscriptionPayload {
  companyId: number;
  subscriptionId: number;
  startDate: string; // ISO 8601
  renew: boolean;
  status: string; // Pending | Active | ...
}

export type CompanySubscriptionQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const companySubscriptionService = {
  // GET list: /system/company-subscriptions
  async getList(
    params: CompanySubscriptionQuery = {}
  ): Promise<CompanySubscriptionListData> {
    const res = await api.get<ApiResponse<CompanySubscriptionListData>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_GET,
      { params }
    );
    return res.data.data;
  },

  // GET by id: /system/company-subscriptions/{id}
  async getById(companySubscriptionId: number): Promise<CompanySubscription> {
    const res = await api.get<ApiResponse<CompanySubscription>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_GET_BY_ID(
        companySubscriptionId
      )
    );
    return res.data.data;
  },

  // CREATE
  async create(payload: CreateCompanySubscriptionPayload) {
    const res = await api.post<ApiResponse<CompanySubscription>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_CREATE,
      payload
    );
    return res.data.data;
  },

  // DELETE
  async delete(companySubscriptionId: number) {
    const res = await api.delete<ApiResponse<null>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.SYSTEM_DELETE(companySubscriptionId)
    );
    return res.data.data;
  },
};
