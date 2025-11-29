import React, { useEffect, useState } from "react";
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
	clientSecret: string;
	onSuccess?: () => void;
	onError?: (error: string) => void;
}

function CheckoutForm({ clientSecret, onSuccess, onError }: CheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();

	const [isProcessing, setIsProcessing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsProcessing(true);
		setErrorMessage("");

		if (!stripe || !elements) {
			setIsProcessing(false);
			return;
		}

		try {
			const { error } = await stripe.confirmSetup({
				elements,
				confirmParams: {
					return_url: window.location.origin + "/company/subscription-success",
				},
				redirect: "if_required",
			});

			if (error) {
				setErrorMessage(error.message || "Đã xảy ra lỗi");
				onError?.(error.message || "Đã xảy ra lỗi");
			} else {
				onSuccess?.();
			}
		} catch (err: any) {
			console.error(err);
			const errMsg = err?.message || "Đã xảy ra lỗi không xác định.";
			setErrorMessage(errMsg);
			onError?.(errMsg);
		}

		setIsProcessing(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />

			{errorMessage && (
				<div style={{ color: "red", marginTop: 10 }}>{errorMessage}</div>
			)}

			<button
				type="submit"
				disabled={isProcessing || !stripe || !elements}
				style={{
					marginTop: 20,
					width: "100%",
					backgroundColor: "#1677ff",
					color: "#fff",
					padding: "10px 16px",
					borderRadius: 6,
					fontSize: 16,
					border: "none",
					cursor:
						isProcessing || !stripe || !elements ? "not-allowed" : "pointer",
					opacity: isProcessing || !stripe || !elements ? 0.6 : 1,
				}}
			>
				{isProcessing ? "Đang xử lý..." : "Thanh toán"}
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

	useEffect(() => {
		const fetchIntent = async () => {
			try {
				setLoading(true);
				setError("");

				const res = await paymentService.createSetupIntent(subscriptionId);

				if (res?.status === "Success" && res?.data?.clientSecret) {
					setClientSecret(res.data.clientSecret);
				} else {
					const errorMsg = res?.message || "No clientSecret returned";
					setError(errorMsg);
					onError?.(errorMsg);
				}
			} catch (err: any) {
				console.error(err);
				const errorMsg = err?.message || "Không thể tạo SetupIntent";
				setError(errorMsg);
				onError?.(errorMsg);
			} finally {
				setLoading(false);
			}
		};

		fetchIntent();
	}, [subscriptionId, onError]);

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "40px 0" }}>
				<Spin size="large" />
				<p style={{ marginTop: 16, color: "#666" }}>
					Đang tải thông tin thanh toán...
				</p>
			</div>
		);
	}

	if (error || !clientSecret) {
		return (
			<div style={{ padding: 20, textAlign: "center" }}>
				<div
					style={{
						backgroundColor: "#fff2f0",
						border: "1px solid #ffccc7",
						borderRadius: 8,
						padding: 20,
					}}
				>
					<p
						style={{
							color: "#cf1322",
							fontWeight: 600,
							marginBottom: 8,
						}}
					>
						Không thể tạo phiên thanh toán
					</p>
					<p style={{ color: "#666" }}>{error || "Vui lòng thử lại sau."}</p>
				</div>
			</div>
		);
	}

	const options = {
		clientSecret,
		appearance: {
			theme: "stripe" as const,
			variables: {
				colorPrimary: "#1677ff",
				colorBackground: "#ffffff",
				colorText: "#1f2937",
				colorDanger: "#cf1322",
				fontFamily: "system-ui, sans-serif",
				borderRadius: "8px",
			},
		},
	};

	return (
		<div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
			<h2 style={{ marginBottom: 4, fontSize: 24, fontWeight: 600 }}>
				Thanh toán đăng ký
			</h2>
			<p style={{ marginTop: 0, fontSize: 16 }}>
				<strong>{subscriptionName}</strong>
			</p>
			{price && (
				<p style={{ color: "#1677ff", fontWeight: 600, fontSize: 18 }}>
					{new Intl.NumberFormat("vi-VN", {
						style: "currency",
						currency: currency,
						minimumFractionDigits: 0,
					}).format(price)}
				</p>
			)}

			<p style={{ marginTop: 8, marginBottom: 20, color: "#666" }}>
				🔒 Thanh toán an toàn qua Stripe
			</p>

			<Elements stripe={stripePromise} options={options}>
				<CheckoutForm
					clientSecret={clientSecret}
					onSuccess={onSuccess}
					onError={onError}
				/>
			</Elements>
		</div>
	);
};

export default SubscriptionCheckout;
