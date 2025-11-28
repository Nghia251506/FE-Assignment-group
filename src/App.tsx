// src/App.tsx – PHIÊN BẢN CUỐI CÙNG, HOÀN HẢO NHẤT 2025!!!
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Pages
import AdminLayout from './components/Layout/AdminLayout';
import LoginPage from './pages/LoginPage';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Sources from './pages/admin/Sources';
import Articles from './pages/admin/Articles';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';
import Tags from './pages/admin/Tags';

// Component
import ProtectedRoute from './components/ProtectedRoute';

// THÊM 2 DÒNG NÀY
import { useEffect, useState } from 'react';
import axiosClient from './api/axiosClient';
import { checkAuth } from './redux/slices/authSlice';
import { useAppDispatch } from './redux/hooks';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth()); // ← DÒNG QUAN TRỌNG NHẤT
  }, [dispatch])
  // <<< KẾT THÚC >>>

  // Loading screen đẹp (tùy anh chỉnh)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Đang tải Admin Panel...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Tất cả route admin → phải qua ProtectedRoute */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect root → dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sources" element={<Sources />} />
          <Route path="articles" element={<Articles />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tags" element={<Tags />} />
        </Route>

        {/* 404 → về login nếu chưa đăng nhập */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;