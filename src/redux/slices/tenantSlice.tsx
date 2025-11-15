import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageResponse, Tenant } from "../../types/models";
import { tenantService, TenantSearchParams } from "../../services/tenantService";

export interface TenantState {
  items: Tenant[];
  page?: PageResponse<Tenant>;
  loading: boolean;
  error?: string | null;
}

const initialState: TenantState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTenantPage = createAsyncThunk<
  PageResponse<Tenant>,
  TenantSearchParams | undefined
>("tenant/fetchPage", async (params, thunkAPI) => {
  try {
    return await tenantService.getPage(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Fetch tenants failed");
  }
});

export const createTenant = createAsyncThunk<
  Tenant,
  Partial<Tenant>
>("tenant/create", async (payload, thunkAPI) => {
  try {
    return await tenantService.create(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Create tenant failed");
  }
});

export const updateTenant = createAsyncThunk<
  Tenant,
  { id: number; data: Partial<Tenant> }
>("tenant/update", async ({ id, data }, thunkAPI) => {
  try {
    return await tenantService.update(id, data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Update tenant failed");
  }
});

export const deleteTenant = createAsyncThunk<
  number,
  number
>("tenant/delete", async (id, thunkAPI) => {
  try {
    await tenantService.delete(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Delete tenant failed");
  }
});

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchTenantPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTenantPage.fulfilled,
        (state, action: PayloadAction<PageResponse<Tenant>>) => {
          state.loading = false;
          state.page = action.payload;
          state.items = action.payload.content;
        }
      )
      .addCase(fetchTenantPage.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Fetch tenants failed";
      });

    // create
    builder
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false;
        const newTenant = action.payload;
        state.items.unshift(newTenant);
        if (state.page) {
          state.page.content.unshift(newTenant);
          state.page.totalElements += 1;
        }
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Create tenant failed";
      });

    // update
    builder
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.items = state.items.map((t) =>
          t.id === updated.id ? updated : t
        );
        if (state.page) {
          state.page.content = state.page.content.map((t) =>
            t.id === updated.id ? updated : t
          );
        }
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Update tenant failed";
      });

    // delete
    builder
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.items = state.items.filter((t) => t.id !== deletedId);
        if (state.page) {
          state.page.content = state.page.content.filter(
            (t) => t.id !== deletedId
          );
          state.page.totalElements -= 1;
        }
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Delete tenant failed";
      });
  },
});

export default tenantSlice.reducer;
