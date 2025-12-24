import api from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { FeedbackDetail, FeedbackListData } from "../types/feedback.types";

export interface FeedbackListParams {
  page?: number;
  pageSize?: number;
}

export const feedbackSystemService = {
  getFeedbacks(params?: FeedbackListParams) {
    return api.get<ApiResponse<FeedbackListData>>(
      API_ENDPOINTS.FEEDBACK.SYSTEM_GET_ALL,
      { params }
    );
  },

  getFeedbackById(feedbackId: number) {
    return api.get<ApiResponse<FeedbackDetail>>(
      API_ENDPOINTS.FEEDBACK.SYSTEM_GET_BY_ID(feedbackId)
    );
  },
  deleteFeedback(feedbackId: number) {
    return api.delete<ApiResponse<null>>(
      API_ENDPOINTS.FEEDBACK.SYSTEM_DELETE(feedbackId)
    );
  },
};
