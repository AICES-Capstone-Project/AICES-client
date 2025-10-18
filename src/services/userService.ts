import { get, post, put, remove } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export interface AdminUser {
  userId: number;
  email: string;
  fullName: string | null;
  roleName: string;
  isActive: boolean;
}

export interface AdminUserListResponse {
  items: AdminUser[];
  total: number;
}

export interface CreateUserRequest {
  email: string;
  fullName?: string;
  password: string;
  roleName: string;
}

export interface UpdateUserRequest {
  fullName?: string | null;
  roleName?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

export const userService = {
  list: async (
    params: { page?: number; pageSize?: number; keyword?: string } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.pageSize) query.append("pageSize", String(params.pageSize));
    if (params.keyword) query.append("keyword", params.keyword);
    const url = `${API_ENDPOINTS.ADMIN.USERS.LIST}?${query.toString()}`;
    return await get<AdminUserListResponse>(url);
  },

  create: async (data: CreateUserRequest) => {
    return await post<ApiResponse<null>>(
      API_ENDPOINTS.ADMIN.USERS.CREATE,
      data
    );
  },

  update: async (id: number, data: UpdateUserRequest) => {
    return await put<ApiResponse<null>>(
      API_ENDPOINTS.ADMIN.USERS.UPDATE(id),
      data
    );
  },

  remove: async (id: number) => {
    return await remove<ApiResponse<null>>(
      API_ENDPOINTS.ADMIN.USERS.DELETE(id)
    );
  },
};
