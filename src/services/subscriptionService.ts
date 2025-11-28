// src/services/subscriptionService.ts
import api from "./api";
import { API_ENDPOINTS } from "./config";
import type {
  ApiResponse,
  SubscriptionPlan,
  SubscriptionListData,
} from "../types/subscription.types";

export const subscriptionService = {
  // ================== SYSTEM ADMIN ==================
  // Lấy toàn bộ gói (bao gồm active + inactive) cho System
  async getAll(): Promise<SubscriptionPlan[]> {
    // ✅ Dùng PUBLIC_GET để load list (BE đã confirm luôn)
    const res = await api.get<ApiResponse<SubscriptionListData>>(
      API_ENDPOINTS.SUBSCRIPTION.PUBLIC_GET
    );

    // BE trả dạng { status, message, data: { subscriptions: [...] } }
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
    return res.data.data;
  },

  // ================== SYSTEM CRUD PLAN ==================
  async create(payload: Partial<SubscriptionPlan>) {
    const res = await api.post<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_CREATE,
      payload
    );
    return res.data.data;
  },

  async update(
    id: number,
    payload: {
      name: string;
      description?: string | null;
      price: number;
      durationDays: number;
      limit: string;
      isActive: boolean;
    }
  ) {
    const res = await api.patch<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_UPDATE(id),
      payload
    );
    return res.data.data;
  },

  async delete(id: number) {
    const res = await api.delete<ApiResponse<null>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_DELETE(id)
    );
    return res.data.data;
  },
};
