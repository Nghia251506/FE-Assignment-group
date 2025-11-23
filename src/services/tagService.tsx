// src/services/tagService.ts
import axiosClient from "../api/axiosClient";
import type { Tag } from "../types/models";

export interface TagPayload {
  name: string;
  color?: string;
}

const tagService = {
  // Lấy tất cả tags
  async getAll(): Promise<Tag[]> {
    const res = await axiosClient.get<Tag[]>("/admin/tags");
    return res.data;
  },

  // Tạo mới tag
  async create(data: TagPayload): Promise<Tag> {
    const res = await axiosClient.post<Tag>("/admin/tags", data);
    return res.data;
  },

  // Upsert (tạo nếu chưa có, cập nhật nếu có) – thường dùng cho tag input
  async upsert(data: TagPayload): Promise<Tag> {
    const res = await axiosClient.post<Tag>("/admin/tags/upsert", data);
    return res.data;
  },

  // Cập nhật tag
  async update(id: number, data: Partial<TagPayload>): Promise<Tag> {
    const res = await axiosClient.put<Tag>(`/admin/tags/${id}`, data);
    return res.data;
  },

  // Xóa tag
  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/admin/tags/${id}`);
  },
};

export default tagService;