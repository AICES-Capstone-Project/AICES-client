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
	fullName: string | null;
	phoneNumber?: string | null;
	address?: string | null;
	dateOfBirth?: string | null;
	avatarUrl?: string | null;
	roleName: string | null;
	isActive: boolean;
}
