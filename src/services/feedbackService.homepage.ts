import api from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { FeedbackListData } from "../types/feedback.types";

export const feedbackHomepageService = {
  getHomepageFeedbacks() {
    // ✅ hiện swagger chỉ có system => homepage dùng system cho đúng
    return api.get<ApiResponse<FeedbackListData>>(API_ENDPOINTS.FEEDBACK.SYSTEM_GET_ALL, {
      params: { page: 1, pageSize: 10 },
    });
  },
};
