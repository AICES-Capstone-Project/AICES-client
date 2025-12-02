import { get, post, put, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type {
	SendInvitationResponse,
	SendInvitationRequest,
	GetInvitationsParams,
	InvitationResponse,
} from "../types/invitation.types";

export const invitationService = {
	// HR_Manager: Gửi lời mời qua email
	sendInvitation: (data: SendInvitationRequest) =>
		post<SendInvitationResponse>(API_ENDPOINTS.INVITATION.COMPANY_SEND, data),

	// HR_Manager: Lấy danh sách lời mời của công ty
	getCompanyInvitations: (params?: GetInvitationsParams) => {
		const queryParams = new URLSearchParams();
		if (params?.status) {
			queryParams.append("status", params.status);
		}
		if (params?.search) {
			queryParams.append("search", params.search);
		}
		const queryString = queryParams.toString();
		const url = queryString
			? `${API_ENDPOINTS.INVITATION.COMPANY_GET}?${queryString}`
			: API_ENDPOINTS.INVITATION.COMPANY_GET;
		return get<InvitationResponse[]>(url);
	},

	// HR_Manager: Hủy lời mời
	cancelInvitation: (invitationId: number) =>
		remove<void>(API_ENDPOINTS.INVITATION.COMPANY_CANCEL(invitationId)),

	// HR_Recruiter: Chấp nhận lời mời
	acceptInvitation: (invitationId: number) =>
		put<void>(API_ENDPOINTS.INVITATION.ACCEPT(invitationId)),

	// HR_Recruiter: Từ chối lời mời
	declineInvitation: (invitationId: number) =>
		put<void>(API_ENDPOINTS.INVITATION.DECLINE(invitationId)),
};

export default invitationService;

