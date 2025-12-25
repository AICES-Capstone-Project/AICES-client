import React from "react";
import {
	InfoCircleFilled,
	SafetyCertificateFilled,
	FileTextFilled,
	IdcardFilled,
	DollarCircleFilled,
	CheckCircleFilled,
	CrownFilled,
	TeamOutlined,
	MailFilled,
	BellFilled,
} from "@ant-design/icons";
import { APP_ROUTES } from "../../../services/config";

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

	if (diffSec < 60) return "Just now";
	if (diffMin < 60) return `${diffMin} minutes`;
	if (diffHour < 24) return `${diffHour} hours`;
	if (diffDay < 7) return `${diffDay} days`;
	if (diffWeek < 4) return `${diffWeek} weeks`;
	return date.toLocaleDateString("en-US");
};

export const getNotificationIcon = (type: string) => {
	const typeMap: Record<string, { icon: React.ReactNode; color: string }> = {
		System: {
			icon: <InfoCircleFilled style={{ color: "white" }} />,
			color: "#8BBB11",
		},
		CompanyApproved: {
			icon: <SafetyCertificateFilled style={{ color: "white" }} />,
			color: "#4aae17ff",
		},
		Job: {
			icon: <FileTextFilled style={{ color: "white" }} />,
			color: "#F35369",
		},
		JobCreated: {
			icon: <FileTextFilled style={{ color: "white" }} />,
			color: "#F35369",
		},
		CandidateApplied: {
			icon: <IdcardFilled style={{ color: "white" }} />,
			color: "#9C27B0",
		},
		Resume: {
			icon: <IdcardFilled style={{ color: "white" }} />,
			color: "#85A5FF",
		},
		Payment: {
			icon: <DollarCircleFilled style={{ color: "white" }} />,
			color: "#F7B928",
		},
		PaymentSuccess: {
			icon: <CheckCircleFilled style={{ color: "white" }} />,
			color: "#31A24C",
		},
		Subscription: {
			icon: <CrownFilled style={{ color: "white" }} />,
			color: "#F59E0B",
		},
		CompanySubscriptionPurchased: {
			icon: <CrownFilled style={{ color: "white" }} />,
			color: "#F59E0B",
		},
		UserRegistered: {
			icon: <TeamOutlined style={{ color: "white" }} />,
			color: "#00baaeff",
		},
		Invitation: {
			icon: <MailFilled style={{ color: "white" }} />,
			color: "#6C5CE7",
		},
		SystemCompany: {
			icon: <TeamOutlined style={{ color: "white" }} />,
			color: "#00baaeff",
		},
		SystemSubscription: {
			icon: <CrownFilled style={{ color: "white" }} />,
			color: "#F59E0B",
		},
	};

	return (
		typeMap[type] || {
			icon: <BellFilled style={{ color: "white" }} />,
			color: "#1877F2",
		}
	);
};

/**
 * Maps notification type to the corresponding route
 * Based on backend NotificationTypeEnum:
 * - Job -> /company/jobs
 * - Campaign -> /company/campaign
 * - Member -> /company/staffs
 * - Company -> /company/my-apartments
 */
export const getNotificationRoute = (type: string): string | null => {
	const routeMap: Record<string, string> = {
		Job: APP_ROUTES.COMPANY_JOBS,
		Campaign: APP_ROUTES.COMPANY_CAMPAIN,
		Member: APP_ROUTES.COMPANY_STAFFS,
		Company: APP_ROUTES.COMPANY_MY_APARTMENTS,
		SystemCompany: APP_ROUTES.SYSTEM_COMPANY,
		SystemSubscription: APP_ROUTES.SYSTEM_SUBSCRIPTIONS_COMPANIES,
	};

	return routeMap[type] || null;
};
