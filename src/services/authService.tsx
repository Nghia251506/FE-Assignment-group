import axiosClient from "../api/axiosClient";
import type { User } from "../types/models"; // reuse type

export interface LoginCredentials {
  username: string;
  password: string;
}

// LOGIN → BE set cookie + trả userDto
export const loginApi = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axiosClient.post("api/auth/login", credentials, {
    withCredentials: true, // Đảm bảo gửi cookie kèm theo yêu cầu
  });
  return response.data; // BE trả UserDto
};

// LẤY USER TỪ /me (khi F5)
export const fetchMeApi = async (): Promise<User> => {
  const response = await axiosClient.get<User>("api/auth/me", {
    withCredentials: true, // Đảm bảo gửi cookie kèm theo yêu cầu
  });
  return response.data;
};

// LOGOUT → xóa cookie ở BE
export const logoutApi = async (): Promise<void> => {
  await axiosClient.post("api/auth/logout", {}, {
    withCredentials: true, // Đảm bảo gửi cookie kèm theo yêu cầu
  });
};

