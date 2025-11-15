// src/pages/client/ArticleDetail.tsx
import {
  Clock,
  Eye,
  Share2,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { fetchPosts } from "../../redux/slices/postSlice";
import type { Post } from "../../types/models";

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

function formatDateDDMMYYYY(dateString?: string | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function ArticleDetail() {
  // ✅ route: /article/:idOrSlug → nhận cả id hoặc slug
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const dispatch = useAppDispatch();

  const { items: posts, loading } = useAppSelector(
    (state: RootState) => state.post
  );

  // Đảm bảo có dữ liệu posts (F5 trực tiếp trang detail vẫn load được)
  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(
        fetchPosts({
          page: 0,
          size: 200, // lấy rộng 1 chút để có bài + related
        }) as any
      );
    }
  }, [dispatch, posts]);

  // 🔥 Tìm bài hiện tại theo id HOẶC slug
  const article: Post | undefined = useMemo(() => {
    if (!idOrSlug) return undefined;
    const list = Array.isArray(posts) ? posts : [];

    // Thử tìm theo id (nếu idOrSlug là số)
    const numericId = Number(idOrSlug);
    let found: Post | undefined;
    if (!Number.isNaN(numericId)) {
      found = list.find((p) => p.id === numericId);
    }

    if (found) return found;

    // Fallback: tìm theo slug
    return list.find((p) => p.slug === idOrSlug);
  }, [posts, idOrSlug]);

  // Related: cùng category, published, khác id
  const relatedArticles: Post[] = useMemo(() => {
    if (!article) return [];
    const list = Array.isArray(posts) ? posts : [];
    return list
      .filter(
        (p) =>
          p.id !== article.id &&
          p.status === "published" &&
          p.categoryId === article.categoryId
      )
      .sort((a, b) => {
        const aDate = new Date(a.publishedAt || a.createdAt || "").getTime();
        const bDate = new Date(b.publishedAt || b.createdAt || "").getTime();
        return bDate - aDate;
      })
      .slice(0, 3);
  }, [posts, article]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (e) {
      console.error(e);
    }
  };

  const contentHtml = article?.content || "";

  if (loading && !article) {
    // skeleton khi đang load mà chưa có bài
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-96 bg-slate-200"></div>
          <div className="p-8">
            <div className="mb-4">
              <div className="h-6 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-8 w-3/4 bg-slate-100 rounded mb-4" />
            <div className="flex flex-wrap items-center text-sm text-slate-600 mb-6 pb-6 border-b border-slate-200">
              <div className="h-4 w-32 bg-slate-100 rounded mr-6 mb-2" />
              <div className="h-4 w-32 bg-slate-100 rounded mb-2" />
            </div>
            <div className="h-4 w-full bg-slate-100 rounded mb-2" />
            <div className="h-4 w-5/6 bg-slate-100 rounded mb-2" />
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
          </div>
        </article>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Không tìm thấy bài viết
          </h1>
          <p className="text-slate-600">
            Có thể bài viết đã bị xoá hoặc đường dẫn không chính xác.
          </p>
        </div>
      </div>
    );
  }

  const categoryLabel = article.categoryName || "Tin Tức";
  const publishedDate =
    formatDateDDMMYYYY(article.publishedAt || article.createdAt) ||
    "Chưa rõ ngày";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ===== BÀI VIẾT CHÍNH ===== */}
      <article className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
        {/* Thumbnail làm cover */}
        <div className="h-96 bg-slate-200">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title || "Thumbnail"}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div className="p-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
              {categoryLabel}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {article.title || "Không có tiêu đề"}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-slate-600 mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center mr-6 mb-2">
              <Clock size={16} className="mr-2" />
              {publishedDate}
            </div>
            <div className="flex items-center mr-6 mb-2">
              <Eye size={16} className="mr-2" />
              {article.viewCount ?? 0} lượt xem
            </div>
            <div className="flex items-center mb-2">
              <span className="text-slate-500 mr-1">Nguồn:</span>
              <span className="font-medium text-slate-700">
                {article.baseUrl || "Không rõ"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-8 pb-8 border-b border-slate-200">
            <span className="text-sm font-medium text-slate-700 flex items-center">
              <Share2 size={16} className="mr-2" />
              Chia sẻ:
            </span>
            <button className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Facebook size={18} className="mr-2" />
              Facebook
            </button>
            <button className="flex items-center px-3 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors">
              <Twitter size={18} className="mr-2" />
              Twitter
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <LinkIcon size={18} className="mr-2" />
              Copy
            </button>
          </div>

          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </article>

      {/* ===== BÀI VIẾT LIÊN QUAN ===== */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Bài Viết Liên Quan
        </h2>
        {relatedArticles.length === 0 ? (
          <p className="text-sm text-slate-500">
            Chưa có bài viết liên quan.
          </p>
        ) : (
          <div className="space-y-4">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                to={`/article/${related.slug || related.id}`}
                className="flex items-start p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-24 h-24 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                  {related.thumbnail && (
                    <img
                      src={related.thumbnail}
                      alt={related.title || "Thumbnail"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium mb-2">
                    {related.categoryName || categoryLabel}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">
                    {related.title || "Không có tiêu đề"}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {formatTimeAgo(related.publishedAt || related.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
