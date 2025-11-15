import { Clock, Eye } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { fetchPosts } from "../../redux/slices/postSlice";
import type { Post } from "../../types/models";

type UiArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  views: number;
  timeAgo: string;
  thumbnail?: string | null;
};

const categoryColors: { [key: string]: string } = {
  "Công Nghệ": "bg-blue-100 text-blue-800",
  "Kinh Doanh": "bg-emerald-100 text-emerald-800",
  "Giải Trí": "bg-purple-100 text-purple-800",
  "Thể Thao": "bg-orange-100 text-orange-800",
  "Thế Giới": "bg-red-100 text-red-800",
};

// default màu cho category lạ
const defaultCategoryClass = "bg-slate-100 text-slate-800";

const INITIAL_VISIBLE = 3; // số bài "tin mới" mặc định
const MAX_VISIBLE = 10; // khi xem thêm, tối đa bao nhiêu bài muốn show

function formatTimeAgo(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} tháng trước`;
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { items: posts, loading } = useAppSelector(
    (state: RootState) => state.post
  );

  const [expanded, setExpanded] = useState(false);

  // 🟢 Lần đầu load: lấy bài viết từ BE
  useEffect(() => {
    dispatch(
      fetchPosts({
        page: 0,
        size: 20, // đủ để có 1 bài nổi bật + nhiều bài "Tin mới nhất"
      }) as any
    );
  }, [dispatch]);

  // 🟢 Lọc các bài đã published và sort mới nhất trước
  const publishedPosts: Post[] = useMemo(() => {
    const list = Array.isArray(posts) ? posts : [];
    return [...list]
      .filter((p) => p.status === "published")
      .sort((a, b) => {
        const aDate = new Date(a.publishedAt || a.createdAt || "").getTime();
        const bDate = new Date(b.publishedAt || b.createdAt || "").getTime();
        return bDate - aDate;
      });
  }, [posts]);

  const featuredArticle: UiArticle | null = useMemo(() => {
    if (!publishedPosts.length) return null;
    const p = publishedPosts[0];
    return {
      id: p.id!,
      slug: p.slug || String(p.id), // fallback id nếu chưa có slug
      title: p.title || "Không có tiêu đề",
      excerpt:
        p.summary ||
        p.content?.slice(0, 150) ||
        "Chưa có mô tả cho bài viết này.",
      category: p.categoryName || "Tin Tức",
      views: p.viewCount ?? 0,
      timeAgo: formatTimeAgo(p.publishedAt || p.createdAt),
      thumbnail: p.thumbnail || null,
    };
  }, [publishedPosts]);

  // 🟢 Tất cả bài "Tin mới nhất" sau bài nổi bật (bắt đầu từ index 1)
  const allNewestArticles: UiArticle[] = useMemo(() => {
    if (publishedPosts.length <= 1) return [];
    return publishedPosts.slice(1).map((p) => ({
      id: p.id!,
      slug: p.slug || String(p.id),
      title: p.title || "Không có tiêu đề",
      excerpt:
        p.summary ||
        p.content?.slice(0, 150) ||
        "Chưa có mô tả cho bài viết này.",
      category: p.categoryName || "Tin Tức",
      views: p.viewCount ?? 0,
      timeAgo: formatTimeAgo(p.publishedAt || p.createdAt),
      thumbnail: p.thumbnail || null,
    }));
  }, [publishedPosts]);

  // 🟢 Các bài đang hiển thị (3 mặc định, tối đa 10 khi "xem thêm")
  const visibleArticles: UiArticle[] = useMemo(() => {
    const max = expanded ? MAX_VISIBLE : INITIAL_VISIBLE;
    return allNewestArticles.slice(0, max);
  }, [allNewestArticles, expanded]);

  const canToggleExpand = allNewestArticles.length > INITIAL_VISIBLE;

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ==== BÀI NỔI BẬT ==== */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ảnh bên trái: dùng thumbnail nếu có, không thì block xám như cũ */}
            <div className="h-64 md:h-full bg-slate-200">
              {featuredArticle?.thumbnail && (
                <img
                  src={featuredArticle.thumbnail}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-6 flex flex-col justify-center">
              {loading && !featuredArticle ? (
                <>
                  <div className="h-5 w-24 bg-slate-100 rounded mb-3" />
                  <div className="h-6 w-3/4 bg-slate-100 rounded mb-2" />
                  <div className="h-6 w-2/3 bg-slate-100 rounded mb-4" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded mb-2" />
                </>
              ) : featuredArticle ? (
                <>
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-medium mb-3 self-start ${
                      categoryColors[featuredArticle.category] ||
                      defaultCategoryClass
                    }`}
                  >
                    {featuredArticle.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 line-clamp-3">
                    <Link
                      to={`/article/${featuredArticle.slug || featuredArticle.id}`}
                      className="hover:text-emerald-600 transition-colors"
                    >
                      {featuredArticle.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-slate-500 space-x-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {featuredArticle.timeAgo}
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      {featuredArticle.views}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-500">Chưa có bài viết nổi bật.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==== TIN MỚI NHẤT ==== */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Tin Mới Nhất
        </h2>

        {loading && !visibleArticles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="h-48 bg-slate-200" />
                <div className="p-5">
                  <div className="h-4 w-20 bg-slate-100 rounded mb-3" />
                  <div className="h-5 w-3/4 bg-slate-100 rounded mb-2" />
                  <div className="h-5 w-2/3 bg-slate-100 rounded mb-4" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !visibleArticles.length ? (
          <p className="text-slate-500">Chưa có bài viết mới.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="h-48 bg-slate-200">
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${
                      categoryColors[article.category] || defaultCategoryClass
                    }`}
                  >
                    {article.category}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                    <Link
                      to={`/article/${article.slug || article.id}`}
                      className="hover:text-emerald-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
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
        )}
      </div>

      {/* ==== NÚT XEM THÊM / THU GỌN ==== */}
      {canToggleExpand && (
        <div className="mt-12">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleToggle}
              className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            >
              {expanded ? "Thu Gọn" : "Xem Thêm Bài Viết"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
