// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Login } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Loader2, LogIn, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useAppSelector((state) => state.auth);

  // TỰ ĐỘNG CHUYỂN HƯỚNG KHI ĐÃ LOGIN (kể cả reload trang)
  useEffect(() => {
    if (currentUser) {
      const isAdmin = 
        currentUser.roleCode === "ROLE_ADMIN" || 
        currentUser.roleName === "Admin";

      if (isAdmin) {
        toast.success(
          <div className="flex items-center gap-2">
            <UserCheck size={20} />
            <span>Chào mừng Admin <strong>{currentUser.username}</strong> quay lại!</span>
          </div>,
          { autoClose: 3000 }
        );
        navigate("/dashboard", { replace: true });
      } else {
        toast.warning("Bạn không có quyền truy cập khu vực Admin");
        navigate("/", { replace: true });
      }
    }
  }, [currentUser, navigate]);

  // Hiển thị lỗi từ backend
  useEffect(() => {
    if (error) {
      toast.error(error === "Invalid credentials" ? "Sai tài khoản hoặc mật khẩu!" : error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await dispatch(Login(formData)).unwrap();
      // → Thành công → useEffect trên sẽ tự redirect
    } catch (err) {
      // Lỗi đã được xử lý ở useEffect error
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-10 border border-white/20">
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <LogIn size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-600 mt-3 text-lg">Đăng nhập để quản trị hệ thống</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.trim() })}
              className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-lg"
              placeholder="Nhập username"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-lg"
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <LogIn size={28} />
                <span>Đăng nhập ngay</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>© 2025 Muong14 News Admin Panel • Đã sẵn sàng cho production</p>
        </div>
      </div>
    </div>
  );
}