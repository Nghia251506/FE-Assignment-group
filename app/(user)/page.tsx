'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryApi, Category } from '@/services/CategoryService'; // Import API từ service
import { postService } from '@/services/postService'; // Import API post từ service
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, Eye } from 'lucide-react';

// State để lưu trữ dữ liệu bài viết và danh mục
const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Lưu danh mục
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]); // Lưu bài nổi bật (bài viết này sẽ có kiểu any vì cấu trúc của API có thể thay đổi)
  const [latestArticles, setLatestArticles] = useState<any[]>([]); // Lưu bài mới nhất
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch categories và bài viết khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories từ API
        const categoriesResponse = await categoryApi.getByTenant(1);
        setCategories(categoriesResponse.data);

        // Fetch bài viết nổi bật và mới nhất từ API
        const featuredResponse = await postService.getPage({ page: 0, size: 5 }); // Get top 5 bài viết nổi bật
        setFeaturedArticles(featuredResponse.content);

        const latestResponse = await postService.getPage({ page: 0, size: 5, status: 'published' }); // Get 5 bài viết mới nhất
        setLatestArticles(latestResponse.content);
      } catch (err) {
        setError('Không thể tải dữ liệu'); // Xử lý lỗi nếu có
      } finally {
        setLoading(false); // Set loading false sau khi API gọi xong
      }
    };

    fetchData(); // Gọi API
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Tin nổi bật</h2>
          <Button variant="ghost" asChild>
            <Link href="/trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Xem thêm
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.thumbnail}
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
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin mới nhất</h2>
          <div className="space-y-4">
            {latestArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.publishedAt}
                    </span>
                  </div>
                  <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                    <Link href={`/article/${article.id}`}>{article.title}</Link>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild>
              <Link href="/articles">Xem tất cả bài viết</Link>
            </Button>
          </div>
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <Badge variant="secondary">{category.articleCount}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
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
};

export default HomePage;
