// src/types/auth.types.ts

/** Vai trò hệ thống (mở rộng sau nếu cần) */
export type RoleName = "System_Admin" | "HR_Manager" | "HR_Recruiter" | "Candidate";

/** User trả về từ /api/auth/me */
export interface UserResponse {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;   // ISO string | null
  avatarUrl?: string | null;
  roleName: RoleName;
  isActive: boolean;
}

/** Auth: Login */
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: UserResponse;
}

/** Auth: Sign up */
export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Auth: Forgot / Reset Password */
export interface ResetPasswordResetRequest {
  /** email người dùng cần gửi mail reset */
  email: string;
}
export interface ResetPasswordRequest {
  /** token nhận qua email (hoặc query) */
  token: string;
  /** mật khẩu mới */
  newPassword: string;
  /** xác nhận mật khẩu mới (nếu BE yêu cầu) */
  confirmPassword?: string;
}

/** Profile: Update chính mình (PATCH /api/Profile/update) */
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null; // ISO
  avatarUrl?: string | null;   // nếu đã upload và có URL
}
