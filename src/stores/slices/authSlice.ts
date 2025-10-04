// authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import type { UserResponse } from "../../types/auth.types";
import { toast } from "react-toastify";

type User = UserResponse;

interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	loading: false,
	error: null,
};

// Thunk: fetch current user
export const fetchUser = createAsyncThunk(
	"auth/fetchUser",
	async (_, thunkAPI) => {
		try {
			const res = await authService.getCurrentUser();
			if (res.status === 200 && res.data) {
				console.log(res.data);
				return res.data;
			}
			return thunkAPI.rejectWithValue(res.message || "Failed to fetch user");
		} catch (err: unknown) {
			const error = err as Error;
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

// Thunk: logout user
export const logoutUser = createAsyncThunk(
	"auth/logoutUser",
	async (_, thunkAPI) => {
		try {
			const res = await authService.logout();
			console.log(res);

			if (res.status === 200) {
				toast.success(res.message || "Logout successful");
				return;
			}
			return thunkAPI.rejectWithValue(res.message || "Failed to logout");
		} catch (err: unknown) {
			const error = err as Error;
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
				state.user = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default authSlice.reducer;
