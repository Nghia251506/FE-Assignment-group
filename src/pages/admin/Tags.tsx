import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Tag as TagIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from "../../redux/slices/tagSlice";
import type { Tag } from "../../types/models";
import { toast } from "react-toastify";

const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
];

const PAGE_SIZE = 10;

export default function Tags() {
  const dispatch = useAppDispatch();
  const { items: tags, loading } = useAppSelector((state) => state.tag);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formState, setFormState] = useState({ name: "", color: "" });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  // Phân trang
  const totalPages = Math.ceil(tags.length / PAGE_SIZE);
  const paginatedTags = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tags.slice(start, start + PAGE_SIZE);
  }, [tags, currentPage]);

  const openModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormState({ name: tag.name, color: tag.color || COLORS[0] });
    } else {
      setEditingTag(null);
      setFormState({ name: "", color: COLORS[0] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setFormState({ name: "", color: COLORS[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formState.name.trim();
    if (!name) return toast.error("Tên tag không được để trống");

    try {
      if (editingTag?.id) {
        await dispatch(updateTag({ id: editingTag.id, data: { name, color: formState.color } })).unwrap();
        toast.success("Cập nhật tag thành công");
      } else {
        await dispatch(createTag({ name, color: formState.color })).unwrap();
        toast.success("Tạo tag mới thành công");
      }
      closeModal();
    } catch {
      toast.error("Lưu tag thất bại");
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!tag.id || !window.confirm(`Xóa tag "${tag.name}" vĩnh viễn?`)) return;
    setDeletingId(tag.id);
    try {
      await dispatch(deleteTag(tag.id)).unwrap();
      toast.success("Xóa tag thành công");
      if (paginatedTags.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch {
      toast.error("Xóa tag thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản Lý Tag</h1>
          <p className="text-slate-600 mt-2">Tổng cộng: {tags.length} tag</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          Thêm Tag Mới
        </button>
      </div>

      {/* Bảng Tags */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="mx-auto animate-spin text-emerald-600" size={40} />
            <p className="text-slate-500 mt-4">Đang tải danh sách tag...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <TagIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <p>Chưa có tag nào. Hãy tạo tag đầu tiên!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Màu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Tên Tag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Số bài viết
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {paginatedTags.map((tag, index) => (
                    <tr key={tag.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full ${tag.color || "bg-gray-400"} shadow-sm`} />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{tag.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{tag.slug || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">
                        {tag.postCount ?? 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(tag)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(tag)}
                            disabled={deletingId === tag.id}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === tag.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} className="text-red-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                  {Math.min(currentPage * PAGE_SIZE, tags.length)} trong {tags.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-emerald-600 text-white"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingTag ? "Sửa Tag" : "Tạo Tag Mới"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Ví dụ: Tin tức, Công nghệ, Bóng đá..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Màu sắc
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormState({ ...formState, color })}
                      className={`w-full aspect-square rounded-lg ${color} ring-4 ring-transparent transition-all ${
                        formState.color === color ? "ring-emerald-500 shadow-lg scale-110" : "hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Save size={18} />
                  {editingTag ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}