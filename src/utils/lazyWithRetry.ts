import { type ComponentType, lazy } from "react";

/**
 * Wrapper cho React.lazy() với retry logic
 * Tự động reload trang khi gặp lỗi chunk load (sau khi deploy bản build mới)
 */
export function lazyWithRetry<T extends ComponentType<any>>(
	componentImport: () => Promise<{ default: T }>
) {
	return lazy(async () => {
		const pageHasAlreadyBeenForceRefreshed = JSON.parse(
			window.sessionStorage.getItem("page-has-been-force-refreshed") || "false"
		);

		try {
			const component = await componentImport();

			// Reset flag nếu load thành công
			window.sessionStorage.setItem("page-has-been-force-refreshed", "false");

			return component;
		} catch (error) {
			// Kiểm tra xem có phải lỗi chunk load không
			const isChunkLoadError =
				error instanceof Error &&
				(error.name === "ChunkLoadError" ||
					/Loading chunk [\d]+ failed/.test(error.message) ||
					/Failed to fetch dynamically imported module/.test(error.message));

			if (!pageHasAlreadyBeenForceRefreshed && isChunkLoadError) {
				// Đánh dấu là đã reload để tránh loop vô hạn
				window.sessionStorage.setItem("page-has-been-force-refreshed", "true");

				// Reload trang để lấy bản build mới nhất
				window.location.reload();

				// Return một promise không bao giờ resolve để tránh render
				return new Promise<{ default: T }>(() => {});
			}

			// Nếu không phải chunk load error hoặc đã reload rồi, throw error
			throw error;
		}
	});
}

