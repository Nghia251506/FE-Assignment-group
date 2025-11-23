import { Plus, Search, Edit2, Trash2, ChevronDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchCategories,
  fetchArticleCountBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import { RootState } from "../../redux/store";
import type { Category } from "../../types/models";
import type { CategoryPayload } from "../../services/categoryService";
import { toast } from "react-toastify";

type FormState = {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  parentId?:number | null;
};

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  emerald: "bg-emerald-100 text-emerald-800",
  purple: "bg-purple-100 text-purple-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
};

const colorList = ["blue", "emerald", "purple", "orange", "red"] as const;

function slugify(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function Categories() {
  const dispatch = useAppDispatch();
  const { items: categories, loading, articleCount } = useAppSelector(
    (state: RootState) => state.category
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formState, setFormState] = useState<FormState>({
    code: "",
    name: "",
    description: "",
    isActive: true,
    parentId: null as number | null,
  });

  const [expandedCategory, setExpandedCategory] = useState<number | null>(null); // track expanded categories

  const handleToggleExpand = (categoryId: number) => {
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId)); // toggle the dropdown
  };

  // Load danh mục lần đầu
  useEffect(() => {
    dispatch(fetchCategories() as any); // tenant mặc định trong slice/api
  }, [dispatch]);

  // Gọi API lấy số bài viết theo slug mỗi khi categories thay đổi
  useEffect(() => {
    categories.forEach((category) => {
      dispatch(fetchArticleCountBySlug(category.slug)); // Gọi API đếm bài viết
    });
  }, [categories, dispatch]);

  // Filter client theo searchQuery (name/code)
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;

    return categories.filter((c) => {
      const name = c.name?.toLowerCase() || "";
      const code = (c.code || "").toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [categories, searchQuery]);

  // Thêm mới
  const handleAddClick = () => {
    setEditingCategory(null);
    setFormState({
      code: "",
      name: "",
      description: "",
      isActive: true,
      parentId: editingCategory?.parentId || null,
    });
    setIsModalOpen(true);
  };

  // Sửa
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormState({
      code: category.code || "",
      name: category.name || "",
      description: category.description || "",
      isActive: category.isActive ?? true,
      parentId: editingCategory?.parentId || null,
    });
    setIsModalOpen(true);
  };

  // Xóa
  const handleDeleteClick = async (category: Category) => {
    const ok = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${category.name}"?`
    );
    if (!ok || !category.id) return;
    try {
      await dispatch(deleteCategory(category.id) as any);
      toast.success("Xóa danh mục thành công");
    } catch (err) {
      console.error(err);
      toast.error("Xóa danh mục thất bại");
    }
  };

  // Submit form (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CategoryPayload = {
      code: formState.code.trim() || undefined,
      name: formState.name.trim(),
      description: formState.description.trim() || undefined,
      isActive: formState.isActive,
      parentId: formState.parentId || null,
      
      // tenantId: nếu cần override thì set ở đây, còn không để undefined để dùng DEFAULT_TENANT_ID trong categoryApi
    };

    if (!payload.name) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      if (editingCategory && editingCategory.id) {
        await dispatch(
          updateCategory({ id: editingCategory.id, data: payload }) as any
        );
      } else {
        await dispatch(createCategory(payload) as any);
        toast.success("Tạo mới danh mục thành công");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormState({
      name: "",
      code: "",
      description: "",
      isActive: true,
      parentId: null,
    });
    } catch (err) {
      console.error(err);
      toast.error("Lưu danh mục thất bại");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Danh Mục</h1>
          <p className="text-slate-600 mt-2">
            Quản lý danh mục bài viết (Category)
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Thêm Danh Mục
        </button>
      </div>

      {/* Card danh sách */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục theo tên / mã..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Content */}
        {/* Content */}
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Không có danh mục nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th className="px-6 py-3">Tên Danh Mục</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Số bài viết</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories
                  .filter((category) => category.parentId === null)
                  .map((category) => {
                    const articlesCount = articleCount[category.slug] ?? 0;
                    const isExpanded = expandedCategory === category.id;
                    const children = categories.filter((c) => c.parentId === category.id);

                    return (
                      <React.Fragment key={category.id}>
                        {/* DÒNG CHA - Click toàn bộ ô tên để mở rộng */}
                        <tr className="border-b hover:bg-slate-50 transition-all duration-200">
                          <td
                            className="px-6 py-4 cursor-pointer select-none"
                            onClick={() => children.length > 0 && handleToggleExpand(category.id!)}
                          >
                            <div className="flex items-center gap-3">
                              {/* Mũi tên chỉ hiện khi có con */}
                              {children.length > 0 && (
                                <span
                                  className={`transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"
                                    }`}
                                >
                                  {isExpanded ? (
                                    <ChevronDown size={18} className="text-slate-600" />
                                  ) : (
                                    <ChevronDown size={18} className="text-slate-500" />
                                  )}
                                </span>
                              )}
                              {/* Nếu không có con thì để khoảng trống cho đều */}
                              {children.length === 0 && <span className="w-6" />}

                              <span
                                className={`font-medium ${children.length > 0
                                    ? "text-emerald-700 hover:text-emerald-800"
                                    : "text-slate-800"
                                  }`}
                              >
                                {category.name}
                              </span>
                              {children.length > 0 && (
                                <span className="text-xs text-slate-500 ml-2">
                                  ({children.length} con)
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {category.slug || "-"}
                          </td>
                          <td className="px-6 py-4 font-medium">{articlesCount}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${category.isActive
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {category.isActive ? "Hoạt động" : "Tắt"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // quan trọng: tránh trigger mở rộng khi click nút
                                  handleEditClick(category);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Sửa"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(category);
                                }}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* DANH MỤC CON - mở rộng mượt mà */}
                        {isExpanded &&
                          children.map((child, index) => {
                            const childCount = articleCount[child.slug] ?? 0;

                            return (
                              <tr
                                key={child.id}
                                className="border-b bg-slate-50/70 hover:bg-slate-100 transition-all duration-200"
                              >
                                <td className="px-6 py-4 pl-14">
                                  <div className="flex items-center gap-3">
                                    <span className="text-slate-400">└</span>
                                    <span className="font-medium text-slate-700">
                                      {child.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                  {child.slug || "-"}
                                </td>
                                <td className="px-6 py-4">{childCount}</td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${child.isActive
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-red-100 text-red-800"
                                      }`}
                                  >
                                    {child.isActive ? "Hoạt động" : "Tắt"}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handleEditClick(child)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Sửa"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(child)}
                                      className="text-red-600 hover:text-red-800"
                                      title="Xóa"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingCategory ? "Sửa Danh Mục" : "Thêm Danh Mục"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                X
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Tên danh mục */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: Công Nghệ"
                />
              </div>

              {/* Danh mục cha – MỚI THÊM */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Danh mục cha (tùy chọn)
                </label>
                <select
                  value={formState.parentId || ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      parentId: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Không có danh mục cha --</option>
                  {categories
                    .filter((cat: any) => cat.id !== editingCategory?.id && cat.parentId === null) // không cho chọn chính nó làm cha
                    .map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn nếu danh mục này là con của danh mục khác
                </p>
              </div>

              {/* Mã danh mục */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mã danh mục (code)
                </label>
                <input
                  type="text"
                  value={formState.code}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: TECH"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Mô tả ngắn cho danh mục..."
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700 select-none">
                  Hoạt động (Active)
                </label>
              </div>

              {/* Nút */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {editingCategory ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
