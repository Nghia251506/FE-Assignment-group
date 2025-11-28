// src/redux/slices/authSlice.ts – PHIÊN BẢN CUỐI CÙNG, HOÀN HẢO NHẤT 2025!!!
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../../services/authService";
import { User, UserRole } from "../../types/models";
import axiosClient from "../../api/axiosClient";

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// KHÔNG ĐỌC JWT TỪ COOKIE NỮA → DÙNG API /auth/me ĐỂ CHECK
const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

// THUNK: LOGIN → BE set cookie → gọi /me để lấy user
export const Login = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (dto, { rejectWithValue }) => {
  try {
    // B1: Gọi login → backend set HttpOnly cookie
    await loginApi(dto);

    // B2: Gọi /auth/me để backend đọc cookie và trả user
    const res = await axiosClient.get("/auth/me");
    return res.data as User;
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      "Sai tài khoản hoặc mật khẩu";
    return rejectWithValue(msg);
  }
});

// THUNK: KIỂM TRA ĐĂNG NHẬP KHI RELOAD TRANG (F5 vẫn login)
export const checkAuth = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/auth/me");
      return res.data as User;
    } catch (err) {
      return rejectWithValue("Phiên đăng nhập hết hạn");
    }
  }
);

// THUNK: LOGOUT
export const Logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosClient.post("/auth/logout");
  } catch (err) {
    // Không sao nếu backend không có endpoint logout
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
        state.currentUser = null;
      })

      // CHECK AUTH (khi reload)
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.currentUser = null;
      })

      // LOGOUT
      .addCase(Logout.fulfilled, (state) => {
        state.currentUser = null;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;