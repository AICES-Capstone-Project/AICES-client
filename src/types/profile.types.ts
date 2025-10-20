// ---- Profile Update Request ----
export interface UpdateProfileRequest {
	fullName?: string;
	address?: string;
	dateOfBirth?: string;
	phoneNumber?: string;
	avatarFile?: File;
}

// ---- Profile Update Response ----
export type UpdateProfileResponse = null;
