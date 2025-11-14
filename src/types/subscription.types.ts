// src/types/subscription.types.ts

export interface SubscriptionPlan {
  id: number;                  // xuất hiện trong response
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;        // từ swagger
  limit: string;               // ví dụ: "Up to 50 jobs" hoặc "Unlimited"

  // Optional - BE có thể thêm nhưng không bắt buộc trong UI Plans
  isActive?: boolean;
  createdAt?: string;
}

export interface ApiResponse<T> {
  status: string;   // "success"
  message: string;  // "All subscriptions retrieved successfully"
  data: T;
}
