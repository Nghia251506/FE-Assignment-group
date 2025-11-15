import axiosClient from "../api/axiosClient";
import { PageResponse, Tenant } from "../types/models";

const BASE_URL = "/api/admin/tenants";

export interface TenantSearchParams {
  page?: number;
  size?: number;
  q?: string; // search by code/name
  status?: string; // "ACTIVE" | "SUSPENDED"
}

export const tenantService = {
  async getPage(params: TenantSearchParams = {}): Promise<PageResponse<Tenant>> {
    const response = await axiosClient.get<PageResponse<Tenant>>(BASE_URL, {
      params,
    });
    return response.data;
  },

  async getAll(): Promise<Tenant[]> {
    const response = await axiosClient.get<Tenant[]>(BASE_URL + "/all");
    return response.data;
  },

  async getById(id: number): Promise<Tenant> {
    const response = await axiosClient.get<Tenant>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(payload: Partial<Tenant>): Promise<Tenant> {
    const response = await axiosClient.post<Tenant>(BASE_URL, payload);
    return response.data;
  },

  async update(id: number, payload: Partial<Tenant>): Promise<Tenant> {
    const response = await axiosClient.put<Tenant>(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`${BASE_URL}/${id}`);
  },
};
