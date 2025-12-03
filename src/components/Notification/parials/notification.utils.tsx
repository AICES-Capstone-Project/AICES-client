import React from "react";
import {
  InfoCircleFilled, SafetyCertificateFilled, FileTextFilled, IdcardFilled,
  DollarCircleFilled, CheckCircleFilled, CrownFilled, TeamOutlined,
  MailFilled, BellFilled
} from "@ant-design/icons";

// Helper: format time like Facebook
export const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút`;
  if (diffHour < 24) return `${diffHour} giờ`;
  if (diffDay < 7) return `${diffDay} ngày`;
  if (diffWeek < 4) return `${diffWeek} tuần`;
  return date.toLocaleDateString("vi-VN");
};

export const getNotificationIcon = (type: string) => {
  const typeMap: Record<string, { icon: React.ReactNode; color: string }> = {
    System: { icon: <InfoCircleFilled style={{ color: "white" }} />, color: "#8BBB11" },
    CompanyApproved: { icon: <SafetyCertificateFilled style={{ color: "white" }} />, color: "#4aae17ff" },
    Job: { icon: <FileTextFilled style={{ color: "white" }} />, color: "#F35369" },
    JobCreated: { icon: <FileTextFilled style={{ color: "white" }} />, color: "#F35369" },
    CandidateApplied: { icon: <IdcardFilled style={{ color: "white" }} />, color: "#9C27B0" },
    Resume: { icon: <IdcardFilled style={{ color: "white" }} />, color: "#85A5FF" },
    Payment: { icon: <DollarCircleFilled style={{ color: "white" }} />, color: "#F7B928" },
    PaymentSuccess: { icon: <CheckCircleFilled style={{ color: "white" }} />, color: "#31A24C" },
    Subscription: { icon: <CrownFilled style={{ color: "white" }} />, color: "#F59E0B" },
    CompanySubscriptionPurchased: { icon: <CrownFilled style={{ color: "white" }} />, color: "#F59E0B" },
    UserRegistered: { icon: <TeamOutlined style={{ color: "white" }} />, color: "#00baaeff" },
    Invitation: { icon: <MailFilled style={{ color: "white" }} />, color: "#6C5CE7" },
  };

  return typeMap[type] || {
    icon: <BellFilled style={{ color: "white" }} />,
    color: "#1877F2"
  };
};