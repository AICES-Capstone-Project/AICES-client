export interface ApiResponse<T> {
	status: number; // enum từ backend (200, 400, 401…)
	message?: string; // message từ backend
	data?: T; // data trả về (generic), có thể có or không
}
