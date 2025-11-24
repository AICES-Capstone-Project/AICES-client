import { get, post } from "./api";
import type { ApiResponse } from "../types/api.types";

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

export const paymentService = {
  async createCheckoutSession(subscriptionId: number): Promise<ApiResponse<{ url: string }>> {
    return await post<{ url: string }, { subscriptionId: number }>("/payments/checkout", {
      subscriptionId,
    });
  },

  async getCurrentSubscription(): Promise<ApiResponse<CurrentSubscription>> {
    return await get<CurrentSubscription>("/payments/current-subscription");
  },

  async cancelSubscription(): Promise<ApiResponse<void>> {
    return await post<void, {}>("/payments/subscription/cancel", {});
  },
};
