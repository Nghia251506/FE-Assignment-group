import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Công Nghệ', slug: 'cong-nghe', articlesCount: 234, color: 'blue' },
    { id: 2, name: 'Kinh Doanh', slug: 'kinh-doanh', articlesCount: 189, color: 'emerald' },
    { id: 3, name: 'Giải Trí', slug: 'giai-tri', articlesCount: 156, color: 'purple' },
    { id: 4, name: 'Thể Thao', slug: 'the-thao', articlesCount: 143, color: 'orange' },
    { id: 5, name: 'Thế Giới', slug: 'the-gioi', articlesCount: 198, color: 'red' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Danh Mục</h1>
          <p className="text-slate-600 mt-2">Quản lý danh mục bài viết</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Thêm Danh Mục
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    colorClasses[category.color as keyof typeof colorClasses]
                  }`}
                >
                  {category.name}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  Slug: <code className="text-xs bg-slate-100 px-2 py-1 rounded">{category.slug}</code>
                </p>
                <p className="text-sm text-slate-600">
                  Số bài viết: <span className="font-semibold text-slate-900">{category.articlesCount}</span>
                </p>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                  <Edit2 size={16} className="mr-1" />
                  Sửa
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">
                  <Trash2 size={16} className="mr-1" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
