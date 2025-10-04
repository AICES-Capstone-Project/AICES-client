// src/components/Form/ForgotPasswordForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import "antd/dist/reset.css";

import FormError from "../../../../../components/FormError/FormError";
import { APP_ROUTES } from "../../../../../services/config";
import { authService } from "../../../../../services/authService";
import { toastError, toastSuccess } from "../../../../../components/UI/Toast";
import { forgotPasswordSchema } from "../../../../../utils/validations/auth.validation";

const ForgotPasswordForm: React.FC = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [formError, setFormError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		// Reset errors
		setFormError("");
		setEmailError("");

		// Validate using Zod
		const validationResult = forgotPasswordSchema.safeParse({ email });

		if (!validationResult.success) {
			const errors = validationResult.error.issues;
			errors.forEach((error) => {
				if (error.path[0] === "email") {
					setEmailError(error.message);
				}
			});
			setFormError("Please fix the errors below.");
			return;
		}

		try {
			setLoading(true);
			const res = await authService.requestPasswordReset({ email });

			if (res.status === 200) {
				toastSuccess(
					"Reset link sent!",
					"Please check your email for reset instructions."
				);
				setSubmitted(true);
			} else {
				toastError(
					`Request failed ${res.status}`,
					res.message || "Failed to send reset link"
				);
			}
		} catch (err) {
			toastError(
				"Request error",
				err instanceof Error ? err.message : "Something went wrong."
			);
		} finally {
			setLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<div className="text-gray-900 font-inter text-[32px] font-medium">
						Check your email
					</div>
					<div className="text-gray-600 font-inter text-base font-normal">
						If an account exists for{" "}
						<span className="font-medium">{email}</span>, we've sent a password
						reset link. Please follow the instructions in the email.
					</div>
				</div>

				<Button
					size="large"
					onClick={() => navigate(APP_ROUTES.LOGIN)}
					block
					className="!bg-green-600 !border-green-600 !text-white !font-semibold hover:!bg-green-700 hover:!border-green-700"
				>
					Back to Login
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			{/* Heading */}
			<div>
				<div className="flex flex-col gap-4">
					<div className="text-gray-900 font-inter text-[32px] font-medium">
						Forgot password
					</div>

					<div className="text-gray-600 font-inter text-base font-normal">
						Enter the email address associated with your account and we'll send
						you a reset link.
					</div>
				</div>
			</div>

			{/* Inputs */}
			<div className="flex flex-col gap-5">
				{formError && <FormError type="error">{formError}</FormError>}

				<div className="flex flex-col gap-1">
					<Input
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						status={emailError ? "error" : undefined}
						className="!flex !items-center !px-3 !py-2 !w-[536px] !gap-1"
						onPressEnter={handleSubmit}
					/>
					{emailError && (
						<div className="text-red-500 text-sm">{emailError}</div>
					)}
				</div>
			</div>

			<Button
				type="primary"
				size="large"
				onClick={handleSubmit}
				block
				loading={loading}
				disabled={loading}
				className="!bg-green-600 !border-green-600 !text-white !font-semibold hover:!bg-green-700 hover:!border-green-700"
			>
				Send reset link
			</Button>

			<div className="text-gray-600 font-inter text-sm text-center">
				Remember your password?{" "}
				<span
					className="cursor-pointer text-green-600 font-medium underline"
					onClick={() => navigate(APP_ROUTES.LOGIN)}
				>
					Log in
				</span>
			</div>
		</div>
	);
};

export default ForgotPasswordForm;
