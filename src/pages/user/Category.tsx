import { useParams } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

export default function Category() {
  const { id } = useParams();

  const categoryMap: { [key: string]: string } = {
    technology: 'Công Nghệ',
    business: 'Kinh Doanh',
    entertainment: 'Giải Trí',
    sports: 'Thể Thao',
    world: 'Thế Giới',
  };

  const categoryName = categoryMap[id || 'technology'] || 'Danh Mục';

  const articles = [
    {
      id: 1,
      title: 'Công nghệ AI đang thay đổi ngành công nghiệp như thế nào',
      excerpt: 'Trí tuệ nhân tạo đang mang lại những thay đổi đột phá trong nhiều lĩnh vực...',
      views: 1234,
      timeAgo: '2 giờ trước',
    },
    {
      id: 2,
      title: 'Các xu hướng công nghệ nổi bật năm 2024',
      excerpt: 'Những công nghệ mới nào sẽ định hình tương lai trong năm nay...',
      views: 856,
      timeAgo: '3 giờ trước',
    },
    {
      id: 3,
      title: 'Cloud Computing và tác động đến doanh nghiệp',
      excerpt: 'Điện toán đám mây đang trở thành xu hướng tất yếu cho mọi doanh nghiệp...',
      views: 2341,
      timeAgo: '5 giờ trước',
    },
    {
      id: 4,
      title: 'Blockchain không chỉ là cryptocurrency',
      excerpt: 'Công nghệ blockchain đang được ứng dụng trong nhiều lĩnh vực khác nhau...',
      views: 1567,
      timeAgo: '6 giờ trước',
    },
    {
      id: 5,
      title: 'Internet of Things (IoT) trong cuộc sống hàng ngày',
      excerpt: 'Các thiết bị IoT đang dần trở thành một phần không thể thiếu...',
      views: 989,
      timeAgo: '8 giờ trước',
    },
    {
      id: 6,
      title: 'Bảo mật thông tin trong kỷ nguyên số',
      excerpt: 'Làm thế nào để bảo vệ dữ liệu cá nhân trong thời đại công nghệ...',
      views: 1123,
      timeAgo: '10 giờ trước',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{categoryName}</h1>
        <p className="text-slate-600">Khám phá các bài viết mới nhất về {categoryName.toLowerCase()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="h-48 bg-slate-200"></div>
            <div className="p-5">
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
