import axiosClient from "../api/axiosClient";
import { Dashboard } from "../types/models";

export const dashboardApi = {
    getCount() {
    return axiosClient.get<Dashboard[]>("/admin/stats");
  },
}