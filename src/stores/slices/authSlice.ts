// authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { STORAGE_KEYS } from "../../services/config";
import type { UserResponse } from "../../types/auth.types";

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

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.user = null;
			localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
		},
	},
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
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
