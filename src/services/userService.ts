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
  getAll: async (
    params?: PagingParams
  ): Promise<ApiResponse<GetUsersResponse>> => {
    const url = `${API_ENDPOINTS.USER.GET_ALL}${buildQuery(params)}`;
    return await get<GetUsersResponse>(url);
  },

  getById: async (userId: number): Promise<ApiResponse<GetUserByIdResponse>> => {
    return await get<GetUserByIdResponse>(API_ENDPOINTS.USER.GET_BY_ID(userId));
  },

  create: async (data: CreateUserRequest): Promise<ApiResponse<null>> => {
    return await post<null, CreateUserRequest>(API_ENDPOINTS.USER.CREATE, data);
  },

  update: async (
    userId: number,
    data: UpdateUserRequest
  ): Promise<ApiResponse<null>> => {
    return await patch<null>(API_ENDPOINTS.USER.UPDATE(userId), data);
  },

  updateStatus: async (
    userId: number,
    status: "Verified" | "Unverified" | "Locked"
  ): Promise<ApiResponse<null>> => {
    return await put<null>(API_ENDPOINTS.USER.UPDATE_STATUS(userId), { status });
  },

  remove: async (userId: number): Promise<ApiResponse<null>> => {
    return await remove<null>(API_ENDPOINTS.USER.DELETE(userId));
  },
};
