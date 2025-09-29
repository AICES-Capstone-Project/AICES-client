import { get, post } from "./api";
import { STORAGE_KEYS } from "./config";
import type {
	LoginRequest,
	LoginResponse,
	LoginGoogleResponse,
	SignUpRequest,
} from "../types/auth.types";
import type { ApiResponse } from "./../types/api.types";

export const authService = {
	login: async (data: LoginRequest) => {
		const res = await post<ApiResponse<LoginResponse>>("/auth/login", data);
		console.log(res);

		if (res.status === 200 && res.data) {
			// Lưu token
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
			// localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.refreshToken);
		}
		return res;
	},

	googleLogin: async (
		idToken: string
	): Promise<ApiResponse<LoginGoogleResponse>> => {
		return await post<ApiResponse<LoginResponse>>("/auth/google", {
			idToken, // backend expects idToken now
		});
	},

	signUp: async (data: SignUpRequest) => {
		return await post<ApiResponse<null>>("/auth/register", data);
	},

	verifyEmail: async (token: string) => {
		return await get<ApiResponse<null>>(`/auth/verify-email?token=${token}`);
	},
};
