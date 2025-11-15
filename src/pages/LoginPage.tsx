import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Hàm này chỉ để mô phỏng, trong thực tế em sẽ gọi API
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form submit lại trang
    console.log('Login Data:', {
      tentant: 1, // Giá trị mặc định theo yêu cầu
      username,
      password,
    });
    
    // Giả lập đăng nhập thành công và chuyển hướng
    alert('Đăng nhập thành công (giả lập)!');
    navigate('/admin/dashboard'); // Chuyển hướng tới trang dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          {/* Dùng chung icon và màu emerald-600 cho nhất quán */}
          <Globe className="h-12 w-12 text-emerald-600" />
          <h2 className="mt-6 text-3xl font-bold text-center text-slate-900">
            Đăng nhập tài khoản
          </h2>
        </div>
        
        {/* Đây là form tĩnh theo yêu cầu */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Tentant được set mặc định, ta ẩn đi */}
          <input type="hidden" name="tentant" value="1" />
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-slate-700">
                Tên đăng nhập
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="username@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="w-5 h-5 text-slate-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-slate-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}