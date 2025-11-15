import axiosClient from "../api/axiosClient";
import { PageResponse, Tag } from "../types/models";

const BASE_URL = "/api/admin/tags";

export interface TagSearchParams {
  page?: number;
  size?: number;
  q?: string;
}

export const tagService = {
  async getPage(params: TagSearchParams = {}): Promise<PageResponse<Tag>> {
    const response = await axiosClient.get<PageResponse<Tag>>(BASE_URL, {
      params,
    });
    return response.data;
  },

  async getAll(): Promise<Tag[]> {
    const response = await axiosClient.get<Tag[]>(BASE_URL + "/all");
    return response.data;
  },

  async create(payload: Partial<Tag>): Promise<Tag> {
    const response = await axiosClient.post<Tag>(BASE_URL, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`${BASE_URL}/${id}`);
  },
};
