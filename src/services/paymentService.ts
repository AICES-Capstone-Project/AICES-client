import { get, post } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export const paymentService = {
  async createCheckoutSession(subscriptionId: number): Promise<ApiResponse<{ url: string }>> {
    return await post<{ url: string }, { subscriptionId: number }>(
      API_ENDPOINTS.PAYMENT.COMPANY_CHECKOUT,
      { subscriptionId }
    );
  },

  async getSessionDetails(sessionId: string) {
    return await get<any>(
      API_ENDPOINTS.PAYMENT.COMPANY_GET_SESSION(sessionId)
    );
  },

  async getPaymentHistory() {
    return await get<any>(API_ENDPOINTS.PAYMENT.COMPANY_GET);
  },

  async getPaymentById(paymentId: number) {
    return await get<any>(API_ENDPOINTS.PAYMENT.COMPANY_GET_BY_ID(paymentId));
  },
};
