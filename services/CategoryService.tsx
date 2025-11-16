// services/CategoryService.ts
import axiosInstance from '../api/axiosClient';

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  color: string;
}

const categoryApi = {
  getByTenant: (tenantId: number | undefined) => {
    return axiosInstance.get<Category[]>(`/admin/categories/tenant/${tenantId}`);
  },
  
  // Thêm các method khác nếu cần
  getById: (id: number) => {
    return axiosInstance.get<Category>(`/admin/categories/${id}`);
  },
  
  getBySlug: (slug: string) => {
    return axiosInstance.get<Category>(`/admin/categories/slug/${slug}`);
  },
};

export { categoryApi };