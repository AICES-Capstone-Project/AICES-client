import api from "./api";
import type { Category, CategoryListResponse } from "../types/category.types";

export const categoryService = {
	// GET /categories?page=1&pageSize=10
	getAll(page = 1, pageSize = 10) {
		return api.get<{ data: CategoryListResponse }>(
			`/public/categories?page=${page}&pageSize=${pageSize}`
		);
	},

	// GET /categories/{id}
	getById(id: number) {
		return api.get<{ data: Category }>(`/public/categories/${id}`);
	},

	// POST /categories
	create(data: { name: string }) {
		return api.post(`/system/categories`, data);
	},

	// PATCH /categories/{id}
	update(id: number, data: { name: string }) {
		return api.patch(`/system/categories/${id}`, data);
	},

	// DELETE /categories/{id}
	delete(id: number) {
		return api.delete(`/system/categories/${id}`);
	},

	// GET /categories/{id}/specializations
	getSpecializations(id: number) {
		return api.get<{ data: any[] }>(`/public/categories/${id}/specializations`);
	},
};
