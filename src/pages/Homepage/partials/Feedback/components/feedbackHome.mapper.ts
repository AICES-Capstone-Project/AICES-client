import type { FeedbackEntity } from "../../../../../types/feedback.types";

export type HomeFeedbackItem = {
  id: number;
  companyName: string;
  quote: string;
  avatarText: string;
  authorName: string;
  authorRole: string;
};

const FALLBACK_QUOTE =
  "AICES helps our team reduce manual screening and make evaluations more consistent.";

const initials = (fullName?: string) => {
  const n = (fullName ?? "").trim();
  if (!n) return "U";
  const parts = n.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
};

export function mapFeedbackToHomeItem(f: FeedbackEntity): HomeFeedbackItem {
  const authorName = f.userFullName?.trim() || f.userName?.trim() || "Anonymous";

  return {
    id: f.feedbackId,
    companyName: f.companyName,
    quote: f.comment?.trim() || FALLBACK_QUOTE,
    avatarText: initials(authorName),
    authorName,
    authorRole: "HR Specialist", // BE chưa có role → giữ default cho UI
  };
}
