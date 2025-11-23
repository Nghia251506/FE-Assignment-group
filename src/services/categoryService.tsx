// src/api/categoryApi.ts
import axiosClient from "../api/axiosClient";
import type { Category } from "../types/models";

const DEFAULT_TENANT_ID = 1;

export type CategoryPayload = {
  code?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  parentId?: number | null; // BE cần tenantId khi create
};

export const categoryApi = {
  // GET /api/admin/categories
  getCategories() {
    return axiosClient.get<Category[]>("/admin/categories");
  },

  getArticleCountBySlug(slug: string) {
    return axiosClient.get<number>(`/admin/categories/${slug}/posts-count`);
  },

  // GET /admin/categories/active
  getCategoriesActive() {
    return axiosClient.get<Category[]>("/admin/categories/active");
  },

  // POST /admin/categories
  create(data: CategoryPayload) {
    // Không cần truyền tenantId nữa, nếu có vẫn có thể giữ logic mặc định
    return axiosClient.post<Category>("/admin/categories", data);
  },

  // PUT /admin/categories/{id}
  update(id: number, data: CategoryPayload) {
    return axiosClient.put<Category>(`/admin/categories/${id}`, data);
  },

  // DELETE /admin/categories/{id}
  delete(id: number) {
    return axiosClient.delete<void>(`/admin/categories/${id}`);
  },

  // GET /admin/categories/{id}
  getById(id: number) {
    return axiosClient.get<Category>(`/admin/categories/${id}`);
  },

  // GET /admin/categories/{slug}
  getCategoryBySlug(slug: string) {
    return axiosClient.get<Category>(`/admin/categories/${slug}`);
  },
};
