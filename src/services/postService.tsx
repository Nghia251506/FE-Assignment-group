import axiosClient from "../api/axiosClient";
import type { Post } from "../types/models";
import type { PageResponse } from "../types/models";

export interface FetchPostParams {
  page?: number;
  size?: number;
  status?: string; // nếu sau này muốn filter theo status (pending/published...)
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

    // ⚠️ Trả về res.data để tránh lưu AxiosResponse (headers...) vào Redux
    return res.data;
  },

  // mấy hàm này để sau Articles dùng thêm
  getById(id: number) {
    return axiosClient
      .get<Post>(`/admin/posts/${id}`)
      .then((res) => res.data);
  },

  update(id: number, data: Partial<Post>) {
    return axiosClient
      .put<Post>(`/admin/posts/${id}`, data)
      .then((res) => res.data);
  },

  delete(id: number) {
    return axiosClient
      .delete<void>(`/admin/posts/${id}`)
      .then((res) => res.data);
  },

  restore(id: number) {
    return axiosClient
      .put<void>(`/admin/posts/${id}/restore`)
      .then((res) => res.data);
  },

  publish(id: number) {
    return axiosClient
      .put<void>(`/admin/posts/${id}/publish`)
      .then((res) => res.data);
  },
};

export default postService;
