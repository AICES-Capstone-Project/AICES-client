import { useState } from "react";
import { authService } from "../services/authService"; // Import the real authService
import type { ProfileResponse } from "../types/auth.types";

export default function UserProfileTest() {
	const [user, setUser] = useState<ProfileResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetCurrentUser = async () => {
		setLoading(true);
		setError(null);
		setUser(null);

		try {
			// Use the real authService.getCurrentUser()
			const response = await authService.getCurrentUser();

			console.log("API Response:", response);

			// authService returns ApiResponse<ProfileResponse> with status string (e.g. "Success")
			if (response.status === "Success" && response.data) {
				setUser(response.data as ProfileResponse);
			} else {
				setError(response.message || "Failed to fetch user data");
			}
		} catch (err: unknown) {
			const msg = err && typeof err === "object" && "message" in err ? (err as any).message : String(err);
			setError(msg || "An error occurred");
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};

	const token = localStorage.getItem("access_token");

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6">
						User Profile Test
					</h1>

					{/* Token Status */}
					<div className="mb-6 p-4 bg-gray-50 rounded-lg">
						<h2 className="text-sm font-semibold text-gray-600 mb-2">
							Token Status
						</h2>
						{token ? (
							<div>
								<p className="text-xs text-green-600 mb-2">✓ Token found</p>
								<p className="text-xs text-gray-500 font-mono break-all">
									{token.substring(0, 50)}...
								</p>
							</div>
						) : (
							<p className="text-xs text-red-600">
								✗ No token found. Please login first.
							</p>
						)}
					</div>

					{/* Test Button */}
					<button
						onClick={handleGetCurrentUser}
						disabled={loading || !token}
						className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
					>
						{loading ? "Loading..." : "Get Current User"}
					</button>

					{/* Error Display */}
					{error && (
						<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<h3 className="text-sm font-semibold text-red-800 mb-2">Error</h3>
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					{/* User Data Display */}
					{user && (
						<div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
								<span className="text-green-600 mr-2">✓</span>
								User Information
							</h3>

							<div className="space-y-3">
								<div className="flex items-center">
									{user.avatarUrl && (
										<img
											src={user.avatarUrl}
											alt="Avatar"
											className="w-16 h-16 rounded-full mr-4"
										/>
									)}
									<div>
										<p className="text-xl font-bold text-gray-800">
											{user.fullName || "No name"}
										</p>
										<p className="text-sm text-gray-600">{user.email}</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 mt-4">
									<div className="bg-white p-3 rounded-lg">
										<p className="text-xs text-gray-500 mb-1">User ID</p>
										<p className="font-semibold text-gray-800">{user.userId}</p>
									</div>

									<div className="bg-white p-3 rounded-lg">
										<p className="text-xs text-gray-500 mb-1">Role</p>
										<p className="font-semibold text-gray-800">
											{user.roleName || "N/A"}
										</p>
									</div>

									<div className="bg-white p-3 rounded-lg">
										<p className="text-xs text-gray-500 mb-1">Status</p>
										<p className="font-semibold text-gray-800">
											{user.isActive ? (
												<span className="text-green-600">Active</span>
											) : (
												<span className="text-red-600">Inactive</span>
											)}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Raw Response */}
					{user && (
						<details className="mt-4">
							<summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
								View Raw JSON
							</summary>
							<pre className="mt-2 p-4 bg-gray-800 text-green-400 rounded-lg text-xs overflow-x-auto">
								{JSON.stringify(user, null, 2)}
							</pre>
						</details>
					)}
				</div>
			</div>
		</div>
	);
}
