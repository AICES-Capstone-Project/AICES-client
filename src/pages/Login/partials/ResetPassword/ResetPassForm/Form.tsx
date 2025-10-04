import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Result } from "antd";
import "antd/dist/reset.css";
import FormError from "../../../../../components/FormError/FormError";
import { authService } from "../../../../../services/authService";
import { toastError, toastSuccess } from "../../../../../components/UI/Toast";
import { APP_ROUTES } from "../../../../../services/config";
import { resetPasswordSchema } from "../../../../../utils/validations/auth.validation";

const ResetPasswordForm: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const token = useMemo(
		() => new URLSearchParams(location.search).get("token") ?? "",
		[location.search]
	);

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formError, setFormError] = useState("");
	const [newPasswordError, setNewPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		// Reset errors
		setFormError("");
		setNewPasswordError("");
		setConfirmPasswordError("");

		// Validate using Zod
		const validationResult = resetPasswordSchema.safeParse({
			token,
			newPassword,
			confirmPassword,
		});

		if (!validationResult.success) {
			const errors = validationResult.error.issues; // Change from .errors to .issues
			errors.forEach((error) => {
				if (error.path[0] === "token") {
					setFormError(error.message);
				} else if (error.path[0] === "newPassword") {
					setNewPasswordError(error.message);
				} else if (error.path[0] === "confirmPassword") {
					setConfirmPasswordError(error.message);
				}
			});
			if (!formError) setFormError("Please fix the errors below.");
			return;
		}

		try {
			setLoading(true);

			const res = await authService.resetPassword({
				token,
				newPassword,
			});

			if (res.status === 200) {
				toastSuccess(
					"Password reset successful!",
					"You can now log in with your new password."
				);
				setDone(true);
				// Auto navigate to login after 2 seconds
				setTimeout(() => navigate(APP_ROUTES.LOGIN), 2000);
			} else {
				toastError(
					`Reset failed ${res.status}`,
					res.message || "Failed to reset password"
				);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Something went wrong. Please try again later.";
			setFormError(errorMessage);
			toastError("Reset password failed", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	if (done) {
		return (
			<div className="flex flex-col gap-8">
				<Result
					status="success"
					title="Password updated"
					subTitle="Your password has been reset successfully. You can now log in with your new password."
					extra={
						<Button
							size="large"
							onClick={() => navigate(APP_ROUTES.LOGIN)}
							className="!bg-green-600 !border-green-600 !text-white !font-semibold hover:!bg-green-700 hover:!border-green-700"
						>
							Go to log in
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4">
				<div className="text-gray-900 font-inter text-[32px] font-medium">
					Create new password
				</div>
				<div className="text-gray-600 font-inter text-base">
					Enter your new password below.
				</div>
			</div>

			{formError && <FormError type="error">{formError}</FormError>}

			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-1">
					<Input.Password
						placeholder="New password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						status={newPasswordError ? "error" : undefined}
						className="!px-3 !py-2 !w-[536px]"
						onPressEnter={handleSubmit}
					/>
					{newPasswordError && (
						<div className="text-red-500 text-sm">{newPasswordError}</div>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<Input.Password
						placeholder="Confirm new password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						status={confirmPasswordError ? "error" : undefined}
						className="!px-3 !py-2 !w-[536px]"
						onPressEnter={handleSubmit}
					/>
					{confirmPasswordError && (
						<div className="text-red-500 text-sm">{confirmPasswordError}</div>
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
				Reset password
			</Button>
		</div>
	);
};

export default ResetPasswordForm;
