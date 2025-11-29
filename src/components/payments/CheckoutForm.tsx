import React, { useState, FormEvent } from "react";
import {
	useStripe,
	useElements,
	PaymentElement,
} from "@stripe/react-stripe-js";
import { getStripeErrorMessage } from "../../utils/stripe";

interface CheckoutFormProps {
	subscriptionName: string;
	onSuccess?: () => void;
	onError?: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
	subscriptionName,
	onSuccess,
	onError,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setIsProcessing(true);
		setErrorMessage(null);

		try {
			const { error, setupIntent } = await stripe.confirmSetup({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/payment/success`,
				},
				redirect: "if_required",
			});

			if (error) {
				const errorMsg = getStripeErrorMessage(error);
				setErrorMessage(errorMsg);
				onError?.(errorMsg);
			} else if (setupIntent && setupIntent.status === "succeeded") {
				setPaymentSuccess(true);
				setTimeout(() => {
					onSuccess?.();
				}, 2000);
			}
		} catch (err: any) {
			const errorMsg = err.message || "Đã xảy ra lỗi không xác định";
			setErrorMessage(errorMsg);
			onError?.(errorMsg);
		} finally {
			setIsProcessing(false);
		}
	};

	if (paymentSuccess) {
		return (
			<div className="text-center py-8">
				<div className="mb-4">
					<svg
						className="mx-auto h-16 w-16 text-green-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 className="text-2xl font-bold text-gray-900 mb-2">
					Thanh toán thành công!
				</h3>
				<p className="text-gray-600 mb-4">
					Cảm ơn bạn đã đăng ký {subscriptionName}. Đăng ký của bạn đang được
					kích hoạt.
				</p>
				<div className="animate-pulse text-sm text-gray-500">
					Đang chuyển hướng...
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-6">
				<PaymentElement />
			</div>

			{errorMessage && (
				<div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					<p className="text-sm">{errorMessage}</p>
				</div>
			)}

			<button
				type="submit"
				disabled={!stripe || isProcessing}
				className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
					!stripe || isProcessing
						? "bg-gray-400 cursor-not-allowed"
						: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
				}`}
			>
				{isProcessing ? (
					<span className="flex items-center justify-center">
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Đang xử lý...
					</span>
				) : (
					"Xác nhận thanh toán"
				)}
			</button>

			<p className="text-xs text-gray-500 text-center mt-4">
				Bằng cách nhấn "Xác nhận thanh toán", bạn đồng ý với điều khoản dịch vụ
				của chúng tôi.
			</p>
		</form>
	);
};

export default CheckoutForm;
