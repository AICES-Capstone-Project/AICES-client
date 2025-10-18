// ---- Requests ----
export interface LoginRequest {
	email: string;
	password: string;
}

export interface googleLoginRequest {
	accessToken: string;
}

export interface githubLoginRequest {
	code: string;
}

export interface SignUpRequest {
	email: string;
	fullName: string;
	password: string;
}

export interface verifyEmailRequest {
	token: string;
}
export interface ResetPasswordResetRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

// ---- Responses ----
export interface LoginResponse {
	accessToken: string;
}

export interface UserResponse {
  userId: number;
  email: string;
  fullName: string;                 // không cần | null nếu BE luôn trả string
  phoneNumber?: string | null;      // thêm nếu BE có
  address?: string | null;
  dateOfBirth?: string | null;      // ISO string
  avatarUrl?: string | null;
  roleName: RoleName;               // ⬅️ quan trọng: dùng RoleName thay vì string|null
  isActive: boolean;
}
// ---- Profile update payload ----
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null; // ISO
  avatarUrl?: string | null;
}

// ---- Roles (FE constants) ----
export const ROLES = {
  Guest: "Guest",
  HR_Manager: "HR_Manager",
  HR_Recruiter: "HR_Recruiter",
  System_Staff: "System_Staff",
  System_Manager: "System_Manager",
  System_Admin: "System_Admin",
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

// (Optional) Nhãn hiển thị
export const ROLE_LABELS: Record<RoleName, string> = {
  Guest: "Khách",
  HR_Manager: "HR Manager",
  HR_Recruiter: "HR Recruiter",
  System_Staff: "System Staff",
  System_Manager: "System Manager",
  System_Admin: "System Admin",
};

