// src/services/subscriptionService.ts
import api from "./api";
import { get, post } from "./api";
import { API_ENDPOINTS } from "./config";
import type {
  ApiResponse,
  SubscriptionPlan,
  SubscriptionListData,
} from "../types/subscription.types";

interface CurrentSubscription {
  subscriptionName: string;
  description: string;
  price: number;
  durationDays: number;
  resumeLimit: number;
  hoursLimit: number;
  startDate: string;
  endDate: string;
  subscriptionStatus: string;
}

export const subscriptionService = {
  // ================== SYSTEM ADMIN ==================
  // Lấy toàn bộ gói (bao gồm active + inactive) cho System
  async getAll(): Promise<SubscriptionPlan[]> {
    const res = await api.get<ApiResponse<SubscriptionListData>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_GET // 🔥 ĐÃ ĐỔI TỪ PUBLIC_GET -> SYSTEM_GET
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
    return Array.isArray(list) ? list.filter((x) => x.isActive) : [];
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

  // ================== COMPANY (KHÔNG ĐỤNG – GIỮ NGUYÊN) ==================
  async createCheckoutSession(subscriptionId: number) {
    return await post<{ url: string }, { subscriptionId: number }>(
      API_ENDPOINTS.PAYMENT.COMPANY_CHECKOUT,
      { subscriptionId }
    );
  },

  async getCurrentSubscription() {
    return await get<CurrentSubscription>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.COMPANY_CURRENT
    );
  },

  async cancelSubscription() {
    return await post<void, {}>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.COMPANY_CANCEL,
      {}
    );
  },
};
