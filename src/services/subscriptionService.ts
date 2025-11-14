// src/services/subscriptionService.ts

import api from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse, SubscriptionPlan } from "../types/subscription.types";

export const subscriptionService = {
  // Lấy toàn bộ gói (bao gồm active + inactive)
  async getAll(): Promise<SubscriptionPlan[]> {
    const res = await api.get<ApiResponse<SubscriptionPlan[]>>(
      API_ENDPOINTS.SUBSCRIPTION.LIST
    );

    // BE trả dạng { status, message, data }
    return res.data.data;
  },

  async getPublic(): Promise<SubscriptionPlan[]> {
    const res = await api.get<ApiResponse<SubscriptionPlan[]>>(
      API_ENDPOINTS.SUBSCRIPTION.PUBLIC_LIST
    );
    return res.data.data;
  },

  async getById(id: number): Promise<SubscriptionPlan> {
    const res = await api.get<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.GET_BY_ID(id)
    );
    return res.data.data;
  },

  async create(payload: Partial<SubscriptionPlan>) {
    const res = await api.post<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.CREATE,
      payload
    );
    return res.data.data;
  },

  async update(id: number, payload: Partial<SubscriptionPlan>) {
    const res = await api.patch<ApiResponse<SubscriptionPlan>>(
      API_ENDPOINTS.SUBSCRIPTION.UPDATE(id),
      payload
    );
    return res.data.data;
  },

  async delete(id: number) {
    const res = await api.delete<ApiResponse<null>>(
      API_ENDPOINTS.SUBSCRIPTION.DELETE(id)
    );
    return res.data.data;
  },
};
