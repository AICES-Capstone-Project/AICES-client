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

// ---- Roles (dùng cho FE & router) ----
export const ROLES = {
  Guest: "Guest",
  HR_Manager: "HR_Manager",
  HR_Recruiter: "HR_Recruiter",
  System_Staff: "System_Staff",
  System_Manager: "System_Manager",
  System_Admin: "System_Admin",
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

// (optional) nhãn hiển thị
export const ROLE_LABELS: Record<RoleName, string> = {
  Guest: "Khách",
  HR_Manager: "HR Manager",
  HR_Recruiter: "HR Recruiter",
  System_Staff: "System Staff",
  System_Manager: "System Manager",
  System_Admin: "System Admin",
};
