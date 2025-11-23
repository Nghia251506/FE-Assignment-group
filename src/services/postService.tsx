import axiosClient from "../api/axiosClient";
import type { Post } from "../types/models";
import type { PageResponse } from "../types/models";

export interface FetchPostParams {
  page?: number;
  size?: number;
  status?: string;
}

const postService = {
  // Lấy danh sách posts có phân trang
  async getPage(params?: FetchPostParams): Promise<PageResponse<Post>> {
    const page = params?.page ?? 0;
    const size = params?.size ?? 20;
    const status = params?.status;

    const res = await axiosClient.get<PageResponse<Post>>("/admin/posts", {
      params: { page, size, status },
    });

    return res.data;
  },

  // Tạo bài viết mới
  async create(data: Partial<Post>): Promise<Post> {
    const res = await axiosClient.post<Post>("/admin/posts", data);
    return res.data;
  },

  async generatePost(id: number): Promise<Post> {
    const res = await axiosClient.post<Post>(`/admin/posts/${id}/generate`);
    return res.data;
  },

  getById(id: number) {
    return axiosClient.get<Post>(`/admin/posts/${id}`).then((res) => res.data);
  },

  update(id: number, data: Partial<Post>) {
    return axiosClient.put<Post>(`/admin/posts/${id}`, data).then((res) => res.data);
  },

  delete(id: number) {
    return axiosClient.delete<void>(`/admin/posts/${id}`).then((res) => res.data);
  },

  restore(id: number) {
    return axiosClient.put<void>(`/admin/posts/${id}/restore`).then((res) => res.data);
  },

  publish(id: number) {
    return axiosClient.put<void>(`/admin/posts/${id}/publish`).then((res) => res.data);
  },
};

export default postService;