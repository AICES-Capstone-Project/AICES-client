// src/services/subscriptionService.ts

import api from "./api";
import { API_ENDPOINTS } from "./config";
import type {
	ApiResponse,
	SubscriptionPlan,
	SubscriptionListData,
} from "../types/subscription.types";

export const subscriptionService = {
	// Lấy toàn bộ gói (bao gồm active + inactive)
	async getAll(): Promise<SubscriptionPlan[]> {
		const res = await api.get<ApiResponse<any>>(
			API_ENDPOINTS.SUBSCRIPTION.LIST
		);

		// BE trả dạng { status, message, data: { subscriptions: [...] } }
		const subscriptions = res.data?.data?.subscriptions;
		return Array.isArray(subscriptions) ? subscriptions : [];
	},

	// Public (nếu BE cũng trả cùng format thì xài giống trên)
	async getPublic(): Promise<SubscriptionPlan[]> {
		const res = await api.get<ApiResponse<SubscriptionListData>>(
			API_ENDPOINTS.SUBSCRIPTION.PUBLIC_LIST
		);
		const list = res.data?.data?.subscriptions;
		return Array.isArray(list) ? list.filter((x) => x.isActive) : [];
	},

	async getById(id: number): Promise<SubscriptionPlan> {
		const res = await api.get<ApiResponse<SubscriptionPlan>>(
			API_ENDPOINTS.SUBSCRIPTION.GET_BY_ID(id)
		);
		return res.data.data;
	},

	async create(payload: Partial<SubscriptionPlan>) {
		const res = await api.post<ApiResponse<SubscriptionPlan>>(
			API_ENDPOINTS.SUBSCRIPTION.CREATE,
			payload
		);
		return res.data.data;
	},

	async update(
		id: number,
		payload: {
			name: string;
			description?: string | null;
			price: number;
			durationDays: number;
			limit: string;
			isActive: boolean;
		}
	) {
		const res = await api.patch<ApiResponse<SubscriptionPlan>>(
			API_ENDPOINTS.SUBSCRIPTION.UPDATE(id),
			payload
		);
		return res.data.data;
	},

	async delete(id: number) {
		const res = await api.delete<ApiResponse<null>>(
			API_ENDPOINTS.SUBSCRIPTION.DELETE(id)
		);
		return res.data.data;
	},
};
