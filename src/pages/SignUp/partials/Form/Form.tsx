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
		setFormError("");
		setFullNameError("");
		setEmailError("");
		setPasswordError("");
		setConfirmPasswordError("");

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
			return;
		}

		console.log("Signup success:", { fullName, email, password });

		try {
			setLoading(true);

			const res = await authService.signUp({ fullName, email, password });
			if (res.status === "Success") {
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
		<div className="flex flex-col gap-4 w-full max-w-md mx-auto">
			<div className="flex flex-col gap-2 items-center text-center mb-6">
				<h2 className="text-3xl font-bold text-gray-800 tracking-tight">
					Create a AICES Account
				</h2>
				<p className="text-sm text-gray-500">
					Welcome! Please enter your details.
				</p>
			</div>

			<div className="flex flex-col gap-5">
				{formError && <FormError type="error">{formError}</FormError>}

				<div className="flex flex-col gap-1">
					<Input
						placeholder="Full name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						status={fullNameError ? "error" : undefined}
						className="!w-full !h-12 !px-3 !py-2 !rounded-lg 
						!border-green-600 focus:!border-green-700 
						hover:!border-green-700 transition-all duration-300"
						onPressEnter={handleSubmit}
					/>
					{fullNameError && (
						<div className="text-red-500 text-xs !mb-1">{fullNameError}</div>
					)}
				</div>

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
						<div className="text-red-500 text-xs !mb-1">{emailError}</div>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<Input.Password
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						status={passwordError ? "error" : undefined}
						className="!w-full !h-12 !px-3 !py-2 !rounded-lg 
						!border-green-600 focus:!border-green-700 
						hover:!border-green-700 transition-all duration-300"
						onPressEnter={handleSubmit}
					/>
					{passwordError && (
						<div className="text-red-500 text-xs !mb-1">{passwordError}</div>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<Input.Password
						placeholder="Confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						status={confirmPasswordError ? "error" : undefined}
						className="!w-full !h-12 !px-3 !py-2 !rounded-lg 
						!border-green-600 focus:!border-green-700 
						hover:!border-green-700 transition-all duration-300"
						onPressEnter={handleSubmit}
					/>
					{confirmPasswordError && (
						<div className="text-red-500 text-xs !mb-1">
							{confirmPasswordError}
						</div>
					)}
				</div>
			</div>

			<Button
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
				Register
			</Button>

			<div className="flex justify-center items-center gap-1 text-sm">
				<span className="text-gray-600">Already have an account?</span>
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

export default SignupForm;
