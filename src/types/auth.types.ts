// ---- Requests ----
export interface LoginRequest {
	email: string;
	password: string;
}

export interface SignUpRequest {
	email: string;
	fullName: string;
	password: string;
}

// ---- Responses ----
export interface LoginResponse {
	accessToken: string;
}

export interface UserResponse {
	userId: number;
	email: string;
	fullName: string | null;
	roleName: string | null;
	avatarUrl: string | null;
	isActive: boolean;
}
