import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './components/Layout/AdminLayout';
import UserLayout from './components/Layout/UserLayout';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Sources from './pages/admin/Sources';
import Articles from './pages/admin/Articles';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';

// User Pages
import Home from './pages/user/Home';
import ArticleDetail from './pages/user/ArticleDetail';
import Category from './pages/user/Category';

// --- THÊM IMPORT MỚI ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// ------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Các Route cho Người dùng (Public) === */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="article/:idOrSlug" element={<ArticleDetail />} />
          <Route path="category/:id" element={<Category />} />
        </Route>

        {/* === Các Route cho Xác thực (Auth) === */}
        {/* Đây là 2 route mới, nằm độc lập */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* === Các Route cho Admin (Protected) === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sources" element={<Sources />} />
          <Route path="articles" element={<Articles />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Em có thể thêm một route 404 ở đây nếu muốn */}
        {/* <Route path="*" element={<div>Trang không tìm thấy</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;