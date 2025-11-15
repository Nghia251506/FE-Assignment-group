// src/layouts/UserLayout.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { Globe, Search, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks"; // chỉnh lại đường dẫn nếu cần
import type { RootState } from "../../redux/store";
import { fetchCategories } from "../../redux/slices/categorySlice";
import type { Category } from "../../types/models";

const DEFAULT_TENANT_ID = 1;

export default function UserLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useAppDispatch();
  const {
    items: categories,
    loading: categoryLoading,
  } = useAppSelector((state: RootState) => state.category);

  // 🔥 Lấy category từ BE theo tenantId = 1
  useEffect(() => {
    dispatch(fetchCategories(DEFAULT_TENANT_ID) as any);
  }, [dispatch]);

  const buildCategoryPath = (c: Category) =>
    `/category/${c.slug ?? c.id}`;

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Globe className="h-8 w-8 text-emerald-600" />
              <span className="ml-3 text-xl font-bold text-slate-900">
                NewsHub
              </span>
            </Link>

            <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* NAVBAR DESKTOP */}
          <nav className="hidden md:flex items-center space-x-1 pb-3">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActivePath("/")
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Trang Chủ
            </Link>

            {categoryLoading && !categories.length ? (
              <span className="px-4 py-2 text-xs text-slate-400">
                Đang tải chuyên mục...
              </span>
            ) : !categories.length ? (
              <span className="px-4 py-2 text-xs text-slate-400">
                Chưa có chuyên mục
              </span>
            ) : (
              categories.map((category) => {
                const path = buildCategoryPath(category);
                const active = isActivePath(path);
                return (
                  <Link
                    key={category.id}
                    to={path}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })
            )}
          </nav>
        </div>

        {/* NAVBAR MOBILE */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3">
            <div className="px-4 mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
            </div>
            <nav className="space-y-1 px-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-md ${
                  isActivePath("/")
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Trang Chủ
              </Link>

              {categoryLoading && !categories.length ? (
                <span className="block px-4 py-2 text-xs text-slate-400">
                  Đang tải chuyên mục...
                </span>
              ) : !categories.length ? (
                <span className="block px-4 py-2 text-xs text-slate-400">
                  Chưa có chuyên mục
                </span>
              ) : (
                categories.map((category) => {
                  const path = buildCategoryPath(category);
                  const active = isActivePath(path);
                  return (
                    <Link
                      key={category.id}
                      to={path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2 text-sm font-medium rounded-md ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {category.name}
                    </Link>
                  );
                })
              )}
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Globe className="h-6 w-6 text-emerald-600" />
              <span className="ml-2 text-lg font-semibold text-slate-900">
                NewsHub
              </span>
            </div>
            <p className="text-sm text-slate-600">
              © 2024 NewsHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
