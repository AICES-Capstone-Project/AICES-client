import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import { API_CONFIG, API_ENDPOINTS, APP_ROUTES, STORAGE_KEYS } from "./config";
import type { ApiResponse } from "../types/api.types";

// Tạo axios instance
const api = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: 10000,
	withCredentials: true,
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
	const token =
		typeof window !== "undefined"
			? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
			: null;

	if (token && config.headers) {
		config.headers["Authorization"] = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};

		// Skip token refresh for login/signup endpoints
		const isAuthEndpoint =
			originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGIN) ||
			originalRequest.url?.includes(API_ENDPOINTS.AUTH.SIGN_UP) ||
			originalRequest.url?.includes(API_ENDPOINTS.AUTH.GOOGLE_LOGIN) ||
			originalRequest.url?.includes(API_ENDPOINTS.AUTH.GITHUB_LOGIN);

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isAuthEndpoint
		) {
			originalRequest._retry = true;

			try {
				// Call refresh (refresh token sent via cookie automatically)
				console.log("Attempting token refresh...");

				const response = await axios.post(
					`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
					{},
					{ withCredentials: true }
				);
				console.log("Refresh response:", response);

				if (
					response.data?.status === "Success" &&
					response.data?.data?.accessToken
				) {
					localStorage.setItem(
						STORAGE_KEYS.ACCESS_TOKEN,
						response.data.data.accessToken
					);

					if (originalRequest.headers) {
						originalRequest.headers[
							"Authorization"
						] = `Bearer ${response.data.data.accessToken}`;
					}
					return api.request(originalRequest);
				}
			} catch (refreshError) {
				localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
				window.location.href = APP_ROUTES.LOGIN;
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

// Hàm wrapper cho axios
export const requestApi = async <T>(
	url: string,
	options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
	try {
		const response = await api.request<ApiResponse<T>>({
			url,
			...options,
		});

		return response.data;
	} catch (error) {
		const err = error as AxiosError<ApiResponse<T>>;

		console.error("API call failed:", err);

		return {
			status: err.response?.status || "Error",
			message: err.response?.data?.message || err.message || "Unknown error",
			data: null,
		} as ApiResponse<T>;
	}
};

// Shortcut methods

// ---------------------
// JSON methods
// ---------------------
export const get = <T>(url: string, config?: AxiosRequestConfig) =>
	requestApi<T>(url, { method: "GET", ...config });

export const post = async <T, B = unknown>(
	url: string,
	body?: B,
	config?: AxiosRequestConfig
) =>
	requestApi<T>(url, {
		method: "POST",
		data: body,
		headers: { "Content-Type": "application/json", ...(config?.headers || {}) },
		...config,
	});

export const put = <T>(
	url: string,
	body?: Record<string, unknown>,
	config?: AxiosRequestConfig
) =>
	requestApi<T>(url, {
		method: "PUT",
		data: body,
		headers: { "Content-Type": "application/json", ...(config?.headers || {}) },
		...config,
	});

export const patch = <T>(
	url: string,
	body?: Record<string, unknown>,
	config?: AxiosRequestConfig
) =>
	requestApi<T>(url, {
		method: "PATCH",
		data: body,
		headers: { "Content-Type": "application/json", ...(config?.headers || {}) },
		...config,
	});

export const remove = <T>(url: string, config?: AxiosRequestConfig) =>
	requestApi<T>(url, { method: "DELETE", ...config });

// ---------------------
// FormData methods
// ---------------------
export const postForm = <T>(
	url: string,
	formData: FormData,
	config?: AxiosRequestConfig
) =>
	requestApi<T>(url, {
		method: "POST",
		data: formData,
		...config, // không set Content-Type, axios tự set
	});

export const putForm = <T>(
	url: string,
	formData: FormData,
	config?: AxiosRequestConfig
) =>
	requestApi<T>(url, {
		method: "PUT",
		data: formData,
		...config,
	});

export const patchForm = <T>(
	url: string,
	formData: FormData,
	config?: AxiosRequestConfig
) =>
	requestApi<T>(url, {
		method: "PATCH",
		data: formData,
		...config,
	});
export default api;
