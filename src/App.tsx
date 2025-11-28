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
import { useEffect, useState } from 'react';
import axiosClient from './api/axiosClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sources" element={<Sources />} />
          <Route path="articles" element={<Articles />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tags" element={<Tags />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

