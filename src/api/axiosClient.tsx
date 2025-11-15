import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8888/api", // 🔁 đổi nếu BE host khác
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor request (nếu có token thì gắn vào)
axiosClient.interceptors.request.use(
  (config) => {
    // TODO: nếu sau này có login thì lấy token từ localStorage / redux ở đây
    // const token = localStorage.getItem("access_token");
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Có thể handle lỗi chung ở đây (401, 403, 500...)
    console.error("[axiosClient] Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
