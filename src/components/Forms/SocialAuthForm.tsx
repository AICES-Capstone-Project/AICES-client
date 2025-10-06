import GithubIcon from "../../assets/images/github.svg";
import GoogleIcon from "../../assets/images/google.svg";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/authService";
import { toastError, toastSuccess } from "../UI/Toast";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../services/config";
import { useAppDispatch } from "../../hooks/redux";
import { fetchUser } from "../../stores/slices/authSlice";
import { getRoleBasedRoute } from "../../routes/navigation";
import { useState } from "react";
import { Button, Image } from "antd";

const SocialAuthForm = () => {
	const buttonClass =
		"!font-medium min-h-12 w-full rounded-2 px-4 py-3.5 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:scale-[1.02] hover:shadow-lg !hover:shadow-gray-200/50 active:scale-[0.98] border !border-gray-200 !hover:border-gray-300";

	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [googleLoading, setGoogleLoading] = useState(false);
	const [githubLoading, setGithubLoading] = useState(false);

	// GitHub OAuth configuration
	const GITHUB_CLIENT_ID = import.meta.env.VITE_AUTH_GITHUB_ID || "null";
	const REDIRECT_URI = window.location.origin + "/auth/callback";

	const googleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			const googleAccessToken = tokenResponse.access_token;
			console.log("✅ [Google] Login success - Token:", googleAccessToken);

			if (!googleAccessToken) {
				toastError("Login failed", "No credential received from Google");
				return;
			}

			try {
				setGoogleLoading(true);
				console.log("🔄 [Google] Setting loading state...");

				const [res] = await Promise.all([
					authService.googleLogin(googleAccessToken),
					new Promise((resolve) => setTimeout(resolve, 3000)),
				]);

				console.log("📝 [Google] Server response:", res);

				if (res.status === 200 && res.data) {
					toastSuccess("Login Success!", res.message);
					const userResult = await dispatch(fetchUser());

					if (fetchUser.fulfilled.match(userResult)) {
						const userRole = userResult.payload.roleName;
						navigate(getRoleBasedRoute(userRole));
					} else {
						navigate(APP_ROUTES.HOME);
					}
				} else {
					toastError(
						`Login failed ${res.status}`,
						res.message || "Failed to login"
					);
				}
			} finally {
				setGoogleLoading(false);
				console.log("✅ [Google] Loading state cleared");
			}
		},
		onError: () => {
			console.error("❌ [Google] Login failed");
			toastError("Login failed", "Google login failed");
			setGoogleLoading(false);
		},
	});

	const handleGoogleClick = () => {
		console.log("🔍 [Google] Button clicked!");
		setGoogleLoading(true);
		googleLogin();
	};

	const handleGithubLogin = () => {
		console.log("🐙 [GitHub] Button clicked!");
		setGithubLoading(true);
		console.log("🐙 [GitHub] Initiating OAuth flow...");
		console.log("📍 [GitHub] Client ID:", GITHUB_CLIENT_ID);
		console.log("📍 [GitHub] Redirect URI:", REDIRECT_URI);

		const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
			REDIRECT_URI
		)}&scope=user:email`;

		console.log("🔗 [GitHub] Auth URL:", githubAuthUrl);
		console.log("🌐 [GitHub] Redirecting to GitHub...");

		// Redirect to GitHub OAuth
		window.location.href = githubAuthUrl;
	};

	return (
		<div className="w-full mt-10 gap-5 flex flex-row">
			<div className="flex-1">
				<Button
					loading={googleLoading}
					disabled={githubLoading}
					className={buttonClass}
					onClick={handleGoogleClick}
				>
					<Image
						src={GoogleIcon}
						alt="Google Logo"
						width={20}
						height={20}
						className="mr-3 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 w-[20px] h-[20px]"
						preview={false}
					/>
					<span>
						{googleLoading ? "Connecting to Google..." : "Log in with Google"}
					</span>
				</Button>
			</div>
			<div className="flex-1">
				<Button
					loading={githubLoading}
					disabled={googleLoading}
					className={buttonClass}
					onClick={handleGithubLogin}
				>
					<Image
						src={GithubIcon}
						alt="Github Logo"
						width={20}
						height={20}
						className="mr-3 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 w-[20px] h-[20px]"
						preview={false}
					/>
					<span className="transition-colors duration-300 ease-in-out">
						{githubLoading ? "Connecting to GitHub..." : "Log in with GitHub"}
					</span>
				</Button>
			</div>
		</div>
	);
};

export default SocialAuthForm;
