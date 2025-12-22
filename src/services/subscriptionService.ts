// src/services/subscriptionService.ts
import api from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type {
  SubscriptionPlan,
  SubscriptionListData,
} from "../types/subscription.types";

export interface UpsertSubscriptionPlanRequest {
  name: string;
  description?: string | null;
  price: number;
  duration: string;
  resumeLimit: number;
  hoursLimit: number;

  compareLimit: number;
  compareHoursLimit: number;

  stripePriceId: string;
}

// helper: đảm bảo data không null/undefined khi FE cần dùng object
function assertData<T>(
  res: ApiResponse<T | null | undefined>,
  action: string
): T {
  const data = res.data;
  if (data === null || data === undefined) {
    throw new Error(`${action} succeeded but response data is empty.`);
  }
  return data;
}

export const subscriptionService = {
  // ================== SYSTEM ADMIN ==================
  async getAll(): Promise<SubscriptionPlan[]> {
    const res = await api.get<ApiResponse<SubscriptionListData>>(
      API_ENDPOINTS.SUBSCRIPTION.PUBLIC_GET
    );
    const subscriptions = res.data?.data?.subscriptions;
    return Array.isArray(subscriptions) ? subscriptions : [];
  },

  // ================== PUBLIC (company xem để chọn) ==================
  async getPublic(): Promise<SubscriptionPlan[]> {
    const res = await api.get<ApiResponse<SubscriptionListData>>(
      API_ENDPOINTS.SUBSCRIPTION.PUBLIC_GET
    );
    const list = res.data?.data?.subscriptions;
    return Array.isArray(list) ? list : [];
  },

  async getById(subscriptionId: number): Promise<SubscriptionPlan> {
    const res = await api.get<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.PUBLIC_GET_BY_ID(subscriptionId)
    );
    // giữ nguyên logic: API này trả object
    return assertData(res.data, "Get subscription by id");
  },

  // ================== SYSTEM CRUD PLAN ==================
  async create(payload: UpsertSubscriptionPlanRequest): Promise<null> {
    const res = await api.post<ApiResponse<null>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_CREATE,
      payload
    );
    return res.data.data ?? null;
  },

  async update(
    id: number,
    payload: UpsertSubscriptionPlanRequest
  ): Promise<null> {
    const res = await api.patch<ApiResponse<null>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_UPDATE(id),
      payload
    );
    return res.data.data ?? null;
  },

  async delete(id: number) {
    const res = await api.delete<ApiResponse<null>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_DELETE(id)
    );
    return res.data.data;
  },
};
