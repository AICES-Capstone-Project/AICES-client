// src/types/subscription.types.ts

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
  // optional fields sometimes returned by public API
  resumeLimit?: number;
  hoursLimit?: number;
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
