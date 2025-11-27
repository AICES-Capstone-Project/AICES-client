// src/services/subscriptionService.ts
import api from "./api";
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

// Base URL cho từng nhóm
const PUBLIC_BASE = API_ENDPOINTS.SUBSCRIPTION.PUBLIC_GET; // /public/subscriptions
const SYSTEM_BASE = API_ENDPOINTS.SUBSCRIPTION.SYSTEM_GET; // /system/subscriptions

export const subscriptionService = {
  // ============================================================
  // 🟦 SYSTEM (System Admin)
  // ============================================================

  async getAll(): Promise<SubscriptionPlan[]> {
    const res = await api.get<ApiResponse<SubscriptionListData>>(SYSTEM_BASE);
    const list = res.data?.data?.subscriptions;
    return Array.isArray(list) ? list : [];
  },

  async getByIdSystem(subscriptionId: number): Promise<SubscriptionPlan> {
    const res = await api.get<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.SYSTEM_GET_BY_ID(subscriptionId)
    );
    return res.data.data;
  },

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

  // ============================================================
  // 🟩 PUBLIC (Company xem danh sách gói)
  // ============================================================

  async getPublic(): Promise<SubscriptionPlan[]> {
    const res = await api.get<ApiResponse<SubscriptionListData>>(PUBLIC_BASE);
    const list = res.data?.data?.subscriptions;
    return Array.isArray(list) ? list.filter((x) => x.isActive) : [];
  },

  async getById(subscriptionId: number): Promise<SubscriptionPlan> {
    const res = await api.get<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.PUBLIC_GET_BY_ID(subscriptionId)
    );
    return res.data.data;
  },

  // ============================================================
  // 🟨 COMPANY (Current subscription, Checkout, Cancel)
  // ============================================================

  async createCheckoutSession(subscriptionId: number) {
    return await api.post(API_ENDPOINTS.PAYMENT.COMPANY_CHECKOUT, {
      subscriptionId,
    });
  },

  async getCurrentSubscription() {
    const res = await api.get<ApiResponse<CurrentSubscription>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.COMPANY_CURRENT
    );
    return res.data.data;
  },

  async cancelSubscription() {
    const res = await api.post<ApiResponse<null>>(
      API_ENDPOINTS.COMPANY_SUBSCRIPTION.COMPANY_CANCEL,
      {}
    );
    return res.data.data;
  },
};
