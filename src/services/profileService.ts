import { patchForm, put } from "./api";
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
		oldPassword: string,
		newPassword: string
	): Promise<ApiResponse<null>> => {
		return await put<null, { oldPassword: string; newPassword: string }>(
			API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
			{ oldPassword, newPassword }
		);
	},
};
