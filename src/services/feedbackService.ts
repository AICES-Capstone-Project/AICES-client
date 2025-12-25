import { get, post } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export interface SubmitFeedbackRequest {
  rating?: number;
  comment: string;
}

export interface FeedbackItem {
  id: number;
  rating?: number;
  comment?: string;
  userId?: number;
  createdAt?: string;
}

export const feedbackService = {
  // Get current user's feedbacks — supports server-side paging via params
  getMyFeedbacks: (config?: { params?: { page?: number; pageSize?: number } }) =>
    get<any>(API_ENDPOINTS.FEEDBACK.ME, config),

  // Submit a feedback
  submitFeedback: (
    body: SubmitFeedbackRequest
  ): Promise<ApiResponse<unknown>> =>
    post<unknown, SubmitFeedbackRequest>(API_ENDPOINTS.FEEDBACK.CREATE, body),
};

export default feedbackService;
