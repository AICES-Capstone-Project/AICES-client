export type NotificationInvitationStatus =
	| "Pending"
	| "Accepted"
	| "Declined"
	| "Cancelled"
	| "Expired";

export interface NotificationInvitation {
	invitationId: number;
	companyName: string;
	senderName: string;
	status: NotificationInvitationStatus;
}

export interface Notification {
	notifId: number;
	message: string;
	detail: string;
	type: string;
	isRead: boolean;
	createdAt: string;
	invitation: NotificationInvitation | null;
}
