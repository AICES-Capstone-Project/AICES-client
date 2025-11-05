// services/userService.ts
import { get, post, put, patch, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type {
  GetUsersResponse,
  GetUserByIdResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/user.types";
import type PagingParams from "../types/paging.types";
import { buildQuery } from "../utils/paging";

export const userService = {
  getAll: async (params?: PagingParams): Promise<ApiResponse<GetUsersResponse>> => {
    const url = `${API_ENDPOINTS.USER.GET_ALL}${buildQuery(params)}`;
    return await get<GetUsersResponse>(url);
  },

  getById: async (id: number): Promise<ApiResponse<GetUserByIdResponse>> => {
    return await get<GetUserByIdResponse>(API_ENDPOINTS.USER.GET_BY_ID(id));
  },

  create: async (data: CreateUserRequest): Promise<ApiResponse<null>> => {
    return await post<null, CreateUserRequest>(API_ENDPOINTS.USER.CREATE, data);
  },

  update: async (id: number, data: UpdateUserRequest): Promise<ApiResponse<null>> => {
    // Swagger là PATCH /api/user/{id}
    return await patch<null>(API_ENDPOINTS.USER.UPDATE(id), data);
  },

  // ✨ NEW: soft delete
  remove: async (id: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.USER.DELETE(id));
  },

  // ✨ NEW: restore
  restore: async (id: number): Promise<ApiResponse<null>> => {
    return await put<null>(API_ENDPOINTS.USER.RESTORE(id));
  },
};
