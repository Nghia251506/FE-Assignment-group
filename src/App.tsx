import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './components/Layout/AdminLayout';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Sources from './pages/admin/Sources';
import Articles from './pages/admin/Articles';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';



// --- THÊM IMPORT MỚI ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// ------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>

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