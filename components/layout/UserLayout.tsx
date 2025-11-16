'use client'
import Link from 'next/link';
import { Search, Menu, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NewsHub</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Trang chủ
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Danh mục
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Tìm kiếm
              </Link>
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                <Link href="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="/categories"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Danh mục
                </Link>
                <Link
                  href="/search"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tìm kiếm
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold text-white">NewsHub</span>
              </div>
              <p className="text-sm text-gray-400">
                Nền tảng tổng hợp tin tức tự động, cung cấp thông tin nhanh chóng và chính xác từ nhiều nguồn uy tín.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Danh mục</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/category/technology" className="hover:text-white transition-colors">
                    Công nghệ
                  </Link>
                </li>
                <li>
                  <Link href="/category/business" className="hover:text-white transition-colors">
                    Kinh doanh
                  </Link>
                </li>
                <li>
                  <Link href="/category/entertainment" className="hover:text-white transition-colors">
                    Giải trí
                  </Link>
                </li>
                <li>
                  <Link href="/category/sports" className="hover:text-white transition-colors">
                    Thể thao
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Liên kết</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Kết nối với chúng tôi</h3>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="mailto:contact@newshub.com"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} NewsHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
