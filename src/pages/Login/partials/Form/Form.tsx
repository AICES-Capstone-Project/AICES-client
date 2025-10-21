import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import "antd/dist/reset.css";

import FormError from "../../../../components/FormError/FormError";
import { authService } from "../../../../services/authService";
import { toastError, toastSuccess } from "../../../../components/UI/Toast";
import SocialAuthForm from "../../../../components/Forms/SocialAuthForm";
import { useAppDispatch } from "../../../../hooks/redux";
import { fetchUser } from "../../../../stores/slices/authSlice";
import { getRoleBasedRoute } from "../../../../routes/navigation";
import { APP_ROUTES } from "../../../../services/config";
import { loginSchema } from "../../../../utils/validations/auth.validation";

const Form: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault();
		setFormError("");
		setEmailError("");
		setPasswordError("");

		const validationResult = loginSchema.safeParse({ email, password });
		if (!validationResult.success) {
			const errors = validationResult.error.issues;
			errors.forEach((error) => {
				if (error.path[0] === "email") setEmailError(error.message);
				else if (error.path[0] === "password") setPasswordError(error.message);
			});
			return;
		}

		try {
			setLoading(true);

			const res = await authService.login({ email, password });

			console.log(res);
			if (res.status === "Success" && res.data) {
				toastSuccess("Login Success!", res.message);
				const userResult = await dispatch(fetchUser());
				if (fetchUser.fulfilled.match(userResult)) {
					const userRole = userResult.payload.roleName;
					const redirectRoute = getRoleBasedRoute(userRole);
					navigate(redirectRoute);
				} else navigate(APP_ROUTES.HOME);
			} else {
				toastError(
					`Login failed ${res.status}`,
					res.message || "Failed to login"
				);
			}
		} catch (err) {
			toastError(
				"Login error",
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
					Log in
				</h2>
				<p className="text-sm text-gray-500">
					Welcome back! Please enter your details.
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
						<p className="text-red-500 text-xs !mb-1">{emailError}</p>
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
						<p className="text-red-500 text-xs !mb-1">{passwordError}</p>
					)}
				</div>
				<div className="flex items-center justify-between w-full text-sm">
					<label className="flex items-center gap-2">
						<input type="checkbox" className="w-4 h-4" />
						<span className="text-gray-600">Remember me</span>
					</label>
					<span
						className="cursor-pointer text-green-600 hover:underline"
						onClick={() => navigate(APP_ROUTES.FORGOT_PASSWORD)}
					>
						Forgot password?
					</span>
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
				Log in
			</Button>
			<div className="flex justify-center items-center gap-1 text-sm">
				<span className="text-gray-600">Don't have an account?</span>
				<span
					className="cursor-pointer text-green-600 font-medium hover:underline"
					onClick={() => navigate(APP_ROUTES.SIGN_UP)}
				>
					Register
				</span>
			</div>

			<SocialAuthForm />
		</div>
	);
};

export default Form;
