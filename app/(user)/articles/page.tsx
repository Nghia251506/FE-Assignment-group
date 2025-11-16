'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Eye } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Khám phá công nghệ AI mới nhất năm 2025',
    description: 'Những tiến bộ vượt bậc trong lĩnh vực trí tuệ nhân tạo đang thay đổi cách chúng ta sống và làm việc.',
    category: 'Công nghệ',
    image: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '2 giờ trước',
    views: 1234,
  },
  {
    id: 2,
    title: 'Thị trường chứng khoán biến động mạnh',
    description: 'Các nhà đầu tư đang theo dõi sát sao diễn biến kinh tế toàn cầu trong bối cảnh bất ổn.',
    category: 'Kinh doanh',
    image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '4 giờ trước',
    views: 892,
  },
  {
    id: 3,
    title: 'World Cup 2026: Những ứng viên sáng giá',
    description: 'Phân tích sức mạnh của các đội tuyển hàng đầu trước thềm giải đấu lớn nhất hành tinh.',
    category: 'Thể thao',
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '6 giờ trước',
    views: 2341,
  },
  {
    id: 4,
    title: 'Xu hướng thiết kế nội thất 2025',
    description: 'Các phong cách thiết kế đang được ưa chuộng trong năm nay.',
    category: 'Lifestyle',
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '8 giờ trước',
    views: 654,
  },
  {
    id: 5,
    title: 'Điện thoại flagship mới ra mắt',
    description: 'Những chiếc smartphone cao cấp nhất vừa được công bố với nhiều tính năng đột phá.',
    category: 'Công nghệ',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '10 giờ trước',
    views: 987,
  },
  {
    id: 6,
    title: 'Phim bom tấn sắp công chiếu',
    description: 'Những bộ phim được mong đợi nhất trong mùa hè này.',
    category: 'Giải trí',
    image: 'https://images.pexels.com/photos/4668513/pexels-photo-4668513.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '12 giờ trước',
    views: 1567,
  },
  {
    id: 7,
    title: 'Bí quyết khởi nghiệp thành công',
    description: 'Những bài học quý báu từ các doanh nhân thành đạt.',
    category: 'Kinh doanh',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '14 giờ trước',
    views: 765,
  },
  {
    id: 8,
    title: 'Du lịch Việt Nam hậu đại dịch',
    description: 'Ngành du lịch Việt Nam đang phục hồi mạnh mẽ với nhiều điểm đến hấp dẫn.',
    category: 'Du lịch',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '16 giờ trước',
    views: 432,
  },
  {
    id: 9,
    title: 'Giáo dục trực tuyến: Xu hướng tất yếu',
    description: 'Học trực tuyến đang trở thành lựa chọn phổ biến của nhiều người.',
    category: 'Giáo dục',
    image: 'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '18 giờ trước',
    views: 543,
  },
];

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tất cả bài viết</h1>
        <p className="text-lg text-gray-600 mb-6">
          Khám phá các bài viết mới nhất từ nhiều lĩnh vực khác nhau
        </p>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-video overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{article.category}</Badge>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.publishedAt}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {article.views}
                  </span>
                </div>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                <Link href={`/article/${article.id}`}>{article.title}</Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">{article.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button size="lg">Xem thêm bài viết</Button>
      </div>
    </div>
  );
}
