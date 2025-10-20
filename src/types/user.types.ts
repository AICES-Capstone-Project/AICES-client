// ---- User/Profile ----
export interface UserResponse {
	userId: number;
	email: string;
	fullName: string;
	phoneNumber?: string | null;
	address?: string | null;
	dateOfBirth?: string | null;
	avatarUrl?: string | null;
	roleName: string;
	isActive: boolean;
}
