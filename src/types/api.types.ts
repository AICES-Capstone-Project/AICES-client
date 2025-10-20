export interface ApiResponse<T> {
	status: string; // enum từ backend (Success, Error, Unauthorized, etc.)
	message: string; // message từ backend
	data: T | null; // data trả về (generic), có thể có or không
}
