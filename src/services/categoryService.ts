import { get, post, patch, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { Category, CategoryListResponse } from "../types/category.types";
import type PagingParams from "../types/paging.types";
import { buildQuery } from "../utils/paging";

interface CategoryRequest {
  name: string;
}

export const categoryService = {
  getAll: async (
    params?: PagingParams
  ): Promise<ApiResponse<CategoryListResponse>> => {
    const url = `${API_ENDPOINTS.CATEGORY.PUBLIC_GET}${buildQuery(params)}`;
    return await get<CategoryListResponse>(url);
  },

  // ======== SYSTEM GET ALL =========
  getAllSystem: async (
    params?: PagingParams
  ): Promise<ApiResponse<CategoryListResponse>> => {
    const url = `${API_ENDPOINTS.CATEGORY.SYSTEM_GET}${buildQuery(params)}`;
    return await get<CategoryListResponse>(url); 
  },

  // ======== SYSTEM GET BY ID =========
  getByIdSystem: async (categoryId: number): Promise<ApiResponse<Category>> => {
    return await get<Category>( 
      API_ENDPOINTS.CATEGORY.SYSTEM_GET_BY_ID(categoryId)
    );
  },

  create: async (data: CategoryRequest): Promise<ApiResponse<null>> => {
    return await post<null, CategoryRequest>(
      API_ENDPOINTS.CATEGORY.SYSTEM_CREATE,
      data
    );
  },

  update: async (
    categoryId: number,
    data: CategoryRequest
  ): Promise<ApiResponse<null>> => {
    return await patch<null>(
      API_ENDPOINTS.CATEGORY.SYSTEM_UPDATE(categoryId),
      data
    );
  },

  remove: async (categoryId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.CATEGORY.SYSTEM_DELETE(categoryId));
  },

  getSpecializations: async (
    categoryId: number
  ): Promise<ApiResponse<any[]>> => {
    return await get<any[]>(
      API_ENDPOINTS.CATEGORY.PUBLIC_GET_SPECIALIZATIONS(categoryId)
    );
  },
};
