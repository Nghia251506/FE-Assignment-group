import axiosClient from "../axios/AxiosClient";
import { TenantDTO, TenantCreateDTO, TenantUpdateDTO } from "../types/Tenant";

const BASE_URL = "/admin/tenants";
export const getAllTenants = (): Promise<TenantDTO[]> => {
  return axiosClient.get<TenantDTO[]>(BASE_URL);
};

export const getTenantById = (id: number): Promise<TenantDTO> => {
  return axiosClient.get<TenantDTO>(`${BASE_URL}/${id}`);
};

export const createTenant = (data: TenantCreateDTO): Promise<TenantDTO> => {
  return axiosClient.post<TenantDTO>(BASE_URL, data);
};
export const updateTenant = (
  id: number,
  data: TenantUpdateDTO
): Promise<TenantDTO> => {
  return axiosClient.put<TenantDTO>(`${BASE_URL}/${id}`, data);
};
export const deleteTenant = (id: number ): Promise<void> => {
  return axiosClient.delete<void>(`${BASE_URL}/${id}`);
};
