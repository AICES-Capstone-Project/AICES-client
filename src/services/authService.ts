import { postJson } from "./api";
import { STORAGE_KEYS } from "./config";

interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

export const authService = {
	login: async (data: LoginRequest) => {
		const res = await postJson<LoginResponse>("/auth/login", data);

		if (res.status === 200 && res.data) {
			// Lưu token
			localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.accessToken);
			// localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.refreshToken);
		}

		return res;
	},
};
