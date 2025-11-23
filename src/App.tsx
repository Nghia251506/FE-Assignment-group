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
import Tags from './pages/admin/Tags';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from "./redux/hooks"; // hoặc hook của anh
import { selectCurrentUser, selectIsAuthenticated } from "./redux/selectors/authSelectors";
import { fetchMe } from "./redux/slices/authSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
  if (!user && !isAuthenticated) {
    dispatch(fetchMe());
  }
}, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* === Các Route cho Xác thực (Auth) === */}
        {/* Đây là 2 route mới, nằm độc lập */}
        <Route path="/login" element={<LoginPage />} />
        {/* === Các Route cho Admin (Protected) === */}
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sources" element={<Sources />} />
          <Route path="articles" element={<Articles />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tags" element={<Tags />} />
        </Route>
        
        {/* Em có thể thêm một route 404 ở đây nếu muốn */}
        {/* <Route path="*" element={<div>Trang không tìm thấy</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
