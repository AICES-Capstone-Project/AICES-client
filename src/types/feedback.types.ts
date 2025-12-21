export interface FeedbackEntity {
  feedbackId: number;

  // Company
  companyId: number;
  companyName: string;
  companyLogoUrl: string | null;

  // User
  comUserId: number;
  userName: string;
  userFullName: string;
  userEmail: string;
  userAvatarUrl: string | null;

  // Feedback
  comment: string | null;
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
  feedbackId: number;

  // Company
  companyId: number;
  companyName: string;
  companyLogoUrl: string | null;

  // User
  comUserId: number;
  userName: string;
  userFullName: string;
  userEmail: string;
  userAvatarUrl: string | null;

  // Feedback
  comment: string | null;
  rating: number;
  createdAt: string;
}
