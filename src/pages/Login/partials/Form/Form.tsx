import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import "antd/dist/reset.css";

import FormError from "../../../../components/FormError/FormError";
import { authService } from "../../../../services/authService";
import { toastError, toastSuccess } from "../../../../components/UI/Toast";

const Form: React.FC = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [formError, setFormError] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");

	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		let hasError = false;
		setFormError("");
		setEmailError("");
		setPasswordError("");

		if (!email.trim()) {
			setEmailError("Please enter your email address.");
			hasError = true;
		}
		if (!password) {
			setPasswordError("Please enter your password.");
			hasError = true;
		}

		if (hasError) {
			setFormError("Please fix the errors below.");
			return;
		}

		console.log("Submitting:", { email, password });

		try {
			setLoading(true);
			console.log("Submitting:", { email, password });

			const res = await authService.login({ email, password });

			console.log(res);

			if (res.status === 200 && res.data) {
				toastSuccess("Login Success!", res.message);
				navigate("/");
			} else {
				console.log("Login failed:", res);
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
		<div className="flex flex-col gap-8">
			<div>
				<div className="flex flex-col gap-4">
					<div className="text-gray-900 font-inter text-[32px] font-medium">
						Log in
					</div>

					<div className="flex gap-1">
						<div className="text-gray-600 font-inter text-base font-normal">
							Don&apos;t have an account?
						</div>
						<div
							className="cursor-pointer text-green-600 font-inter text-base font-medium"
							onClick={() => navigate("/signup")}
						>
							Register
						</div>
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
					/>
					{passwordError && (
						<div className="text-red-500 text-sm">{passwordError}</div>
					)}
				</div>

				<div className="flex items-end gap-2">
					<p className="w-full flex justify-end">
						<span
							className="cursor-pointer text-green-600 font-inter text-sm font-medium"
							onClick={() => navigate("/forgot-password")}
						>
							Forget password
						</span>
					</p>
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
				Log in
			</Button>
		</div>
	);
};

export default Form;
