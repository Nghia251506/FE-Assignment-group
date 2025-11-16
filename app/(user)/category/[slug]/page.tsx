import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Eye, ArrowLeft } from 'lucide-react';

const categoryData = {
  technology: {
    name: 'Công nghệ',
    description: 'Tin tức về công nghệ, khoa học, AI và đổi mới sáng tạo',
  },
  business: {
    name: 'Kinh doanh',
    description: 'Thông tin về thị trường, đầu tư và khởi nghiệp',
  },
  sports: {
    name: 'Thể thao',
    description: 'Tin tức thể thao trong nước và quốc tế',
  },
};

const articles = [
  {
    id: 1,
    title: 'Khám phá công nghệ AI mới nhất năm 2025',
    description: 'Những tiến bộ vượt bậc trong lĩnh vực trí tuệ nhân tạo đang thay đổi cách chúng ta sống và làm việc.',
    image: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '2 giờ trước',
    views: 1234,
    featured: true,
  },
  {
    id: 2,
    title: 'Machine Learning trong doanh nghiệp hiện đại',
    description: 'Cách các công ty đang áp dụng ML để tối ưu hóa quy trình kinh doanh.',
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '5 giờ trước',
    views: 892,
    featured: false,
  },
  {
    id: 3,
    title: 'Blockchain và tương lai của tài chính',
    description: 'Công nghệ blockchain đang tạo ra cuộc cách mạng trong ngành tài chính toàn cầu.',
    image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '8 giờ trước',
    views: 756,
    featured: false,
  },
  {
    id: 4,
    title: 'Internet of Things: Kết nối mọi vật',
    description: 'IoT đang thay đổi cách chúng ta tương tác với thế giới xung quanh.',
    image: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '1 ngày trước',
    views: 654,
    featured: false,
  },
  {
    id: 5,
    title: '5G và cuộc cách mạng kết nối',
    description: 'Công nghệ 5G mở ra kỷ nguyên mới cho internet di động.',
    image: 'https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '1 ngày trước',
    views: 543,
    featured: false,
  },
  {
    id: 6,
    title: 'Cybersecurity: Bảo vệ dữ liệu trong kỷ nguyên số',
    description: 'Những thách thức và giải pháp bảo mật thông tin trong thời đại số hóa.',
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '2 ngày trước',
    views: 432,
    featured: false,
  },
];

export function generateStaticParams() {
  return [
    { slug: 'technology' },
    { slug: 'business' },
    { slug: 'sports' },
    { slug: 'entertainment' },
    { slug: 'lifestyle' },
    { slug: 'travel' },
  ];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const category = categoryData[slug as keyof typeof categoryData] || {
    name: 'Danh mục',
    description: 'Tin tức theo danh mục',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh mục
          </Link>
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{category.description}</p>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Hiển thị {articles.length} bài viết</p>
          <Select defaultValue="latest">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Mới nhất</SelectItem>
              <SelectItem value="popular">Phổ biến</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {articles.map((article, index) => (
              <Card key={article.id} className={`overflow-hidden hover:shadow-lg transition-shadow group ${index === 0 ? 'lg:col-span-2' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`${index === 0 ? 'md:col-span-1' : 'md:col-span-1'} aspect-video md:aspect-square overflow-hidden`}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className={index === 0 ? 'md:col-span-2' : 'md:col-span-2'}>
                    {article.featured && (
                      <Badge variant="default" className="w-fit mb-2">
                        Nổi bật
                      </Badge>
                    )}
                    <CardTitle className={`group-hover:text-blue-600 transition-colors ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                      <Link href={`/article/${article.id}`}>{article.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {article.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 pt-2">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.publishedAt}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.views}
                      </span>
                    </div>
                  </CardHeader>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline">Xem thêm bài viết</Button>
          </div>
        </div>

        <aside>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bài viết phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles.slice(0, 5).map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="block group"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-600 transition-colors">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.views}
                        </div>
                      </div>
                    </div>
                    {index < 4 && <div className="h-px bg-gray-200 mt-4" />}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quảng cáo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <p className="text-white font-semibold">Banner 300x300</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
