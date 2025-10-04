import { z } from "zod";

// Email validation schema
const emailSchema = z
	.email("Invalid email format.")
	.min(5, "Email must be at least 5 characters.")
	.max(255, "Email cannot exceed 255 characters.");

// Password validation schema
const passwordSchema = z
	.string()
	.min(1, "Password is required.")
	.min(8, "Password must be at least 8 characters.")
	.max(100, "Password cannot exceed 100 characters.")
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
		"Password must include one uppercase, one lowercase, one number, and one special character."
	);

// Full name validation schema
const fullNameSchema = z
	.string()
	.min(1, "Full name is required.")
	.min(2, "Full name must be at least 2 characters.")
	.max(100, "Full name cannot exceed 100 characters.")
	.trim();

// Login validation schema
export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

// Register validation schema
export const registerSchema = z
	.object({
		email: emailSchema,
		fullName: fullNameSchema,
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your password."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

// Reset password validation schema
export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, "Invalid or missing reset token."),
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your password."),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

// Type exports
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
