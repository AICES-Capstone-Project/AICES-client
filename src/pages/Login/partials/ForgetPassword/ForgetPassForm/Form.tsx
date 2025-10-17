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
		setFormError("");
		setEmailError("");

		const validationResult = forgotPasswordSchema.safeParse({ email });

		if (!validationResult.success) {
			const errors = validationResult.error.issues;
			errors.forEach((error) => {
				if (error.path[0] === "email") {
					setEmailError(error.message);
				}
			});
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
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3 text-center items-center">
					<h2 className="text-3xl font-bold text-gray-800 tracking-tight">
						Check your email
					</h2>
					<p className="text-gray-600 text-base max-w-md">
						If an account exists for{" "}
						<span className="font-medium text-gray-900">{email}</span>, we’ve sent you a
						password reset link. Please check your inbox and follow the instructions.
					</p>
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
		<div className="flex flex-col gap-4 w-full max-w-md mx-auto">
			<div className="flex flex-col gap-2 items-center text-center mb-6">
				<h2 className="text-3xl font-bold text-gray-800 tracking-tight">
					Forgot password
				</h2>
				<p className="text-sm text-gray-500">
					Enter the email address associated with your account and we'll send
					you a reset link.
				</p>
			</div>

			<div className="flex flex-col gap-5">
				{formError && <FormError type="error">{formError}</FormError>}

				<div className="flex flex-col gap-1">
					<Input
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						status={emailError ? "error" : undefined}
						className="!w-full !h-12 !px-3 !py-2 !rounded-lg 
						!border-green-600 focus:!border-green-700 
						hover:!border-green-700 transition-all duration-300"
						onPressEnter={handleSubmit}
					/>
					{emailError && (
						<div className="text-red-500 text-sm !mb-1">{emailError}</div>
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
				className="!bg-gradient-to-r from-emerald-800 via-lime-700 to-lime-600
				!text-white !border-none rounded-xl font-semibold shadow-md
				hover:from-emerald-700 hover:via-lime-600 hover:to-lime-500
				transition-all duration-300"
			>
				Send reset link
			</Button>

			<div className="flex justify-center items-center gap-1 text-sm">
				<span className="text-gray-600">Remember your password?</span>
				<span
					className="cursor-pointer text-green-600 font-medium hover:underline"
					onClick={() => navigate(APP_ROUTES.LOGIN)}
				>
					Log in
				</span>
			</div>
		</div>
	);
};

export default ForgotPasswordForm;
