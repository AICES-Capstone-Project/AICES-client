// src/types/companySubscription.types.ts

export interface CompanySubscription {
  comSubId: number;
  companyId: number;
  companyName: string;

  subscriptionId: number;
  subscriptionName: string;

  startDate: string;
  endDate: string;

  subscriptionStatus: string; // "Active", "Expired", "Cancelled" ...
  createdAt: string;
}

export interface CompanySubscriptionListData {
  companySubscriptions: CompanySubscription[];
  page: number;
  pageSize: number;
  totalItems: number;
}
