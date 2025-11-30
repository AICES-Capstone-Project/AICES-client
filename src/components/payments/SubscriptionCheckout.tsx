import React, { useEffect, useState, useRef } from "react";
import {
	Elements,
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../../utils/stripe";
import { paymentService } from "../../services/paymentService";
import { Spin } from "antd";
import type { SubscriptionCheckoutProps } from "../../types/payment.types";

interface CheckoutFormProps {
	subscriptionId: number;
	onSuccess?: () => void;
	onError?: (error: string) => void;
}

function CheckoutForm({
	subscriptionId,
	onSuccess,
	onError,
}: CheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();

	const [processing, setProcessing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!stripe || !elements) {
			console.warn("⚠️ Stripe or Elements not loaded yet");
			return;
		}

		setProcessing(true);
		setErrorMessage("");

		try {
			console.log("🔄 Confirming setup with Stripe...");

			const { error } = await stripe.confirmSetup({
				elements,
				confirmParams: {
					return_url: window.location.origin + "/company/subscription-success",
				},
			});

			if (error) {
				console.error("❌ Stripe confirmSetup error:", error);
				setErrorMessage(error.message || "Có lỗi xảy ra");
				onError?.(error.message || "Có lỗi xảy ra");
				setProcessing(false);
			} else {
				console.log("✅ Setup confirmed successfully!");
				// Don't call onSuccess here - Stripe will redirect to return_url
			}
		} catch (err: any) {
			console.error("❌ Exception during confirmSetup:", err);
			const errMsg = err?.message || "Có lỗi xảy ra.";
			setErrorMessage(errMsg);
			onError?.(errMsg);
			setProcessing(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />

			{errorMessage && (
				<div
					style={{
						color: "#cf1322",
						backgroundColor: "#fff2f0",
						padding: "12px",
						borderRadius: "6px",
						marginTop: 16,
						border: "1px solid #ffccc7",
					}}
				>
					{errorMessage}
				</div>
			)}

			<button
				type="submit"
				disabled={processing || !stripe || !elements}
				style={{
					width: "100%",
					marginTop: 20,
					background:
						processing || !stripe || !elements ? "#d9d9d9" : "#1677ff",
					color: "#fff",
					padding: "12px 16px",
					fontSize: 16,
					fontWeight: 500,
					borderRadius: 6,
					border: "none",
					cursor:
						processing || !stripe || !elements ? "not-allowed" : "pointer",
					opacity: processing || !stripe || !elements ? 0.6 : 1,
					transition: "all 0.3s",
				}}
			>
				{processing ? "Đang xử lý..." : "Xác nhận thanh toán"}
			</button>
		</form>
	);
}

const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({
	subscriptionId,
	subscriptionName = "Gói đăng ký",
	price,
	currency = "VND",
	onSuccess,
	onError,
}) => {
	const [clientSecret, setClientSecret] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const hasRun = useRef(false);

	useEffect(() => {
		// ❗ Prevent double call in React Strict Mode
		if (hasRun.current) return;
		hasRun.current = true;

		let isMounted = true;

		const loadIntent = async () => {
			try {
				setLoading(true);
				setError("");

				console.log(
					"🔄 Creating SetupIntent for subscription:",
					subscriptionId
				);

				const res = await paymentService.createSetupIntent(subscriptionId);

				console.log("📦 SetupIntent response:", res);

				if (!isMounted) return;

				if (res?.status === "Success" && res?.data?.clientSecret) {
					console.log(
						"✅ Got clientSecret:",
						res.data.clientSecret.substring(0, 20) + "..."
					);
					setClientSecret(res.data.clientSecret);
				} else {
					const errorMsg = res?.message || "Không thể tạo yêu cầu thanh toán.";
					console.error("❌ Failed to get clientSecret:", errorMsg);
					setError(errorMsg);
					onError?.(errorMsg);
				}
			} catch (err: any) {
				console.error("❌ Error creating SetupIntent:", err);
				if (!isMounted) return;

				const errorMsg = err?.message || "Không thể tạo yêu cầu thanh toán.";
				setError(errorMsg);
				onError?.(errorMsg);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadIntent();

		return () => {
			isMounted = false;
		};
	}, [subscriptionId]); // ❗ ONLY subscriptionId in dependency array

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: 40 }}>
				<Spin size="large" />
				<p style={{ marginTop: 16, color: "#666" }}>
					Đang tải thông tin thanh toán...
				</p>
			</div>
		);
	}

	if (error || !clientSecret) {
		return (
			<div
				style={{
					padding: 20,
					backgroundColor: "#fff2f0",
					border: "1px solid #ffccc7",
					borderRadius: 8,
					textAlign: "center",
				}}
			>
				<p style={{ color: "#cf1322", fontWeight: 600 }}>
					{error || "Không thể tạo phiên thanh toán."}
				</p>
			</div>
		);
	}

	// ❗ Elements options must not change after mount
	const options = {
		clientSecret,
		appearance: {
			theme: "stripe" as const,
			variables: {
				colorPrimary: "#1677ff",
			},
		},
	};

	return (
		<div style={{ padding: 20 }}>
			<h2 style={{ marginBottom: 8, fontSize: 24, fontWeight: 600 }}>
				Thanh toán đăng ký
			</h2>
			<p style={{ fontSize: 16, marginBottom: 4 }}>
				<strong>{subscriptionName}</strong>
			</p>
			{price && (
				<p
					style={{
						color: "#1677ff",
						fontSize: 24,
						fontWeight: 600,
						marginBottom: 8,
					}}
				>
					{new Intl.NumberFormat("vi-VN", {
						style: "currency",
						currency: currency,
						minimumFractionDigits: 0,
					}).format(price)}
				</p>
			)}
			<p style={{ color: "#666", marginBottom: 24 }}>
				🔒 Thanh toán an toàn qua Stripe
			</p>

			{/* ❗ Elements only mounts once with clientSecret */}
			<Elements stripe={stripePromise} options={options}>
				<CheckoutForm
					subscriptionId={subscriptionId}
					onSuccess={onSuccess}
					onError={onError}
				/>
			</Elements>
		</div>
	);
};

export default SubscriptionCheckout;
