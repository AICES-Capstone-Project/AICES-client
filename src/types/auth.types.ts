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
	userId: number;
	email: string;
	fullName: string;
	roleName: string;
}

export interface LoginGoogleResponse {
	accessToken: string;
	userId: number;
	email: string;
	fullName: string;
	avatarUrl: string;
	roleName: string;
}
