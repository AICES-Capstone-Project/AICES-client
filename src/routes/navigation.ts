import { APP_ROUTES } from "../services/config";

/**
 * Get the appropriate route based on user role
 * @param roleName - The user's role name
 * @returns The route path to navigate to
 */
export const getRoleBasedRoute = (roleName: string | null): string => {
	switch (roleName?.toLowerCase()) {
		case "system_admin":
			return APP_ROUTES.ADMIN;
		case "hr_recruiter":
			return APP_ROUTES.RECRUITER;
		default:
			return APP_ROUTES.HOME;
	}
};
