import { get, post } from "./api";
import { STORAGE_KEYS, API_ENDPOINTS } from "./config";
import type {
	LoginRequest,
	LoginResponse,
	ResetPasswordRequest,
	ResetPasswordResetRequest,
	SignUpRequest,
	UserResponse,
} from "../types/auth.types";
import type { ApiResponse } from "./../types/api.types";

export const authService = {
	login: async (data: LoginRequest) => {
		const res = await post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
		console.log(res);

		if (res.status === 200 && res.data) {
			// Lưu token
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
		}
		return res;
	},

	googleLogin: async (idToken: string): Promise<ApiResponse<LoginResponse>> => {
		const res = await post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
			idToken,
		});
		if (res.status === 200 && res.data) {
			// Lưu token
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
		}

		return res;
	},

	signUp: async (data: SignUpRequest) => {
		return await post<ApiResponse<null>>(API_ENDPOINTS.AUTH.SIGN_UP, data);
	},

	verifyEmail: async (token: string) => {
		return await get<ApiResponse<null>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL(token));
	},

	getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
		return await get<UserResponse>(API_ENDPOINTS.AUTH.ME);
	},

	logout: async (): Promise<ApiResponse<null>> => {
		const res = await post<null>(API_ENDPOINTS.AUTH.LOGOUT);
		console.log("logout response:", res);

		// Clear access token từ localStorage
		localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

		return res;
	},

	requestPasswordReset: async (data: ResetPasswordResetRequest) => {
		return await post<ApiResponse<null>>(
			API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
			data
		);
	},

	resetPassword: async (data: ResetPasswordRequest) => {
		return await post<ApiResponse<null>>(
			API_ENDPOINTS.AUTH.RESET_PASSWORD,
			data
		);
	},
};
