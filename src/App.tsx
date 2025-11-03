import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/Layout/AdminLayout';
import UserLayout from './components/Layout/UserLayout';
import Dashboard from './pages/admin/Dashboard';
import Sources from './pages/admin/Sources';
import Articles from './pages/admin/Articles';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';
import Home from './pages/user/Home';
import ArticleDetail from './pages/user/ArticleDetail';
import Category from './pages/user/Category';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="article/:id" element={<ArticleDetail />} />
          <Route path="category/:id" element={<Category />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sources" element={<Sources />} />
          <Route path="articles" element={<Articles />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
