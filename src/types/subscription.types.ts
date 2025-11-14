// src/types/subscription.types.ts

export interface SubscriptionPlan {
  id: number;                  // xuất hiện trong response
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;        // từ swagger
  limit: string;               // ví dụ: "Up to 50 jobs" hoặc "Unlimited"

  createdAt?: string;
}

export interface ApiResponse<T> {
  status: string;   // "success"
  message: string;  // "All subscriptions retrieved successfully"
  data: T;
}

// ========== Subscription Plans ==========
export interface SubscriptionPlan {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  limit: string;
  isActive: boolean;
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

