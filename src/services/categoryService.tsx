// src/api/categoryApi.ts
import axiosClient from "../api/axiosClient";
import type { Category } from "../types/models";

const DEFAULT_TENANT_ID = 1;

export type CategoryPayload = {
  code?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  tenantId?: number; // BE cần tenantId khi create
};

export const categoryApi = {
  // GET /api/admin/categories/tenant/{tenantId}
  getByTenant(tenantId: number = DEFAULT_TENANT_ID) {
    return axiosClient.get<Category[]>(
      `/admin/categories/tenant/${tenantId}`
    );
  },

  // GET /admin/categories/tenant/{tenantId}/active
  getActiveByTenant(tenantId: number = DEFAULT_TENANT_ID) {
    return axiosClient.get<Category[]>(
      `/admin/categories/tenant/${tenantId}/active`
    );
  },

  // POST /admin/categories
  create(data: CategoryPayload) {
    const tenantId = data.tenantId ?? DEFAULT_TENANT_ID;
    return axiosClient.post<Category>(`/admin/categories`, {
      ...data,
      tenantId,
    });
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
};
