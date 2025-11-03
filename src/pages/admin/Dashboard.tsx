import { FileText, Globe, FolderOpen, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Tổng Bài Viết', value: '1,234', icon: FileText, color: 'bg-blue-500' },
    { label: 'Nguồn Trang', value: '45', icon: Globe, color: 'bg-emerald-500' },
    { label: 'Danh Mục', value: '12', icon: FolderOpen, color: 'bg-purple-500' },
    { label: 'Lượt Xem Hôm Nay', value: '8,456', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Tổng quan hệ thống tin tức</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Bài Viết Gần Đây</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start pb-4 border-b border-slate-100 last:border-0">
                <div className="w-16 h-16 bg-slate-200 rounded flex-shrink-0"></div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
                    Tiêu đề bài viết mẫu số {item}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">2 giờ trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Hoạt Động Bot</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">LinkCrawlerBot</p>
                <p className="text-xs text-slate-600 mt-1">Đang hoạt động</p>
              </div>
              <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">ContentCrawlerBot</p>
                <p className="text-xs text-slate-600 mt-1">Đang hoạt động</p>
              </div>
              <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">156</span> bài viết được crawl hôm nay
              </p>
              <p className="text-sm text-slate-700 mt-2">
                <span className="font-semibold">23</span> nguồn đang được theo dõi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
