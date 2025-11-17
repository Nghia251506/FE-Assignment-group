import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchCategories,
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
  const { items: categories, loading } = useAppSelector(
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
  });

  // Load danh mục lần đầu
  useEffect(() => {
    dispatch(fetchCategories() as any); // tenant mặc định trong slice/api
  }, [dispatch]);

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
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Không có danh mục nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredCategories.map((category, index) => {
              const color =
                colorList[index % colorList.length] || colorList[0];
              const slug = slugify(category.name);
              const articlesCount =
                (category as any).articleCount ?? 0; // BE có thể trả field articleCount

              return (
                <div
                  key={category.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        colorClasses[color]
                      }`}
                    >
                      {category.name}
                    </div>
                    {category.isActive === false && (
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {category.code && (
                      <p className="text-sm text-slate-600">
                        Mã:{" "}
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {category.code}
                        </code>
                      </p>
                    )}
                    <p className="text-sm text-slate-600">
                      Slug:{" "}
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {category.slug || "-"}
                      </code>
                    </p>
                    <p className="text-sm text-slate-600">
                      Số bài viết:{" "}
                      <span className="font-semibold text-slate-900">
                        {articlesCount}
                      </span>
                    </p>
                    {category.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
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
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: Công Nghệ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mã danh mục (code)
                </label>
                <input
                  type="text"
                  value={formState.code}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: TECH"
                />
              </div>

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
                  className="h-4 w-4 text-emerald-600 border-slate-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-slate-700 select-none"
                >
                  Hoạt động (Active)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 mt-2">
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
