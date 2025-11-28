import {
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Sparkles,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import {
  fetchPosts,
  publishPost,
  deletePost,
  generatePost,
  createPost,
  updatePost,
} from "../../redux/slices/postSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import type { Post } from "../../types/models";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";
import { useParams } from "react-router-dom";

function getStatusLabel(status?: string) {
  switch (status) {
    case "published": return "Đã duyệt";
    case "pending": return "Chờ duyệt";
    case "draft": return "Bản nháp";
    case "removed": return "Đã xoá";
    default: return "Không rõ";
  }
}

function getStatusClasses(status?: string) {
  switch (status) {
    case "published": return "bg-emerald-100 text-emerald-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "draft": return "bg-slate-100 text-slate-700";
    case "removed": return "bg-red-100 text-red-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

const PAGE_SIZE = 10;

export default function Articles() {
  const dispatch = useAppDispatch();
  const { items: posts, loading } = useAppSelector((state: RootState) => state.post);
  const { items: categories } = useAppSelector((state: RootState) => state.category);
  const { items: tags } = useAppSelector((state: RootState) => state.tag);
  const { slug } = useParams();
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(paginatedArticles.map(p => p.id!).filter(Boolean));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectPost = (id: number) => {
    setSelectedPosts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };


  useEffect(() => {
    // CHỐNG VIEW ẢO: chỉ tăng view nếu chưa xem trong 24h
    const viewedKey = `viewed_post_${slug}`;
    const viewedTime = localStorage.getItem(viewedKey);

    if (!viewedTime || Date.now() - Number(viewedTime) > 24 * 60 * 60 * 1000) {
      axiosClient.post(`/admin/posts/${slug}/view`)
        .catch(() => { }); // dù lỗi vẫn kệ, không ảnh hưởng user

      localStorage.setItem(viewedKey, Date.now().toString());
    }
  }, [slug]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Post | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    thumbnail: "",
    categoryId: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft" as "draft" | "pending" | "published",
    tagIds: [] as number[],
    titleSelector:"",
    contentSelector:""
  });

  useEffect(() => {
    dispatch(fetchPosts({ page: 0, size: 1000 }) as any);
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest?.("button[aria-haspopup]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const openModal = (article?: Post) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title || "",
        slug: article.slug || "",
        thumbnail: article.thumbnail || "",
        categoryId: article.categoryId?.toString() || "",
        content: article.content || "",
        metaTitle: article.metaTitle || "",
        metaDescription: article.metaDescription || "",
        status: (article.status as any) || "draft",
        tagIds: [] as number[],
        titleSelector:article.titleSelector|| "",
        contentSelector:article.contentSelector || ""
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        slug: "",
        thumbnail: "",
        categoryId: "",
        content: "",
        metaTitle: "",
        metaDescription: "",
        status: "draft",
        tagIds: [] as number[],
        titleSelector:"",
        contentSelector:""
      });
    }
    setIsModalOpen(true);
  };
  useEffect(() => {
    setSelectAll(false);
  }, [currentPage, searchQuery, filterStatus]);

  // HÀM XỬ LÝ HÀNG LOẠT (gọi API bulk-action)
  const handleBulkAction = async (action: "publish" | "generate") => {
    if (selectedPosts.length === 0) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn ${action === "publish" ? "DUYỆT" : "GENERATE + DUYỆT"} ${selectedPosts.length} bài viết này không?`
    );
    if (!confirmed) return;

    try {
      await axiosClient.post("/admin/posts/bulk-action", {
        postIds: selectedPosts,
        action: action // "publish" hoặc "generate"
      });

      toast.success(`Đã ${action === "publish" ? "duyệt" : "generate + duyệt"} thành công ${selectedPosts.length} bài viết!`);

      // Reset selection
      setSelectedPosts([]);
      setSelectAll(false);

      // Reload danh sách
      dispatch(fetchPosts({ page: 0, size: 1000 }) as any);
    } catch (err) {
      toast.error("Thao tác hàng loạt thất bại!");
    }
  };
  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error("Tiêu đề không được để trống");

    const payload: any = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      thumbnail: formData.thumbnail.trim() || undefined,
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      content: formData.content.trim(),
      metaTitle: formData.metaTitle.trim() || undefined,
      metaDescription: formData.metaDescription.trim() || undefined,
      status: formData.status,
      tagIds: formData.tagIds || [],
    };

    try {
      if (editingArticle?.id) {
        await dispatch(updatePost({ id: editingArticle.id, data: payload }) as any);
        toast.success("Cập nhật bài viết thành công");
      } else {
        await dispatch(createPost(payload) as any);
        toast.success("Tạo bài viết mới thành công");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Lưu bài viết thất bại");
    }
  };

  const handleApprove = async (article: Post) => {
    if (!article.id) return;
    try {
      await dispatch(publishPost(article.id) as any);
      toast.success("Duyệt bài thành công");
    } catch {
      toast.error("Duyệt bài thất bại");
    }
  };

  const handleGenerate = async (article: Post) => {
    if (!article.id) return;
    try {
      await dispatch(generatePost(article.id) as any).unwrap();
      toast.success("Generate slug thành công");
    } catch {
      toast.error("Generate thất bại");
    }
  };

  const handleDelete = async (article: Post) => {
    if (!article.id || !window.confirm("Xóa vĩnh viễn bài viết này?")) return;
    try {
      await dispatch(deletePost(article.id) as any);
      toast.success("Xóa bài thành công");
    } catch {
      toast.error("Xóa bài thất bại");
    }
  };

  // Filter & Pagination
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (Array.isArray(posts) ? posts : []).filter((p) => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (!q) return true;
      const title = p.title?.toLowerCase() || "";
      const category = p.category?.name?.toLowerCase() || p.categoryName?.toLowerCase() || "";
      const source = p.baseUrl?.toLowerCase() || "";
      return title.includes(q) || category.includes(q) || source.includes(q);
    });
  }, [posts, searchQuery, filterStatus]);

  useEffect(() => setCurrentPage(1), [searchQuery, filterStatus]);

  const totalItems = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bài Viết</h1>
          <p className="text-slate-600 mt-2">Quản lý bài viết (crawl + tự tạo)</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          Viết bài mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="draft">Bản nháp</option>
            <option value="removed">Đã xoá</option>
          </select>
        </div>
      </div>
      {selectedPosts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
            />
            <span className="font-semibold text-blue-900">
              Đã chọn: <strong className="text-xl">{selectedPosts.length}</strong> bài viết
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleBulkAction("publish")}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
            >
              <CheckCircle size={18} />
              Duyệt tất cả
            </button>
            <button
              onClick={() => handleBulkAction("generate")}
              className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
            >
              <Sparkles size={18} />
              Generate + Duyệt
            </button>
          </div>
        </div>
      )}

      {/* BẢNG HOÀN CHỈNH */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">Đang tải bài viết...</div>
        ) : totalItems === 0 ? (
          <div className="p-16 text-center text-slate-500">Không có bài viết nào.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Bài viết</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Danh mục / Nguồn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Lượt xem</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {paginatedArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(article.id!)}
                          onChange={() => handleSelectPost(article.id!)}
                          className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                            {article.thumbnail ? (
                              <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No img</div>
                            )}
                          </div>
                          <div className="max-w-md">
                            <div className="text-sm font-medium text-slate-900 line-clamp-2">
                              {article.title || "(Không có tiêu đề)"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>
                          <div className="font-medium">{article.categoryName || article.category?.name || "Chưa gán"}</div>
                          <div className="text-xs text-slate-500">{article.baseUrl || "Không rõ nguồn"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClasses(article.status)}`}>
                          {getStatusLabel(article.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{article.viewCount ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{article.createdAt?.slice(0, 10) || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            aria-haspopup="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === article.id ? null : article.id);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical size={18} className="text-slate-600" />
                          </button>

                          {openDropdown === article.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                              <div className="py-1">
                                {article.status !== "published" && (
                                  <button onClick={() => { handleApprove(article); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2">
                                    <CheckCircle size={16} /> Duyệt bài
                                  </button>
                                )}
                                <button onClick={() => { handleGenerate(article); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2">
                                  <Sparkles size={16} /> Generate nội dung
                                </button>
                                <button onClick={() => { openModal(article); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2">
                                  <Edit2 size={16} /> Sửa bài viết
                                </button>
                                <button onClick={() => { handleDelete(article); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2">
                                  <Trash2 size={16} /> Xóa vĩnh viễn
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, totalItems)} trong {totalItems} bài
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50">
                    <ChevronLeft size={18} />
                  </button>
                  {getPageNumbers().map((page, i) => page === "..." ? (
                    <span key={i} className="px-3 py-1 text-slate-500">...</span>
                  ) : (
                    <button key={page} onClick={() => setCurrentPage(page as number)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentPage === page ? "bg-emerald-600 text-white" : "hover:bg-slate-100 text-slate-700"}`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Tạo / Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{editingArticle ? "Sửa bài viết" : "Viết bài mới"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề *</label>
                    <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Nhập tiêu đề..." className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
                    <textarea rows={15} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Viết nội dung bài viết..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
                    <input value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    {formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-lg" />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                    <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg">
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags (có thể chọn nhiều)
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-slate-300 rounded-lg">
                      {categories.length === 0 ? (
                        <p className="text-slate-400 text-sm">Đang tải tag...</p>
                      ) : (
                        tags.map((tag) => (
                          <label
                            key={tag.id}
                            className="flex items-center gap-2 cursor-pointer has-[:checked]:opacity-100 opacity-70"
                          >
                            <input
                              type="checkbox"
                              checked={formData.tagIds?.includes(tag.id!) || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                  ...prev,
                                  tagIds: checked
                                    ? [...(prev.tagIds || []), tag.id!]
                                    : (prev.tagIds || []).filter(id => id !== tag.id)
                                }));
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm">{tag.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg">
                      <option value="draft">Bản nháp</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="published">Đã xuất bản</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title (SEO)</label>
                    <input value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} placeholder="Tối đa 60 ký tự" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                    <textarea rows={3} value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} placeholder="Tối đa 160 ký tự" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm resize-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  <Save size={18} />
                  {editingArticle ? "Cập nhật" : "Xuất bản"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}