import axiosClient from "../api/axiosClient";
import { PageResponse, User } from "../types/models";

const BASE_URL = "/api/admin/users";

export interface UserSearchParams {
  page?: number;
  size?: number;
  q?: string;       // search by username/fullname/email
  tenantId?: number;
  role?: string;    // "ADMIN" | "EDITOR" | "VIEWER"
  isActive?: boolean;
}

export const userService = {
  async getPage(params: UserSearchParams = {}): Promise<PageResponse<User>> {
    const response = await axiosClient.get<PageResponse<User>>(BASE_URL, {
      params,
    });
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await axiosClient.get<User>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(payload: Partial<User>): Promise<User> {
    const response = await axiosClient.post<User>(BASE_URL, payload);
    return response.data;
  },

  async update(id: number, payload: Partial<User>): Promise<User> {
    const response = await axiosClient.put<User>(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`${BASE_URL}/${id}`);
  },
};
