import axiosClient from "../api/axiosClient";
import type { Source } from "../types/models";

export interface SourceCreatePayload {
  tenantId: number;
  categoryId: number;
  name: string;
  baseUrl: string;
  listUrl: string;
  listItemSelector: string;
  linkAttr?: string;
  titleSelector?: string;
  contentSelector?: string;
  thumbnailSelector?: string;
  authorSelector?: string;
  isActive?: boolean;
  note?: string;
}

export interface SourceUpdatePayload {
  categoryId?: number;
  name?: string;
  baseUrl?: string;
  listUrl?: string;
  listItemSelector?: string;
  linkAttr?: string;
  titleSelector?: string;
  contentSelector?: string;
  thumbnailSelector?: string;
  authorSelector?: string;
  isActive?: boolean;
  note?: string;
}

export const sourceService = {
  // GET /api/admin/sources/tenant/{tenantId}
  getSources(): Promise<Source[]> {
    const data = axiosClient
      .get<Source[]>(`api/admin/sources`)
      .then((res) => res.data);
      console.log("Data BE: ", data)
      return data;
  },

  // GET /api/admin/sources/tenant/{tenantId}/active
  getSourceActive(): Promise<Source[]> {
    return axiosClient
      .get<Source[]>(`api/admin/sources/active`)
      .then((res) => res.data);
  },

  // GET /api/admin/sources/active
  getAllActive(): Promise<Source[]> {
    return axiosClient
      .get<Source[]>(`api/admin/sources/active`)
      .then((res) => res.data);
  },

  // GET /api/admin/sources/{id}
  getById(id: number): Promise<Source> {
    return axiosClient
      .get<Source>(`api/admin/sources/${id}`)
      .then((res) => res.data);
  },

  // POST /api/admin/sources
  create(payload: SourceCreatePayload): Promise<Source> {
    return axiosClient
      .post<Source>(`api/admin/sources`, payload)
      .then((res) => res.data);
  },

  // PUT /api/admin/sources/{id}
  update(id: number, payload: SourceUpdatePayload): Promise<Source> {
    return axiosClient
      .put<Source>(`api/admin/sources/${id}`, payload)
      .then((res) => res.data);
  },

  // DELETE /api/admin/sources/{id}
  delete(id: number): Promise<void> {
    return axiosClient
      .delete(`api/admin/sources/${id}`)
      .then(() => undefined);
  },
};