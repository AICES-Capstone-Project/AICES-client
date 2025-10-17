import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/redux";
import { authService } from "../../../services/authService";
import { fetchUser } from "../../../stores/slices/authSlice";
import { getRoleBasedRoute } from "../../../routes/navigation";
import { toastError, toastSuccess } from "../../../components/UI/Toast";
import { APP_ROUTES } from "../../../services/config";
import { Spin } from "antd";

const GitHubCallback = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const hasProcessed = useRef(false);

	useEffect(() => {
		// Prevent double execution in StrictMode
		if (hasProcessed.current) return;
		hasProcessed.current = true;
		const handleGithubCallback = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");
			const error = urlParams.get("error");

			// Check if user denied access
			if (error) {
				console.log("❌ [GitHub] User denied access or error occurred:", error);
				toastError("GitHub login cancelled", "You denied access to GitHub");
				navigate(APP_ROUTES.LOGIN);
				return;
			}

			if (!code) {
				console.log("❌ [GitHub] No code in callback URL");
				toastError(
					"Login failed",
					"No authorization code received from GitHub"
				);
				navigate(APP_ROUTES.LOGIN);
				return;
			}

			console.log("🔙 [GitHub] Callback received with code:", code);
			console.log("🔄 [GitHub] Processing authentication...");

			try {
				// Add minimum 2 second loading time for better UX
				const [res] = await Promise.all([
					authService.githubLogin(code),
					new Promise((resolve) => setTimeout(resolve, 2000)),
				]);

				console.log("📦 [GitHub] Login response:", res);

				if (res.status === "Success" && res.data) {
					console.log("✅ [GitHub] Login successful!");
					toastSuccess("Login Success!", res.message);

					// Fetch user data after successful login
					const userResult = await dispatch(fetchUser());
					console.log("👤 [GitHub] User data fetched:", userResult);

					// Navigate based on user role
					if (fetchUser.fulfilled.match(userResult)) {
						const userRole = userResult.payload.roleName;
						const redirectRoute = getRoleBasedRoute(userRole);
						console.log(
							`🚀 [GitHub] Redirecting to ${redirectRoute} (role: ${userRole})`
						);
						navigate(redirectRoute, { replace: true });
					} else {
						console.log("⚠️ [GitHub] User fetch failed, redirecting to home");
						navigate(APP_ROUTES.HOME, { replace: true });
					}
				} else {
					console.log("❌ [GitHub] Login failed:", res);
					toastError(
						`Login failed ${res.status}`,
						res.message || "Failed to login with GitHub"
					);
					navigate(APP_ROUTES.LOGIN, { replace: true });
				}
			} catch (error) {
				console.error("💥 [GitHub] Login error:", error);
				toastError("Login failed", "An error occurred during GitHub login");
				navigate(APP_ROUTES.LOGIN, { replace: true });
			}
		};

		handleGithubCallback();
	}, [dispatch, navigate]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="text-center">
				<Spin size="large" />
				<p className="mt-4 text-lg text-gray-600">
					Authenticating with GitHub...
				</p>
				<p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
			</div>
		</div>
	);
};

export default GitHubCallback;
