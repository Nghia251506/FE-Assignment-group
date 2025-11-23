// src/pages/Login.tsx – SIÊU PHẨM LOGIN 2025 DÀNH RIÊNG CHO ANH NGHĨA!!!
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Login } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Loader2, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserFromJwt } from "../utils/jwt";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useAppSelector((state) => state.auth);

  // NẾU ĐÃ ĐĂNG NHẬP RỒI → TỰ ĐỘNG CHUYỂN VÀO DASHBOARD NGAY!!!
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(Login(formData)).unwrap();
      // → thành công → useEffect trên sẽ tự redirect
    } catch (err) {
      // lỗi đã được toast ở useEffect
    }
  };
  useEffect(() => {
    console.log(currentUser)
    if (currentUser) {
      if (currentUser.roleCode === "ADMIN") {
        toast.success(`Chào Admin ${currentUser.username}!`);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-600 mt-2">Đăng nhập để quản trị hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="admin"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn size={22} />
                Đăng nhập ngay
              </>
            )}
          </button>

          <div className="text-center text-sm text-slate-500 mt-6">
            <p>Demo account:</p>
            <p className="font-medium text-slate-700">admin / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}