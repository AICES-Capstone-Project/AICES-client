import { message } from "antd";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
	type: ToastType;
	title: string;
	message?: string;
	duration?: number; // in seconds
}

export const showToast = ({
	type,
	title,
	message: messageText,
	duration = 3,
}: ToastOptions) => {
	const content = messageText ? `${title}: ${messageText}` : title;

	const config = {
		content,
		duration,
	};

	if (type === "success") message.success(config);
	else if (type === "error") message.error(config);
	else if (type === "warning") message.warning(config);
	else message.info(config);
};

// Convenience functions
export const toastSuccess = (
	title: string,
	message?: string,
	duration?: number
) => showToast({ type: "success", title, message, duration });

export const toastError = (
	title: string,
	message?: string,
	duration?: number
) => showToast({ type: "error", title, message, duration });

export const toastInfo = (title: string, message?: string, duration?: number) =>
	showToast({ type: "info", title, message, duration });

export const toastWarning = (
	title: string,
	message?: string,
	duration?: number
) => showToast({ type: "warning", title, message, duration });
