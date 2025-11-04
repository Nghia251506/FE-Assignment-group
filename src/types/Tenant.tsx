export interface TenantDTO {
  id: number;
  code: string;
  name: string;
  contactPhone: string;
  contactEmail: string;
  maxUsers: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantCreateDTO {
  code: string;
  name: string;
  contactPhone: string;
  contactEmail: string;
  maxUsers?: number | null;
}

export interface TenantUpdateDTO {
  name?: string;
  contactPhone?: string;
  contactEmail?: string;
  maxUsers?: number | null;
  isActive?: boolean;
}