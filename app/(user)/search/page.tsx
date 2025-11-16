'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, Eye, Filter, X } from 'lucide-react';

const searchResults = [
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
    title: 'Machine Learning trong doanh nghiệp hiện đại',
    description: 'Cách các công ty đang áp dụng ML để tối ưu hóa quy trình kinh doanh.',
    category: 'Công nghệ',
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '5 giờ trước',
    views: 892,
  },
  {
    id: 3,
    title: 'Blockchain và tương lai của tài chính',
    description: 'Công nghệ blockchain đang tạo ra cuộc cách mạng trong ngành tài chính toàn cầu.',
    category: 'Kinh doanh',
    image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600',
    publishedAt: '8 giờ trước',
    views: 756,
  },
];

const popularTags = [
  'AI', 'Công nghệ', 'Kinh doanh', 'Startup', 'Blockchain',
  'Machine Learning', 'Đầu tư', 'Thị trường', 'Innovation'
];

const trendingSearches = [
  'Trí tuệ nhân tạo',
  'Bitcoin',
  'Startup Việt Nam',
  'Chứng khoán',
  'Công nghệ 5G',
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Tìm kiếm</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </div>
        </form>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Lọc theo tags
            </h3>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="articles">Bài viết</TabsTrigger>
            <TabsTrigger value="categories">Danh mục</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <p className="text-sm text-gray-600 mb-6">
                  Tìm thấy {searchResults.length} kết quả
                </p>

                <div className="space-y-6">
                  {searchResults.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="aspect-video md:aspect-square overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardHeader className="md:col-span-2">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{article.category}</Badge>
                          </div>
                          <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
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
                  <Button variant="outline">Xem thêm kết quả</Button>
                </div>
              </div>

              <aside>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Tìm kiếm phổ biến</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {trendingSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                          <span className="text-lg font-bold text-gray-300 mr-3">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700 hover:text-blue-600">
                            {search}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quảng cáo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
                      <p className="text-white font-semibold">Banner 300x300</p>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <p className="text-sm text-gray-600 mb-6">
              Hiển thị bài viết phù hợp với tìm kiếm
            </p>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <p className="text-sm text-gray-600 mb-6">
              Hiển thị danh mục phù hợp với tìm kiếm
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
