import {
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import {
  fetchPosts,
  publishPost,
  deletePost,
  generatePost
} from "../../redux/slices/postSlice";
import type { Post } from "../../types/models";
import { toast } from "react-toastify";

function getStatusLabel(status?: string) {
  switch (status) {
    case "published":
      return "Đã duyệt";
    case "pending":
      return "Chờ duyệt";
    case "draft":
      return "Bản nháp";
    case "removed":
      return "Đã xoá";
    default:
      return "Không rõ";
  }
}

function getStatusClasses(status?: string) {
  switch (status) {
    case "published":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "draft":
      return "bg-slate-100 text-slate-700";
    case "removed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const PAGE_SIZE = 5; // ✅ số bài / trang, anh muốn đổi thì sửa số này

export default function Articles() {
  const dispatch = useAppDispatch();
  const { items: posts, loading } = useAppSelector(
    (state: RootState) => state.post
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");

  // ✅ state phân trang
  const [currentPage, setCurrentPage] = useState(1);

  // load posts lần đầu
  useEffect(() => {
    dispatch(
      fetchPosts({
        page: 0,
        size: 1000,
      }) as any
    );
  }, [dispatch]);

  // filter client theo search + status
  const filteredArticles = useMemo(() => {
    const list = Array.isArray(posts) ? posts : [];
    const q = searchQuery.trim().toLowerCase();

    return list.filter((p) => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (!q) return true;

      const title = p.title?.toLowerCase() || "";
      const categoryName = p.category?.name?.toLowerCase() || "";
      const sourceName = p.source?.name?.toLowerCase() || "";

      return (
        title.includes(q) ||
        categoryName.includes(q) ||
        sourceName.includes(q)
      );
    });
  }, [posts, searchQuery, filterStatus]);

  // ✅ reset về trang 1 mỗi khi search / filter đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // ✅ cắt bài viết theo trang hiện tại
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredArticles.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / PAGE_SIZE)
  );

  // duyệt bài => set status = published
  const handleApprove = async (article: Post) => {
    if (!article.id) return;
    try {
      await dispatch(publishPost(article.id) as any);
    } catch (err) {
      console.error(err);
      alert("Duyệt bài thất bại");
    }
  };

  // xoá hẳn
  const handleDelete = async (article: Post) => {
    if (!article.id) return;
    const ok = window.confirm("Xoá bài này khỏi hệ thống?");
    if (!ok) return;
    try {
      await dispatch(deletePost(article.id) as any);
    } catch (err) {
      console.error(err);
      alert("Xoá bài thất bại");
    }
  };

  // generate sau này nối API AI, giờ để tạm alert
  const handleGenerate = async (article: Post) => {
  if (!article.id) return;
  try {
    await dispatch(generatePost(article.id) as any).unwrap();
    toast.success("Generate nội dung bài viết thành công");
  } catch (err) {
    console.error(err);
    toast.error("Generate bài viết thất bại");
  }
};

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Bài Viết</h1>
        <p className="text-slate-600 mt-2">
          Quản lý các bài viết được crawl từ nguồn
        </p>
      </div>

      {/* Bộ lọc trên cùng */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as "all" | string)
                }
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã duyệt (published)</option>
                <option value="pending">Chờ duyệt (pending)</option>
                <option value="draft">Bản nháp (draft)</option>
                <option value="removed">Đã xoá (removed)</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Filter size={20} className="mr-2" />
                Lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List bài viết */}
      {loading ? (
        <div className="p-6 text-center text-slate-500 bg-white rounded-lg shadow-sm border border-slate-200">
          Đang tải danh sách bài viết...
        </div>
      ) : !filteredArticles.length ? (
        <div className="p-6 text-center text-slate-500 bg-white rounded-lg shadow-sm border border-slate-200">
          Không có bài viết nào.
        </div>
      ) : (
        <>
          {/* ✅ dùng paginatedArticles thay vì filteredArticles */}
          <div className="grid gap-6">
            {paginatedArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5"
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
                  {/* Thumbnail bên trái */}
                  <div className="w-full md:w-56 lg:w-64 flex-shrink-0">
                    <div className="relative overflow-hidden rounded-xl bg-slate-100 h-40 md:h-32">
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt={article.title || "Thumbnail"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          Không có ảnh
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nội dung bài viết ở giữa */}
                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 line-clamp-2">
                        {article.title || "(Không có tiêu đề)"}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-2 mb-1">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {article.categoryName || "Chưa gán danh mục"}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                          {article.baseUrl || "Không rõ nguồn"}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getStatusClasses(
                            article.status
                          )}`}
                        >
                          {getStatusLabel(article.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center text-xs md:text-sm text-slate-600 gap-2">
                        <span>{article.viewCount ?? 0} lượt xem</span>
                        <span className="hidden md:inline">•</span>
                        <span>
                          {article.createdAt?.slice(0, 10) || "Chưa có ngày"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nút action bên phải */}
                  <div className="flex md:flex-col gap-2 md:w-32 md:items-stretch">
                    {article.status !== "published" && (
                      <button
                        onClick={() => handleApprove(article)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs md:text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Duyệt
                      </button>
                    )}

                    <button
                      onClick={() => handleGenerate(article)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs md:text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                    >
                      <Sparkles size={16} className="mr-1" />
                      Generate
                    </button>

                    <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs md:text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                      <Edit2 size={16} className="mr-1" />
                      Sửa
                    </button>

                    <button
                      onClick={() => handleDelete(article)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs md:text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Thanh phân trang */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-3">
              <span className="text-sm text-slate-600">
                Trang {currentPage}/{totalPages} • {filteredArticles.length} bài
              </span>
              <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-slate-200 bg-white">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Trước
                </button>
                <span className="px-3 py-1.5 text-sm border-l border-r border-slate-200">
                  {currentPage}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
