export interface FeedbackEntity {
  feedbackId: number;
  userName: string;
  rating: number;
  createdAt: string;
}

export interface FeedbackListData {
  feedbacks: FeedbackEntity[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export interface FeedbackDetail {
  comUserId: number;
  companyName: string;
  companyId: number;
  userEmail: string;
  userFullName: string;
  comment: string;
  feedbackId: number;
  userName: string;
  rating: number;
  createdAt: string;
}
