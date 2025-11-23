// --- THÊM 'useNavigate' VÀO IMPORT ---
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Globe, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // --- THÊM MỚI BƯỚC 1: Khởi tạo hook navigate ---
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/sources', icon: Globe, label: 'Nguồn Trang' },
    { path: '/articles', icon: FileText, label: 'Bài Viết' },
    { path: '/categories', icon: FolderOpen, label: 'Danh Mục' },
    { path: '/tags', icon: Settings, label: 'Tag' },
    { path: '/settings', icon: Settings, label: 'Cấu Hình' },
  ];

  // --- THÊM MỚI BƯỚC 2: Tạo hàm xử lý đăng xuất ---
  const handleLogout = () => {
    // Trong thực tế, em sẽ xóa token/session đã lưu ở đây
    // Ví dụ: localStorage.removeItem('authToken');
    
    // Sau đó chuyển hướng về trang login
    console.log("Đã đăng xuất, đang chuyển về /login");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <Globe className="h-8 w-8 text-emerald-600" />
                <span className="ml-3 text-xl font-semibold text-slate-900">News Crawler Admin</span>
              </div>
            </div>
            <div className="flex items-center">
              
              {/* --- THÊM MỚI BƯỚC 3: Thêm onClick và đổi màu hover --- */}
              <button 
                onClick={handleLogout} 
                className="flex items-center text-slate-600 hover:text-red-600"
              >
                <LogOut size={20} className="mr-2" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>

            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} mt-16`}>
          <nav className="mt-8 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      // Sửa lỗi hover:bg-slate-100'
                      : 'text-slate-700 hover:bg-slate-100' 
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}