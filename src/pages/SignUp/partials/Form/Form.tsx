import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import "antd/dist/reset.css";

import FormError from "../../../../components/FormError/FormError";
import { authService } from "../../../../services/authService";
import { toastError, toastSuccess } from "../../../../components/UI/Toast";
import { APP_ROUTES } from "../../../../services/config";
import { registerSchema } from "../../../../utils/validations/auth.validation";

const SignupForm: React.FC = () => {
	const navigate = useNavigate();

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [formError, setFormError] = useState("");
	const [fullNameError, setFullNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");

	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		// Reset errors
		setFormError("");
		setFullNameError("");
		setEmailError("");
		setPasswordError("");
		setConfirmPasswordError("");

		// Validate using Zod
		const validationResult = registerSchema.safeParse({
			fullName,
			email,
			password,
			confirmPassword,
		});

		if (!validationResult.success) {
			const errors = validationResult.error.issues;
			errors.forEach((error) => {
				if (error.path[0] === "fullName") {
					setFullNameError(error.message);
				} else if (error.path[0] === "email") {
					setEmailError(error.message);
				} else if (error.path[0] === "password") {
					setPasswordError(error.message);
				} else if (error.path[0] === "confirmPassword") {
					setConfirmPasswordError(error.message);
				}
			});
			setFormError("Please fix the errors below.");
			return;
		}

		console.log("Signup success:", { fullName, email, password });

		try {
			setLoading(true);

			// Add minimum 3 second loading time
			const [res] = await Promise.all([
				authService.signUp({ fullName, email, password }),
				new Promise((resolve) => setTimeout(resolve, 3000)),
			]);

			if (res.status === 200) {
				toastSuccess("Signup Success!", res.message);
				navigate(APP_ROUTES.LOGIN);
			} else {
				toastError(
					`Signup failed ${res.status}`,
					res.message || "Failed to signup"
				);
			}
		} catch (err) {
			toastError(
				"Signup error",
				err instanceof Error ? err.message : "Something went wrong."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			{/* Heading */}
			<div>
				<div className="flex flex-col gap-4">
					<div className="text-gray-900 font-inter text-[32px] font-medium">
						Register
					</div>

					<div className="flex gap-1">
						<div className="text-gray-600 font-inter text-base font-normal">
							Already have an account?
						</div>
						<div
							className="cursor-pointer text-green-600 font-inter text-base font-medium"
							onClick={() => navigate(APP_ROUTES.LOGIN)}
						>
							Log in
						</div>
					</div>
				</div>
			</div>

			{/* Inputs */}
			<div className="flex flex-col gap-5">
				{formError && <FormError type="error">{formError}</FormError>}

				<div className="flex flex-col gap-1">
					<Input
						placeholder="Full name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						status={fullNameError ? "error" : undefined}
						className="!flex !items-center !px-3 !py-2 !w-[536px] !gap-1"
						onPressEnter={handleSubmit}
					/>
					{fullNameError && (
						<div className="text-red-500 text-sm">{fullNameError}</div>
					)}
				</div>

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

				<div className="flex flex-col gap-1">
					<Input.Password
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						status={passwordError ? "error" : undefined}
						className="!flex !items-center !px-3 !py-2 !w-[536px] !gap-1"
						onPressEnter={handleSubmit}
					/>
					{passwordError && (
						<div className="text-red-500 text-sm">{passwordError}</div>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<Input.Password
						placeholder="Confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						status={confirmPasswordError ? "error" : undefined}
						className="!flex !items-center !px-3 !py-2 !w-[536px] !gap-1"
						onPressEnter={handleSubmit}
					/>
					{confirmPasswordError && (
						<div className="text-red-500 text-sm">{confirmPasswordError}</div>
					)}
				</div>
			</div>

			<Button
				size="large"
				onClick={handleSubmit}
				block
				loading={loading}
				disabled={loading}
				className="!bg-green-600 !border-green-600 !text-white !font-semibold hover:!bg-green-700 hover:!border-green-700"
			>
				Register
			</Button>
		</div>
	);
};

export default SignupForm;
