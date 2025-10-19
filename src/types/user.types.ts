// src/types/user.types.ts
import type { RoleName } from "./auth.types";

// ---- User/Profile ----
export interface UserResponse {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;  // ISO string
  avatarUrl?: string | null;
  roleName: RoleName;           // dùng RoleName đã định nghĩa ở auth.types
  isActive: boolean;
}

// ---- Profile update payload ----
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;  // ISO
  avatarUrl?: string | null;
}

// (Tuỳ chọn) alias tiện dùng cho FE
export type UserProfile = UserResponse;
