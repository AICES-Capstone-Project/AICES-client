import { get, post } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type {
	SetupIntentRequest,
	SetupIntentResponse,
	PaymentListItem,
	PaymentDetail,
} from "../types/payment.types";

export const paymentService = {
	async createSetupIntent(
		subscriptionId: number
	): Promise<ApiResponse<SetupIntentResponse>> {
		return await post<SetupIntentResponse, SetupIntentRequest>(
			API_ENDPOINTS.PAYMENT.CREATE_SETUP_INTENT,
			{ subscriptionId }
		);
	},

	async createCheckoutSession(
		subscriptionId: number
	): Promise<ApiResponse<{ url: string }>> {
		return await post<{ url: string }, { subscriptionId: number }>(
			API_ENDPOINTS.PAYMENT.COMPANY_CHECKOUT,
			{ subscriptionId }
		);
	},

	async getSessionDetails(sessionId: string): Promise<ApiResponse<any>> {
		return await get<any>(API_ENDPOINTS.PAYMENT.COMPANY_GET_SESSION(sessionId));
	},

	async getPaymentHistory(): Promise<ApiResponse<PaymentListItem[]>> {
		return await get<PaymentListItem[]>(API_ENDPOINTS.PAYMENT.COMPANY_GET);
	},

	async getPaymentById(paymentId: number): Promise<ApiResponse<PaymentDetail>> {
		return await get<PaymentDetail>(
			API_ENDPOINTS.PAYMENT.COMPANY_GET_BY_ID(paymentId)
		);
	},
};
