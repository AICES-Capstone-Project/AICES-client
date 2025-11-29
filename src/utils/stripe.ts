import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
	console.error(
		"Stripe publishable key is missing. Please set VITE_STRIPE_PUBLISHABLE_KEY in .env file"
	);
}

export const stripePromise = loadStripe(stripePublishableKey || "");

// Currency formatting helper
export const formatCurrency = (
	amount: number,
	currency: string = "VND"
): string => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 0,
	}).format(amount);
};

// Error message translations
export const getStripeErrorMessage = (error: any): string => {
	const errorMessages: Record<string, string> = {
		card_declined: "Thẻ bị từ chối. Vui lòng thử thẻ khác.",
		expired_card: "Thẻ đã hết hạn. Vui lòng thử thẻ khác.",
		incorrect_cvc: "Mã CVC không đúng. Vui lòng kiểm tra lại.",
		processing_error: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
		incorrect_number: "Số thẻ không đúng. Vui lòng kiểm tra lại.",
		incomplete_number: "Số thẻ chưa đầy đủ.",
		incomplete_cvc: "Mã CVC chưa đầy đủ.",
		incomplete_expiry: "Ngày hết hạn chưa đầy đủ.",
	};

	if (error?.code && errorMessages[error.code]) {
		return errorMessages[error.code];
	}

	return error?.message || "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
};
