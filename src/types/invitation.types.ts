export type InvitationStatus =
	| "Pending"
	| "Accepted"
	| "Declined"
	| "Cancelled"
	| "Expired";

export interface InvitationResponse {
	invitationId: number;
	email: string;
	receiverName: string;
	senderName: string;
	companyName: string;
	status: InvitationStatus;
	createdAt: string;
}

export interface SendInvitationRequest {
	email: string;
}

export interface SendInvitationResponse {
	invitationId: number;
	email: string;
	companyId: number;
	companyName: string;
	senderId?: number;
	senderName: string;
	status: InvitationStatus;
	createdAt: string;
	expiresAt?: string;
	respondedAt?: string;
}

export interface GetInvitationsParams {
	status?: InvitationStatus;
	search?: string;
}
