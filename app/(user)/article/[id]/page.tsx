import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Eye } from 'lucide-react';
import ShareButtons from '@/components/article/ShareButtons';

const article = {
  id: 1,
  title: 'Khám phá công nghệ AI mới nhất năm 2025',
  description: 'Những tiến bộ vượt bậc trong lĩnh vực trí tuệ nhân tạo đang thay đổi cách chúng ta sống và làm việc.',
  content: `
    <p>Trí tuệ nhân tạo (AI) đang trải qua một giai đoạn phát triển vượt bậc, mở ra những cơ hội to lớn cho nhiều lĩnh vực khác nhau. Từ y tế, giáo dục đến kinh doanh, AI đang dần trở thành một phần không thể thiếu trong cuộc sống hiện đại.</p>

    <h2>Các ứng dụng nổi bật</h2>
    <p>Trong năm 2025, chúng ta đã chứng kiến sự ra đời của nhiều ứng dụng AI đột phá. Các hệ thống AI hiện đại không chỉ có khả năng xử lý và phân tích dữ liệu với tốc độ cực nhanh, mà còn có thể học hỏi và cải thiện hiệu suất theo thời gian.</p>

    <h2>Tác động đến xã hội</h2>
    <p>Sự phát triển của AI cũng đặt ra nhiều câu hỏi về đạo đức và trách nhiệm xã hội. Các chuyên gia đang tích cực thảo luận về cách đảm bảo AI được phát triển và sử dụng một cách có trách nhiệm, vì lợi ích chung của nhân loại.</p>

    <h2>Tương lai của AI</h2>
    <p>Nhìn về tương lai, AI hứa hẹn sẽ mang lại nhiều đổi mới hơn nữa. Với sự đầu tư mạnh mẽ từ các công ty công nghệ hàng đầu và sự quan tâm của chính phủ các quốc gia, AI chắc chắn sẽ tiếp tục là một trong những lĩnh vực phát triển nhanh nhất trong thập kỷ tới.</p>
  `,
  category: 'Công nghệ',
  tags: ['AI', 'Công nghệ', 'Tương lai', 'Đổi mới'],
  image: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=1200',
  publishedAt: '2 giờ trước',
  views: 1234,
  source: 'TechNews',
  author: 'Nguyễn Văn A',
};

const relatedArticles = [
  {
    id: 2,
    title: 'Machine Learning và ứng dụng thực tế',
    category: 'Công nghệ',
    publishedAt: '1 ngày trước',
  },
  {
    id: 3,
    title: 'Tương lai của tự động hóa trong doanh nghiệp',
    category: 'Kinh doanh',
    publishedAt: '2 ngày trước',
  },
  {
    id: 4,
    title: 'ChatGPT và cuộc cách mạng AI',
    category: 'Công nghệ',
    publishedAt: '3 ngày trước',
  },
];

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-3">{article.category}</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{article.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-4">
                <span>Tác giả: <span className="font-medium text-gray-700">{article.author}</span></span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views} lượt xem
                </span>
              </div>
            </div>

            <div className="mb-6">
              <ShareButtons />
            </div>
          </div>

          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <Separator className="my-8" />

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-sm font-medium text-gray-700">Tags:</span>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Nguồn: <span className="font-medium text-gray-900">{article.source}</span>
            </p>
          </div>
        </article>

        <aside>
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Bài viết liên quan</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/article/${relatedArticle.id}`}
                    className="block group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge variant="outline" className="text-xs">
                        {relatedArticle.category}
                      </Badge>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {relatedArticle.publishedAt}
                      </span>
                    </div>
                    <Separator className="mt-4" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quảng cáo</h3>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <p className="text-white font-semibold">Banner 300x300</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
