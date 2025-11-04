import { getAllTenants , getTenantById , createTenant , updateTenant , deleteTenant } from "../services/TenantService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TenantDTO, TenantCreateDTO, TenantUpdateDTO } from "../types/Tenant";

interface TenantState {
  tenants: TenantDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenants: [],
  loading: false,
  error: null,
};

export const fetchTenants = createAsyncThunk(
  "tenants/fetchAll",
  async () => {
    const response = await getAllTenants();
    return response;
  }
);

export const fetchTenantById = createAsyncThunk(
  "tenants/fetchById",
  async (id: number) => {
    const response = await getTenantById(id);
    return response;
  }
);

export const addTenant = createAsyncThunk(
  "tenants/add",
  async (data: TenantCreateDTO) => {
    const response = await createTenant(data);
    return response;
  }
);

export const editTenant = createAsyncThunk(
  "tenants/edit",
  async ({ id, data }: { id: number; data: TenantUpdateDTO }) => {
    const response = await updateTenant(id, data);
    return response;
  }
);

export const removeTenant = createAsyncThunk(
  "tenants/remove",
  async (id: number) => {
    await deleteTenant(id);
    return id;
  }
);

const tenantSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tenants";
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.tenants.push(action.payload);
      })
      .addCase(editTenant.fulfilled, (state, action) => {
        const index = state.tenants.findIndex(
          (tenant) => tenant.id === action.payload.id
        );
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
      })
      .addCase(removeTenant.fulfilled, (state, action) => {
        state.tenants = state.tenants.filter(
          (tenant) => tenant.id !== action.payload
        );
      });
  },
});

export default tenantSlice.reducer;