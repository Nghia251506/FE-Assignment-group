'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryApi } from '@/services/CategoryService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper } from 'lucide-react';

interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  color: string;
}

const CategoriesPage = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Gọi service từ Spring Boot
        const response = await categoryApi.getByTenant(1);
        setItems(response.data);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        
        // Xử lý error message từ Axios
        const errorMessage = err.response?.data?.message 
          || err.message 
          || 'Không thể kết nối đến server';
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  console.log("đã vào đây");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh mục...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">Có lỗi xảy ra</p>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">Chưa có danh mục nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Danh mục</h1>
        <p className="text-lg text-gray-600">
          Khám phá tin tức theo các chủ đề bạn quan tâm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((category) => {
          return (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color || 'from-blue-500 to-blue-600'} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Newspaper className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {category.articleCount} bài viết
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;