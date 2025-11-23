// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// Type cho user trả về từ BE
interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  roles?: string[];
  // thêm các field khác nếu BE trả về
}

interface AuthState {
  token: string | "";
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: ""
};

// Async thunk: Login → BE set cookie → chỉ trả về user
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      
      // BE trả về UserDto trực tiếp (không có token nữa)
      const user = response.data;
      
      return user; // ← chỉ trả về user
    } catch (err: any) {
      const message = err.response?.data || err.message || "Đăng nhập thất bại";
      return rejectWithValue(message);
    }
  }
);

// Lấy thông tin user hiện tại (dùng cookie để xác thực)
export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/auth/me");
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Không thể lấy thông tin người dùng");
  }
});

// Logout → gọi BE để xóa cookie
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosClient.post("/auth/logout");
    return true;
  } catch (err: any) {
    return rejectWithValue("Đăng xuất thất bại");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ==================== LOGIN ====================
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = (action.payload as string) || "Đăng nhập thất bại";
      })

      // ==================== FETCH ME ====================
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // ==================== LOGOUT ====================
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;