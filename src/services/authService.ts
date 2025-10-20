import { get, post } from "./api";
import { STORAGE_KEYS, API_ENDPOINTS } from "./config";
import type {
	LoginRequest,
	LoginResponse,
	ResetPasswordRequest,
	ResetPasswordResetRequest,
	SignUpRequest,
	ProfileResponse,
} from "../types/auth.types";
import type { ApiResponse } from "./../types/api.types";

export const authService = {
	login: async (data: LoginRequest) => {
		const res = await post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
		console.log(res);

		if (res.status === "Success" && res.data) {
			// Lưu token
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
		}
		return res;
	},

	googleLogin: async (
		accessToken: string
	): Promise<ApiResponse<LoginResponse>> => {
		const res = await post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
			accessToken,
		});
		if (res.status === "Success" && res.data) {
			// Lưu token
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
		}

		return res;
	},

	githubLogin: async (code: string): Promise<ApiResponse<LoginResponse>> => {
		console.log("🔐 [authService] Calling GitHub login API with code:", code);
		const res = await post<LoginResponse>(API_ENDPOINTS.AUTH.GITHUB_LOGIN, {
			code,
		});
		console.log("✅ [authService] GitHub login API response:", {
			status: res.status,
			hasData: !!res.data,
			message: res.message,
		});

		if (res.status === "Success" && res.data) {
			// Lưu token
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
			console.log("💾 [authService] Access token saved to localStorage");
		}

		return res;
	},

	signUp: async (data: SignUpRequest) => {
		return await post<ApiResponse<null>>(API_ENDPOINTS.AUTH.SIGN_UP, data);
	},

	verifyEmail: async (token: string) => {
		return await get<ApiResponse<null>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL(token));
	},

	getCurrentUser: async (): Promise<ApiResponse<ProfileResponse>> => {
		return await get<ProfileResponse>(API_ENDPOINTS.AUTH.ME);
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
