import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Cấu Hình</h1>
        <p className="text-slate-600 mt-2">Cài đặt thông tin website</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">SEO & Meta Tags</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tiêu đề website
              </label>
              <input
                type="text"
                placeholder="NewsHub - Tin tức tổng hợp"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mô tả website
              </label>
              <textarea
                rows={3}
                placeholder="Trang tin tức tổng hợp từ nhiều nguồn uy tín..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                placeholder="tin tức, báo chí, news, thời sự"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-1">Phân cách bằng dấu phấy</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quảng Cáo & Banner</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Banner Header (HTML Code)
              </label>
              <textarea
                rows={4}
                placeholder="<script>...</script>"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Banner Sidebar (HTML Code)
              </label>
              <textarea
                rows={4}
                placeholder="<script>...</script>"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Google Analytics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tracking ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Cấu Hình Crawler</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tần suất crawl (phút)
              </label>
              <input
                type="number"
                defaultValue={60}
                min={10}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-1">Bot sẽ chạy mỗi X phút</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số bài viết tối đa mỗi lần crawl
              </label>
              <input
                type="number"
                defaultValue={50}
                min={1}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Save size={20} className="mr-2" />
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
}
