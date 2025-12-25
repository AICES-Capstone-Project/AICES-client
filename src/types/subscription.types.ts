// src/types/subscription.types.ts

// ========== Subscription Plans ==========

export type SubscriptionDuration =
  | "Unlimited"
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Yearly"
  // fallback để không break nếu BE có thêm value mới
  | (string & {});

export interface SubscriptionPlan {
  subscriptionId: number;
  name: string;
  description?: string | null;
  price: number; // cents
  duration: SubscriptionDuration;

  resumeLimit: number;
  hoursLimit: number;

  compareLimit: number;
  compareHoursLimit: number;

  stripePriceId?: string;
  createdAt?: string;
}

// ✅ Swagger list response includes paging fields (giữ bản này, xoá bản duplicate ở trên)
export interface SubscriptionListData {
  subscriptions: SubscriptionPlan[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
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

// UI types used by Pricing page and components
export type PlanType = {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  subscriptionId?: number;
  buttonType: "default" | "primary" | "link" | "text" | "dashed";
  link: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};
