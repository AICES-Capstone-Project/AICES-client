// ---- User/Profile ----
export interface LoginProvider {
	authProvider: string;
	providerId: string;
	isActive: boolean;
}

export interface User {
	userId: number;
	email: string;
	roleName: string;
	fullName: string;
	address: string;
	dateOfBirth: string | null;
	avatarUrl: string;
	phoneNumber: string;
	loginProviders: LoginProvider[];
	isActive: boolean;
	createdAt: string;
}

export interface GetUsersResponse {
	users: User[];
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

export interface GetUserByIdResponse {
	userId: number;
	email: string;
	roleName: string;
	fullName: string;
	address: string;
	dateOfBirth: string | null;
	avatarUrl: string;
	phoneNumber: string;
	loginProviders: LoginProvider[];
	isActive: boolean;
	createdAt: string;
}

export interface CreateUserRequest {
	email: string;
	password: string;
	roleId: number;
	fullName: string;
	isActive: boolean;
}

export interface UpdateUserRequest {
	email: string;
	password: string;
	roleId: number;
	fullName: string;
	isActive: boolean;
}

export type UserResponse = object;
