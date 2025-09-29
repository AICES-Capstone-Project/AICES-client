import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import { API_CONFIG, STORAGE_KEYS } from "./config";
import type { ApiResponse } from "../types/api.types";

// Tạo axios instance
const api = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: 10000,
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
			status: err.response?.status || 500,
			message: err.response?.data?.message || err.message || "Unknown error",
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
