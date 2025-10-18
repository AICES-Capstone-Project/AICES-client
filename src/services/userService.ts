// src/services/userService.ts
import { get, post, put /*, remove as delRequest */ } from "./api";
import { API_ENDPOINTS } from "./config";

export interface AdminUser {
  userId: number;
  email: string;
  fullName: string | null;
  roleName: string;
  isActive: boolean;
}

export const userService = {
  list: () => get<AdminUser[]>(API_ENDPOINTS.ADMIN.USERS.LIST),
  detail: (id: number | string) => get<AdminUser>(API_ENDPOINTS.ADMIN.USERS.DETAIL(id)),
  create: (payload: Partial<AdminUser>) =>
    post<AdminUser>(API_ENDPOINTS.ADMIN.USERS.CREATE, payload),
  update: (id: number | string, payload: Partial<AdminUser>) =>
    put<AdminUser>(API_ENDPOINTS.ADMIN.USERS.UPDATE(id), payload),
  // delete: (id: number | string) => delRequest<null>(API_ENDPOINTS.ADMIN.USERS.DELETE(id)),
};

export default userService;
