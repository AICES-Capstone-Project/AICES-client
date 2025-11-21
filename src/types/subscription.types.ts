// src/types/subscription.types.ts

export interface ApiResponse<T> {
  status: string; // "success"
  message: string; // "All subscriptions retrieved successfully"
  data: T;
}

export interface SubscriptionListData {
  subscriptions: SubscriptionPlan[];
}
// ========== Subscription Plans ==========
export interface SubscriptionPlan {
  subscriptionId: number; 
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  limit: string;
  isActive: boolean;
  createdAt?: string;
}

// ================= Company Subscriptions =================

export interface CompanySubscription {
  comSubId: number;
  companyId: number;
  companyName: string;
  subscriptionId: number;
  subscriptionName: string;
  startDate: string;
  endDate: string;
  subscriptionStatus: string;
  createdAt: string;
}

// Kết quả trả về của GET /api/company-subscriptions
export interface CompanySubscriptionListData {
  companySubscriptions: CompanySubscription[];
  page: number;
  pageSize: number;
  totalItems: number;
}
