import { API_CONFIG, STORAGE_KEYS } from "./config";

interface ApiResponse<T> {
	status: number; // enum từ backend (200, 400, 401…)
	message?: string; // message từ backend
	data?: T; // data trả về (generic)
}

export const fetchApi = async <T>(
	url: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	const baseUrl = API_CONFIG.BASE_URL;
	const token =
		typeof window !== "undefined"
			? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
			: null;

	// Nếu body là FormData thì không set Content-Type
	const isFormData = options.body instanceof FormData;

	const headers: HeadersInit = {
		...(!isFormData && { "Content-Type": "application/json" }),
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	const config: RequestInit = {
		...options,
		headers,
	};

	try {
		const response = await fetch(`${baseUrl}${url}`, config);

		const result: ApiResponse<T> =
			response.status !== 204 ? await response.json() : { status: 204 };

		return result;
	} catch (error) {
		console.error("API call failed:", error);

		return {
			status: 500,
			message: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// Các shortcut methods
export const get = <T>(url: string) => fetchApi<T>(url, { method: "GET" });

export const post = <T>(
	url: string,
	body: FormData | Record<string, unknown>
) =>
	fetchApi<T>(url, {
		method: "POST",
		body: body instanceof FormData ? body : JSON.stringify(body),
	});

export const put = <T>(url: string, body: FormData | Record<string, unknown>) =>
	fetchApi<T>(url, {
		method: "PUT",
		body: body instanceof FormData ? body : JSON.stringify(body),
	});

export const patch = <T>(
	url: string,
	body: FormData | Record<string, unknown>
) =>
	fetchApi<T>(url, {
		method: "PATCH",
		body: body instanceof FormData ? body : JSON.stringify(body),
	});

export const remove = <T>(url: string) =>
	fetchApi<T>(url, { method: "DELETE" });
