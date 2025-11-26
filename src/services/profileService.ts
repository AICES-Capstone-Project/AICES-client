import { patchForm, post } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { UpdateProfileResponse } from "../types/profile.types";

export const profileService = {
	updateMultipart: async (
		formData: FormData
	): Promise<ApiResponse<UpdateProfileResponse>> => {
		return await patchForm<UpdateProfileResponse>(
			API_ENDPOINTS.PROFILE.UPDATE,
			formData
		);
	},

	changePassword: async (
		token: string,
		newPassword: string
	): Promise<ApiResponse<null>> => {
		return await post<null>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
			token,
			newPassword,
		});
	},
};
