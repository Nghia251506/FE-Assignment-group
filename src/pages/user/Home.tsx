import { Clock, Eye } from 'lucide-react';

export default function Home() {
  const featuredArticle = {
    id: 1,
    title: 'Công nghệ AI đang thay đổi ngành công nghiệp như thế nào trong năm 2024',
    excerpt: 'Trí tuệ nhân tạo đang mang lại những thay đổi đột phá trong nhiều lĩnh vực, từ y tế, giáo dục đến sản xuất và dịch vụ...',
    category: 'Công Nghệ',
    views: 1234,
    timeAgo: '2 giờ trước',
  };

  const articles = [
    {
      id: 2,
      title: 'Thị trường chứng khoán biến động mạnh trong tuần qua',
      excerpt: 'Chỉ số VN-Index có những biến động đáng chú ý với nhiều phiên tăng giảm điểm...',
      category: 'Kinh Doanh',
      views: 856,
      timeAgo: '3 giờ trước',
    },
    {
      id: 3,
      title: 'Xu hướng thời trang xuân hè 2024',
      excerpt: 'Các nhà thiết kế hàng đầu đang mang đến những xu hướng mới cho mùa xuân hè...',
      category: 'Giải Trí',
      views: 2341,
      timeAgo: '4 giờ trước',
    },
    {
      id: 4,
      title: 'Đội tuyển bóng đá Việt Nam chuẩn bị cho trận đấu quan trọng',
      excerpt: 'HLV và các cầu thủ đang tập luyện chăm chỉ để chuẩn bị cho trận đấu...',
      category: 'Thể Thao',
      views: 1567,
      timeAgo: '5 giờ trước',
    },
    {
      id: 5,
      title: 'Tình hình chính trị quốc tế tuần này',
      excerpt: 'Các sự kiện chính trị quan trọng diễn ra trên thế giới trong tuần qua...',
      category: 'Thế Giới',
      views: 989,
      timeAgo: '6 giờ trước',
    },
  ];

  const categoryColors: { [key: string]: string } = {
    'Công Nghệ': 'bg-blue-100 text-blue-800',
    'Kinh Doanh': 'bg-emerald-100 text-emerald-800',
    'Giải Trí': 'bg-purple-100 text-purple-800',
    'Thể Thao': 'bg-orange-100 text-orange-800',
    'Thế Giới': 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 md:h-full bg-slate-200"></div>
            <div className="p-6 flex flex-col justify-center">
              <span
                className={`inline-block px-3 py-1 rounded text-xs font-medium mb-3 self-start ${
                  categoryColors[featuredArticle.category]
                }`}
              >
                {featuredArticle.category}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 line-clamp-3">
                {featuredArticle.title}
              </h2>
              <p className="text-slate-600 mb-4 line-clamp-3">{featuredArticle.excerpt}</p>
              <div className="flex items-center text-sm text-slate-500 space-x-4">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {featuredArticle.timeAgo}
                </div>
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  {featuredArticle.views}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Tin Mới Nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="h-48 bg-slate-200"></div>
              <div className="p-5">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${
                    categoryColors[article.category]
                  }`}
                >
                  {article.category}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center text-xs text-slate-500 space-x-3">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {article.timeAgo}
                  </div>
                  <div className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    {article.views}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
            Xem Thêm Bài Viết
          </button>
        </div>
      </div>
    </div>
  );
}
