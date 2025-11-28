// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from 'react';
import { FileText, Globe, FolderOpen, TrendingUp, Users, Eye, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from '../../api/axiosClient';
import { dashboardApi } from '../../services/dashboardService';


interface DashboardStats {
  totalPosts: number;
  totalSources: number;
  totalCategories: number;
  todayViews: number;
  todayUsers: number;
  totalUsers7d: number;
}

interface RecentPost {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  viewCount: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalSources: 0,
    totalCategories: 0,
    todayViews: 0,
    todayUsers: 0,
    totalUsers7d: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [gaData, setGaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, recentRes, gaTodayRes] = await Promise.all([
        axiosClient.get('/admin/stats'),
        axiosClient.get('/admin/posts/recent'),
        axiosClient.get('/admin/today-stats'), // API MỚI
      ]);

      // LẤY DỮ LIỆU CŨ
      setStats(prev => ({
        ...prev,
        totalPosts: statsRes.data.totalPosts || 0,
        totalSources: statsRes.data.totalSources || 0,
        totalCategories: statsRes.data.totalCategories || 0,
        // DỮ LIỆU MỚI TỪ GA4 THẬT
        todayViews: gaTodayRes.data.todayViews || 0,
        todayUsers: gaTodayRes.data.todayUsers || 0,
        totalUsers7d: 0 // sẽ tính từ weekly-users ở dưới
      }));

      setRecentPosts((recentRes.data || []).map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        createdAt: post.createdAt,
        viewCount: post.viewCount || 0,
      })));

      // GA4 WEEKLY + TÍNH TỔNG 7 NGÀY
      const gaWeeklyRes = await axiosClient.get('/admin/weekly-users');
      const weekly = gaWeeklyRes.data || [];
      const total7d = weekly.reduce((sum: number, day: any) => sum + (day.users || 0), 0);

      // Cập nhật tổng 7 ngày
      setStats(prev => ({ ...prev, totalUsers7d: total7d }));

      // Biểu đồ weekly
      const dayOrder = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const formatted = dayOrder.map(dayName => {
        const found = weekly.find((d: any) => d.name === dayName);
        return { name: dayName, users: found ? found.users : 0 };
      });
      setGaData(formatted);

    } catch (err) {
      console.error("Lỗi load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
  const interval = setInterval(fetchDashboard, 60000); // cập nhật mỗi phút
  return () => clearInterval(interval);
}, []);



  const statCards = [
    { label: 'Tổng Bài Viết đang hoạt động', value: stats.totalPosts.toLocaleString(), icon: FileText, color: 'bg-blue-500' },
    { label: 'Nguồn trang đang hoạt động', value: stats.totalSources, icon: Globe, color: 'bg-emerald-500' },
    { label: 'Danh Mục đang hoạt động', value: stats.totalCategories, icon: FolderOpen, color: 'bg-purple-500' },
    { label: 'Lượt Xem Hôm Nay', value: stats.todayViews.toLocaleString(), icon: Eye, color: 'bg-orange-500' },
    { label: 'Người Dùng Hôm Nay', value: stats.todayUsers.toLocaleString(), icon: Users, color: 'bg-pink-500' },
    { label: '7 Ngày Qua', value: stats.totalUsers7d.toLocaleString(), icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Quản Trị</h1>
        <p className="text-slate-600 mt-2">Chào mừng anh trở lại! Đây là tổng quan hệ thống</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biểu đồ GA4 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Lượt truy cập 7 ngày qua (GA4)</h2>
            <Activity className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="h-80 relative">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-500">Đang tải dữ liệu GA4...</div>
              </div>
            ) : gaData.every(d => d.users === 0) ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Chưa có dữ liệu truy cập</p>
                  <p className="text-xs text-slate-400 mt-1">Dữ liệu sẽ xuất hiện sau khi có người truy cập</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString('vi-VN') + ' người dùng'}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Bar dataKey="users" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bài viết gần đây */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Bài Viết Gần Đây</h2>
          <div className="space-y-4">
            {recentPosts.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Chưa có bài viết</p>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(post.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-emerald-600">{post.viewCount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">lượt xem</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bot Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">LinkCrawlerBot</h3>
              <p className="text-emerald-100 mt-1">Đang hoạt động</p>
            </div>
            <div className="h-4 w-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">ContentCrawlerBot</h3>
              <p className="text-blue-100 mt-1">Đang hoạt động</p>
            </div>
            <div className="h-4 w-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div>
            <h3 className="text-lg font-semibold">Hệ thống ổn định</h3>
            <p className="text-purple-100 mt-1">156 bài được crawl hôm nay</p>
          </div>
        </div>
      </div>
    </div>
  );
}