import { Search, Filter, Edit2, Trash2, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const articles = [
    {
      id: 1,
      title: 'Công nghệ AI đang thay đổi ngành công nghiệp như thế nào',
      category: 'Công Nghệ',
      source: 'VnExpress',
      status: 'approved',
      views: 1234,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'Thị trường chứng khoán biến động mạnh trong tuần qua',
      category: 'Kinh Doanh',
      source: 'Thanh Niên',
      status: 'pending',
      views: 856,
      createdAt: '2024-01-15',
    },
    {
      id: 3,
      title: 'Xu hướng thời trang xuân hè 2024',
      category: 'Giải Trí',
      source: 'Tuổi Trẻ',
      status: 'approved',
      views: 2341,
      createdAt: '2024-01-14',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Bài Viết</h1>
        <p className="text-slate-600 mt-2">Quản lý các bài viết được crawl</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="approved">Đã duyệt</option>
                <option value="pending">Chờ duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Filter size={20} className="mr-2" />
                Lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-48 h-32 bg-slate-200 rounded-lg flex-shrink-0"></div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {article.category}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                        {article.source}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          article.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {article.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 space-x-4">
                      <span>{article.views} lượt xem</span>
                      <span>•</span>
                      <span>{article.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <button className="flex items-center justify-center px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">
                  <CheckCircle size={16} className="mr-1" />
                  Duyệt
                </button>
                <button className="flex items-center justify-center px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                  <Sparkles size={16} className="mr-1" />
                  Generate
                </button>
                <button className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <Edit2 size={16} className="mr-1" />
                  Sửa
                </button>
                <button className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <Trash2 size={16} className="mr-1" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
