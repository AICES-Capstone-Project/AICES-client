import api from "./api";

export const bannerService = {
	getAll: (params: any) => api.get("/public/banner-configs", { params }),

	getById: (id: number) => api.get(`/public/banner-configs/${id}`),

	create: (formData: FormData) =>
		api.post("/system/banner-configs", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),

	update: (id: number, formData: FormData) =>
		api.patch(`/system/banner-configs/${id}`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),

	delete: (id: number) => api.delete(`/system/banner-configs/${id}`),
};
