import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useMemo, useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchSources,
  createSource,
  updateSource,
  deleteSource,
} from "../../redux/slices/sourceSlice";
import type { RootState } from "../../redux/store";
import { fetchCategories } from "../../redux/slices/categorySlice";
import type { Source, Category } from "../../types/models";
import  crawlerService  from "../../services/crawlerService";
import { toast } from "react-toastify";

// --- CẬP NHẬT STATE TYPE ---
type SourceFormState = {
  name: string;
  baseUrl: string;
  listUrl: string;
  listItemSelector: string;
  linkAttr: string;
  categoryId: number | "";
  isActive: boolean;
  note: string;
  thumbnailSelector: string; // <-- THÊM MỚI
  authorSelector: string;    // <-- THÊM MỚI
  titleSelector: string;
  contentSelector: string;
};

const DEFAULT_TENANT_ID = 1; // tạm thời cố định, anh có thể chỉnh sau

export default function Sources() {
  const dispatch = useAppDispatch();
  const { items: sources, loading } = useAppSelector(
    (state: RootState) => state.source
  );
  const { items: categories } = useAppSelector(
    (state: RootState) => state.category
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(
    null
  );
  const [isCrawling, setIsCrawling] = useState(false);
  
  // --- CẬP NHẬT STATE BAN ĐẦU ---
  const [formState, setFormState] = useState<SourceFormState>({
    name: "",
    baseUrl: "",
    listUrl: "",
    listItemSelector: "",
    linkAttr: "href",
    categoryId: "",
    isActive: true,
    note: "",
    thumbnailSelector: "", // <-- THÊM MỚI
    authorSelector: "",    // <-- THÊM MỚI
    titleSelector: "",
    contentSelector: ""
  });
  const [runningSourceId, setRunningSourceId] = useState<number | null>(null);

  // load nguồn + category 1 lần
  useEffect(() => {
    dispatch(fetchSources() as any);
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  const filteredSources = useMemo(() => {
    const list = Array.isArray(sources) ? sources : [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter((s) => {
      const name = s.name?.toLowerCase() || "";
      const baseUrl = s.baseUrl?.toLowerCase() || "";
      return name.includes(q) || baseUrl.includes(q);
    });
  }, [sources, searchQuery]);
  
  const handleRunCrawlerAll = async () => {
    if (isCrawling) return;
    const ok = window.confirm(
      "Chạy crawler lấy link cho TẤT CẢ nguồn đang active?\nViệc này có thể tốn vài giây."
    );
    if (!ok) return;

    try {
      setIsCrawling(true);
      await crawlerService.runLinksAll();
      toast.success("Đã chạy crawler lấy link cho tất cả nguồn active");
    } catch (err) {
      console.error(err);
      toast.error("Chạy crawler lấy link thất bại, kiểm tra log BE");
    } finally {
      setIsCrawling(false);
    }
  };
  
  const handleRunContentBySource = async (source: Source) => {
    if (!source.id) return;
    if (
      !window.confirm(
        `Cào nội dung tất cả bài viết từ nguồn "${source.name}"?`
      )
    ) {
      return;
    }

    try {
      setRunningSourceId(source.id);
      const res = await crawlerService.runContentBySource(source.id);
      toast.success(
        `Cào content xong. Found: ${res.totalFound ?? "-"}, Updated: ${
          res.totalUpdated ?? "-"
        }`
      );
      // có thể reload lại post list ở chỗ khác, ở đây chỉ cần vậy
    } catch (e) {
      console.error(e);
      toast.error("Cào content cho nguồn này thất bại");
    } finally {
      setRunningSourceId(null);
    }
  };

  // --- CẬP NHẬT STATE KHI THÊM MỚI ---
  const handleAddClick = () => {
    setEditingSource(null);
    setFormState({
      name: "",
      baseUrl: "",
      listUrl: "",
      listItemSelector: "",
      linkAttr: "href",
      categoryId: "",
      isActive: true,
      note: "",
      thumbnailSelector: "", // <-- THÊM MỚI
      authorSelector: "",    // <-- THÊM MỚI
      contentSelector: "",
      titleSelector: "",
    });
    setIsModalOpen(true);
  };

  // --- CẬP NHẬT STATE KHI SỬA ---
  const handleEditClick = (src: Source) => {
    setEditingSource(src);
    setFormState({
      name: src.name || "",
      baseUrl: src.baseUrl || "",
      listUrl: src.listUrl || "",
      listItemSelector: src.listItemSelector || "",
      linkAttr: src.linkAttr || "href",
      categoryId: src.categoryId ?? "",
      isActive: src.isActive ?? true,
      note: src.note || "",
      thumbnailSelector: (src as any).thumbnailSelector || "", // <-- THÊM MỚI
      authorSelector: (src as any).authorSelector || "",    // <-- THÊM MỚI
      contentSelector: src.contentSelector||"",
      titleSelector: src.titleSelector||"",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (src: Source) => {
    if (!src.id) return;
    const ok = window.confirm(
      `Bạn có chắc muốn xóa nguồn "${src.name}"?`
    );
    if (!ok) return;
    try {
      await dispatch(deleteSource(src.id) as any);
      toast.success("Xóa nguồn thành công");
    } catch (e) {
      console.error(e);
      toast.error("Xóa nguồn thất bại");
    }
  };

  // --- CẬP NHẬT LOGIC SUBMIT ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // (Validation giữ nguyên...)
    if (!formState.name.trim()) {
      toast.error("Tên nguồn không được để trống");
      return;
    }
    if (!formState.baseUrl.trim()) {
      toast.error("Base URL không được để trống");
      return;
    }
    if (!formState.listUrl.trim()) {
      toast.error("List URL không được để trống");
      return;
    }
    if (!formState.listItemSelector.trim()) {
      toast.error("List item selector không được để trống");
      return;
    }
    if (!formState.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    try {
      if (editingSource && editingSource.id) {
        // Logic UPDATE
        await dispatch(
          updateSource({
            id: editingSource.id,
            data: {
              name: formState.name.trim(),
              baseUrl: formState.baseUrl.trim(),
              listUrl: formState.listUrl.trim(),
              listItemSelector: formState.listItemSelector.trim(),
              linkAttr: formState.linkAttr.trim() || "href",
              categoryId: Number(formState.categoryId),
              isActive: formState.isActive,
              note: formState.note.trim() || undefined,
              // --- THÊM DỮ LIỆU MỚI KHI UPDATE ---
              thumbnailSelector: formState.thumbnailSelector.trim() || undefined,
              authorSelector: formState.authorSelector.trim() || undefined,
            },
          }) as any
        );
        toast.success("Cập nhật nguồn thành công");
      } else {
        // Logic CREATE
        await dispatch(
          createSource({
            tenantId: DEFAULT_TENANT_ID,
            name: formState.name.trim(),
            baseUrl: formState.baseUrl.trim(),
            listUrl: formState.listUrl.trim(),
            listItemSelector: formState.listItemSelector.trim(),
            linkAttr: formState.linkAttr.trim() || "href",
            categoryId: Number(formState.categoryId),
            isActive: formState.isActive,
            note: formState.note.trim() || undefined,
            // --- THÊM DỮ LIỆU MỚI KHI CREATE ---
            thumbnailSelector: formState.thumbnailSelector.trim() || undefined,
            authorSelector: formState.authorSelector.trim() || undefined,
          }) as any
        );
        toast.success("Tạo mới nguồn thành công");
      }

      setIsModalOpen(false);
      setEditingSource(null);
    } catch (err) {
      console.error(err);
      toast.error("Lưu nguồn thất bại");
    }
  };

  return (
    <div>
      {/* Header (giữ nguyên) */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Nguồn Trang
          </h1>
          <p className="text-slate-600 mt-2">
            Quản lý các nguồn tin tức
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          onClick={handleAddClick}
        >
          <Plus size={20} className="mr-2" />
          Thêm Nguồn Mới
        </button>
        <button
            type="button"
            onClick={handleRunCrawlerAll}
            disabled={isCrawling}
            className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCcw size={18} className="mr-2" />
            {isCrawling ? "Đang crawl link..." : "Crawl link tất cả nguồn"}
          </button>
      </div>
      
      {/* Search/Table (giữ nguyên) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nguồn trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Table... (Giữ nguyên không đổi) */}
        {loading ? (
          <div className="p-6 text-center text-slate-500">
            Đang tải...
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            Không có nguồn nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Tên Nguồn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Danh Mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Selector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Số Bài Viết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSources.map((source) => {
                  const isActive = source.isActive !== false;
                  const categoryName =
                    (source as any).categoryName ||
                    (source as any).category?.name ||
                    "";

                  const articlesCount =
                    (source as any).articleCount ?? 0;

                  return (
                    <tr
                      key={source.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {source.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {source.baseUrl ? (
                          <a
                            href={source.baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                          >
                            {source.baseUrl}
                            <ExternalLink
                              size={14}
                              className="ml-1"
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-slate-500">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {categoryName || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {source.listItemSelector || "-"}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {articlesCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {isActive ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                        onClick={() => handleRunContentBySource(source)}
                        disabled={runningSourceId === source.id}
                        className="inline-flex items-center justify-center px-3 py-1.5 mr-3 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                      >
                        <Sparkles size={16} className="mr-1" />
                        {runningSourceId === source.id
                          ? "Đang cào..."
                          : "Cào content"}
                      </button>
                        <button
                          className="text-blue-600 hover:text-blue-700 mr-3"
                          onClick={() => handleEditClick(source)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(source)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CẬP NHẬT MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingSource ? "Sửa Nguồn" : "Thêm Nguồn Mới"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSource(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 py-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên nguồn */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tên nguồn *
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
                    placeholder="VnExpress..."
                  />
                </div>

                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Danh mục *
                  </label>
                  <select
                    value={formState.categoryId}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        categoryId: e.target.value
                          ? Number(e.target.value)
                          : "",
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c: Category) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Base URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Base URL *
                  </label>
                  <input
                    type="text"
                    value={formState.baseUrl}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        baseUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://vnexpress.net"
                  />
                </div>

                {/* List URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    List URL *
                  </label>
                  <input
                    type="text"
                    value={formState.listUrl}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        listUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://vnexpress.net/khoa-hoc"
                  />
                </div>

                {/* List item selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    List item selector *
                  </label>
                  <input
                    type="text"
                    value={formState.listItemSelector}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        listItemSelector: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder=".list_news .item a"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title selector *
                  </label>
                  <input
                    type="text"
                    value={formState.titleSelector}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        titleSelector: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder=".list_news .item a"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Content selector *
                  </label>
                  <input
                    type="text"
                    value={formState.contentSelector}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        contentSelector: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder=".list_news .item a"
                  />
                </div>

                {/* Link attr */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Link attr
                  </label>
                  <input
                    type="text"
                    value={formState.linkAttr}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        linkAttr: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="href (mặc định)"
                  />
                </div>

                {/* --- TRƯỜNG MỚI: THUMBNAIL SELECTOR --- */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Thumbnail Selector
                  </label>
                  <input
                    type="text"
                    value={formState.thumbnailSelector}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        thumbnailSelector: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="meta[property='og:image']"
                  />
                </div>
                
                {/* --- TRƯỜNG MỚI: AUTHOR SELECTOR --- */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Author Selector
                  </label>
                  <input
                    type="text"
                    value={formState.authorSelector}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        authorSelector: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder=".author_name, meta[name='author']"
                  />
                </div>

              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formState.note}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ghi chú cấu hình source..."
                />
              </div>

              {/* Checkbox Active */}
              <div className="flex items-center gap-2">
                <input
                  id="srcActive"
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
                  htmlFor="srcActive"
                  className="text-sm text-slate-700 select-none"
                >
                  Hoạt động (Active)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSource(null);
                  }}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {editingSource ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}