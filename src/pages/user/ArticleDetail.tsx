import { Clock, Eye, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

export default function ArticleDetail() {
  const article = {
    id: 1,
    title: 'Công nghệ AI đang thay đổi ngành công nghiệp như thế nào trong năm 2024',
    category: 'Công Nghệ',
    views: 1234,
    timeAgo: '2 giờ trước',
    publishedDate: '15/01/2024',
    content: `
      <p>Trí tuệ nhân tạo (AI) đang trở thành một trong những công nghệ đột phá nhất của thế kỷ 21,
      mang lại những thay đổi sâu sắc trong nhiều ngành công nghiệp khác nhau.</p>

      <p>Từ y tế, giáo dục, sản xuất cho đến dịch vụ khách hàng, AI đang góp phần tối ưu hóa quy trình,
      nâng cao hiệu quả và tạo ra những giá trị mới chưa từng có.</p>

      <h2>Ứng dụng AI trong Y tế</h2>
      <p>Trong lĩnh vực y tế, AI đang giúp các bác sĩ chẩn đoán bệnh chính xác hơn thông qua phân tích
      hình ảnh y khoa và dữ liệu bệnh nhân. Các thuật toán máy học có thể phát hiện các dấu hiệu bệnh
      sớm mà mắt thường khó nhận ra.</p>

      <h2>AI trong Giáo dục</h2>
      <p>Giáo dục cũng đang được cách mạng hóa với sự xuất hiện của các hệ thống học tập thích ứng,
      giúp cá nhân hóa trải nghiệm học tập cho từng học sinh dựa trên khả năng và tiến độ của họ.</p>

      <h2>Tương lai của AI</h2>
      <p>Với tốc độ phát triển hiện tại, AI hứa hẹn sẽ mang lại nhiều đột phá hơn nữa trong tương lai,
      đồng thời cũng đặt ra những thách thức về đạo đức và quy định cần được giải quyết.</p>
    `,
  };

  const relatedArticles = [
    {
      id: 2,
      title: 'Machine Learning cơ bản cho người mới bắt đầu',
      category: 'Công Nghệ',
      timeAgo: '1 ngày trước',
    },
    {
      id: 3,
      title: 'Top 10 công cụ AI hữu ích nhất năm 2024',
      category: 'Công Nghệ',
      timeAgo: '2 ngày trước',
    },
    {
      id: 4,
      title: 'ChatGPT và tương lai của giao tiếp con người - máy',
      category: 'Công Nghệ',
      timeAgo: '3 ngày trước',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-96 bg-slate-200"></div>

        <div className="p-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-slate-600 mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center mr-6 mb-2">
              <Clock size={16} className="mr-2" />
              {article.publishedDate}
            </div>
            <div className="flex items-center mr-6 mb-2">
              <Eye size={16} className="mr-2" />
              {article.views} lượt xem
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-8 pb-8 border-b border-slate-200">
            <span className="text-sm font-medium text-slate-700">Chia sẻ:</span>
            <button className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Facebook size={18} className="mr-2" />
              Facebook
            </button>
            <button className="flex items-center px-3 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors">
              <Twitter size={18} className="mr-2" />
              Twitter
            </button>
            <button className="flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <LinkIcon size={18} className="mr-2" />
              Copy
            </button>
          </div>

          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Bài Viết Liên Quan</h2>
        <div className="space-y-4">
          {relatedArticles.map((related) => (
            <div
              key={related.id}
              className="flex items-start p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-24 h-24 bg-slate-200 rounded flex-shrink-0"></div>
              <div className="ml-4 flex-1">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium mb-2">
                  {related.category}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">
                  {related.title}
                </h3>
                <p className="text-xs text-slate-600">{related.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
