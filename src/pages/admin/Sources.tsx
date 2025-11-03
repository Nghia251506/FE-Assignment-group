import { Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Sources() {
  const [searchQuery, setSearchQuery] = useState('');

  const sources = [
    {
      id: 1,
      name: 'VnExpress',
      url: 'https://vnexpress.net',
      category: 'Công Nghệ',
      selector: '.article-title',
      status: 'active',
      articlesCount: 234,
    },
    {
      id: 2,
      name: 'Thanh Niên',
      url: 'https://thanhnien.vn',
      category: 'Kinh Doanh',
      selector: '.news-title',
      status: 'active',
      articlesCount: 189,
    },
    {
      id: 3,
      name: 'Tuổi Trẻ',
      url: 'https://tuoitre.vn',
      category: 'Giải Trí',
      selector: '.title-news',
      status: 'inactive',
      articlesCount: 156,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nguồn Trang</h1>
          <p className="text-slate-600 mt-2">Quản lý các nguồn tin tức</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Thêm Nguồn Mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nguồn trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Tên Nguồn
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Danh Mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Selector
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Số Bài Viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{source.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                    >
                      {source.url}
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {source.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                      {source.selector}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{source.articlesCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        source.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {source.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-700 mr-3">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
