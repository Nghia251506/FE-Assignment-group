// src/redux/slices/authSlice.ts – PHIÊN BẢN THẦN THÁNH DÀNH RIÊNG CHO ANH NGHĨA!!!
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginApi } from "../../services/authService"; // giữ nguyên service của anh
import { User, UserRole } from "../../types/models";
import { getUserFromJwt } from "../../utils/jwt"; // file decode JWT
import axiosClient from "../../api/axiosClient";

// STATE CHỈ CÓ currentUser, KHÔNG LƯU TOKEN VÀO LOCALSTORAGE
interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// KHỞI TẠO USER TỪ JWT TRONG COOKIE KHI APP LOAD (F5 vẫn giữ login)
const userFromCookie = getUserFromJwt();
const initialState: AuthState = {
  currentUser: userFromCookie
    ? {
        id: userFromCookie.userId,
        username: userFromCookie.sub,
        roleCode: userFromCookie.roleCode as UserRole,
        roleName: userFromCookie.roleName,
        isActive: true, // mặc định true vì đang login được
        // các field khác có thể để undefined
      }
    : null,
  loading: false,
  error: null,
};

// THUNK LOGIN – CHỈ GỌI API, ĐỌC USER TỪ COOKIE
export const Login = createAsyncThunk<User, { username: string; password: string }>(
  "auth/login",
  async (dto, { rejectWithValue }) => {
    try {
      // Gọi login → BE set cookie HttpOnly
      await loginApi(dto);

      // Đọc user từ JWT trong cookie
      const jwtUser = getUserFromJwt();
      if (!jwtUser) throw new Error("Không thể đọc thông tin người dùng");

      return {
        id: jwtUser.userId,
        username: jwtUser.sub,
        roleCode: jwtUser.roleCode as UserRole,
        roleName: jwtUser.roleName,
        isActive: true,
      } as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu");
    }
  }
);

// LOGOUT (nếu có endpoint xóa cookie)
export const Logout = createAsyncThunk("api/auth/logout", async () => {
  await axiosClient.post("api/auth/logout"); // nếu có
  // Nếu không có thì chỉ cần F5 là cookie vẫn còn → nhưng Redux sẽ xóa user
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
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
      .addCase(Login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Đăng nhập thất bại";
        state.currentUser = null;
      })

      // LOGOUT
      .addCase(Logout.fulfilled, (state) => {
        state.currentUser = null;
      });
  },
});

export const { resetError, clearAuth } = authSlice.actions;
export default authSlice.reducer;