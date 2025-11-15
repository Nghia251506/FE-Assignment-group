import { Clock, Eye } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { fetchPosts } from "../../redux/slices/postSlice";
import type { Post } from "../../types/models";

// (Các kiểu dữ liệu và hằng số của em giữ nguyên)
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

const defaultCategoryClass = "bg-slate-100 text-slate-800";

const INITIAL_VISIBLE = 3;
const MAX_VISIBLE = 10;

// (Hàm formatTimeAgo giữ nguyên)
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
  
  // --- THÊM MỚI 1: LẤY SEARCH QUERY TỪ REDUX ---
  const searchQuery = useAppSelector((state: RootState) => state.ui.searchQuery);

  const [expanded, setExpanded] = useState(false);

  // 🟢 Lần đầu load: lấy bài viết từ BE
  useEffect(() => {
    // --- THAY ĐỔI 2: PHẢI LẤY NHIỀU BÀI ĐỂ SEARCH ---
    // Cách 1 (Client-side search) yêu cầu tải hết bài về.
    // Anh tạm set size: 999 để đảm bảo lọc được
    dispatch(
      fetchPosts({
        page: 0,
        size: 999, // Phải lấy nhiều bài (hoặc tất cả)
      }) as any
    );
  }, [dispatch]);

  // --- THAY ĐỔI 3: LỌC BÀI VIẾT BẰNG CẢ SEARCH QUERY ---
  const publishedPosts: Post[] = useMemo(() => {
    const list = Array.isArray(posts) ? posts : [];
    const q = searchQuery.trim().toLowerCase();

    // 1. Lọc theo status
    const filteredByStatus = list.filter((p) => p.status === "published");

    // 2. Lọc thêm bằng search query (nếu có)
    const filteredBySearch = q
      ? filteredByStatus.filter((p) => {
          const title = p.title?.toLowerCase() || "";
          // Em có thể thêm các trường khác, ví dụ:
          // const summary = p.summary?.toLowerCase() || "";
          // return title.includes(q) || summary.includes(q);
          return title.includes(q);
        })
      : filteredByStatus; // Nếu không search, giữ nguyên
      
    // 3. Sort (giữ nguyên)
    return [...filteredBySearch]
      .sort((a, b) => {
        const aDate = new Date(a.publishedAt || a.createdAt || "").getTime();
        const bDate = new Date(b.publishedAt || b.createdAt || "").getTime();
        return bDate - aDate;
      });
  }, [posts, searchQuery]); // <-- Thêm searchQuery làm dependency

  // (Tất cả các useMemo và logic bên dưới của em đều giữ nguyên
  // vì chúng đọc từ 'publishedPosts' đã được lọc)

  const featuredArticle: UiArticle | null = useMemo(() => {
    if (!publishedPosts.length) return null;
    const p = publishedPosts[0];
    return {
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
    };
  }, [publishedPosts]);

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
      {/* ==== BÀI NỔI BẬT (HOẶC KẾT QUẢ SỐ 1) ==== */}
      {/* --- THAY ĐỔI 4: ẨN KHI ĐANG LOADING HOẶC SEARCH KHÔNG RA --- */}
      {(!loading && featuredArticle) && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="grid md:grid-cols-2 gap-6">
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
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Skeleton loading cho bài nổi bật (chỉ khi load lần đầu) */}
      {(loading && !featuredArticle) && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 md:h-full bg-slate-200" />
              <div className="p-6">
                <div className="h-5 w-24 bg-slate-100 rounded mb-3" />
                <div className="h-6 w-3/4 bg-slate-100 rounded mb-2" />
                <div className="h-6 w-2/3 bg-slate-100 rounded mb-4" />
                <div className="h-4 w-1/2 bg-slate-100 rounded mb-2" />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ==== TIN MỚI NHẤT (HOẶC KẾT QUẢ CÒN LẠI) ==== */}
      <div>
        {/* --- THAY ĐỔI 5: ĐỔI TIÊU ĐỀ KHI SEARCH --- */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {searchQuery ? `Kết quả cho "${searchQuery}"` : "Tin Mới Nhất"}
        </h2>
        
        {/* (Tạm ẩn bài nổi bật nếu đang search mà không có kết quả) */}
        {searchQuery && !featuredArticle && !visibleArticles.length && (
          <p className="text-slate-500">
            Không tìm thấy bài viết nào cho từ khóa "{searchQuery}".
          </p>
        )}

        {/* Skeleton loading (chỉ khi load lần đầu) */}
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
        // --- THAY ĐỔI 6: SỬA LẠI THÔNG BÁO "KHÔNG CÓ BÀI" ---
        ) : !visibleArticles.length && !featuredArticle ? (
          <p className="text-slate-500">
            {searchQuery
              ? `Không tìm thấy bài viết nào.`
              : "Chưa có bài viết mới."}
          </p>
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