import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { APP_ROUTES } from "../../services/config";

const VerifyEmailPage = () => {
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [countdown, setCountdown] = useState(5);
	const navigate = useNavigate();
	const location = useLocation();
	const called = useRef(false);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get("token");

		const verify = async () => {
			if (called.current) return;
			called.current = true;

			if (!token) {
				setMessage("❌ Invalid verification link");
				setLoading(false);
				return;
			}

			const res = await authService.verifyEmail(token);
			if (res.status === 200) {
				toast.success(res.message);
				setMessage("✅ Email verified successfully! Redirecting to login...");
				setLoading(false);

				const timer = setInterval(() => {
					setCountdown((prev) => {
						if (prev === 1) {
							clearInterval(timer);
							navigate(APP_ROUTES.LOGIN);
						}
						return prev - 1;
					});
				}, 1000);
			} else {
				toast.error(res.message || "Verification failed");
				setMessage("❌ Verification failed. Please try again.");
				setLoading(false);
			}
		};

		verify();
	}, [location.search, navigate]);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="p-6 rounded-2xl shadow-md bg-white text-center">
				{loading ? (
					<p>⏳ Verifying your email...</p>
				) : (
					<p>
						{message}
						{message.includes("successfully") && (
							<span> Redirecting in {countdown}...</span>
						)}
					</p>
				)}
			</div>
		</div>
	);
};

export default VerifyEmailPage;
