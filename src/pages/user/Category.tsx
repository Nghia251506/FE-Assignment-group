import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { fetchPosts } from "../../redux/slices/postSlice";
import type { Post, Category } from "../../types/models";

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

// fallback map nếu user gõ tay slug cũ kiểu "sports", "business"...
const fallbackCategoryMap: { [key: string]: string } = {
  technology: "Công Nghệ",
  business: "Kinh Doanh",
  entertainment: "Giải Trí",
  sports: "Thể Thao",
  world: "Thế Giới",
};

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { items: posts, loading } = useAppSelector(
    (state: RootState) => state.post
  );
  const { items: categories } = useAppSelector(
    (state: RootState) => state.category
  );

  // 🔥 lấy category từ store theo slug hoặc id
  const currentCategory: Category | undefined = useMemo(() => {
    if (!id) return undefined;
    return categories.find(
      (c) => c.code === id || String(c.id) === String(id)
    );
  }, [categories, id]);

  const currentCategoryName =
    currentCategory?.name || (id ? fallbackCategoryMap[id] : undefined);

  const categoryName = currentCategoryName || "Danh Mục";

  // 🔥 mỗi khi vào /category/:id (hoặc đổi id) thì đảm bảo đã có posts
  useEffect(() => {
    dispatch(
      fetchPosts({
        page: 0,
        size: 200,
      }) as any
    );
  }, [dispatch, id]);

  // 🔥 lọc bài theo category: ưu tiên categoryId, fallback theo categoryName
  const categoryPosts: Post[] = useMemo(() => {
    const list = Array.isArray(posts) ? posts : [];
    const base = list.filter((p) => p.status === "published");

    if (!currentCategory && !currentCategoryName) {
      return base;
    }

    return base.filter((p) => {
      const byId =
        currentCategory && p.categoryId === currentCategory.id;
      const byName =
        currentCategoryName &&
        p.categoryName &&
        p.categoryName.trim().toLowerCase() ===
          currentCategoryName.trim().toLowerCase();

      return byId || byName;
    });
  }, [posts, currentCategory, currentCategoryName]);

  // helper: build link detail (id OR slug)
  const getDetailLink = (p: Post) => `/article/${p.slug || p.id}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          {categoryName}
        </h1>
        <p className="text-slate-600">
          Khám phá các bài viết mới nhất về {categoryName.toLowerCase()}
        </p>
      </div>

      {loading && !categoryPosts.length ? (
        // skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="h-48 bg-slate-200" />
              <div className="p-5">
                <div className="h-5 w-3/4 bg-slate-100 rounded mb-2" />
                <div className="h-5 w-2/3 bg-slate-100 rounded mb-4" />
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !categoryPosts.length ? (
        <p className="text-slate-500">
          Chưa có bài viết nào trong chuyên mục này.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryPosts.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* 🔥 Thumbnail: dùng ảnh nếu có, click để vào detail */}
                <Link to={getDetailLink(article)}>
                  <div className="h-48 bg-slate-200 overflow-hidden">
                    {article.thumbnail && (
                      <img
                        src={article.thumbnail}
                        alt={article.title || "Thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                    <Link
                      to={getDetailLink(article)}
                      className="hover:text-emerald-600 transition-colors"
                    >
                      {article.title || "Không có tiêu đề"}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {article.summary ||
                      article.content?.slice(0, 150) ||
                      "Chưa có mô tả cho bài viết này."}
                  </p>
                  <div className="flex items-center text-xs text-slate-500 space-x-3">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatTimeAgo(
                        article.publishedAt || article.createdAt
                      )}
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {article.viewCount ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="flex justify-center">
              <button className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                Xem Thêm Bài Viết
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
