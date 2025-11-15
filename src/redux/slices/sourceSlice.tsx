// src/redux/slices/sourceSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Source } from "../../types/models";
import {
  sourceService,
  SourceCreatePayload,
  SourceUpdatePayload,
} from "../../services/sourceService";

interface SourceState {
  items: Source[];
  loading: boolean;
  error?: string | null;
  defaultTenantId: number;
}

const initialState: SourceState = {
  items: [],
  loading: false,
  error: null,
  defaultTenantId: 1,   // ✅ giống Category
};

// GET /api/admin/sources/tenant/{tenantId}
export const fetchSources = createAsyncThunk<
  Source[],
  number | undefined,
  { state: RootState }
>("source/fetchByTenant", async (tenantIdArg, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const tenantId =
      tenantIdArg ?? state.source.defaultTenantId ?? 1; // fallback 1

    const data = await sourceService.getByTenant(tenantId);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err.message || "Fetch sources failed"
    );
  }
});

// POST /api/admin/sources
export const createSource = createAsyncThunk<
  Source,
  SourceCreatePayload,
  { state: RootState }
>("source/create", async (payload, { rejectWithValue }) => {
  try {
    const data = await sourceService.create(payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err.message || "Create source failed"
    );
  }
});

// PUT /api/admin/sources/{id}
export const updateSource = createAsyncThunk<
  Source,
  { id: number; data: SourceUpdatePayload }
>("source/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await sourceService.update(id, data);
    return res;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err.message || "Update source failed"
    );
  }
});

// DELETE /api/admin/sources/{id}
export const deleteSource = createAsyncThunk<
  number,
  number
>("source/delete", async (id, { rejectWithValue }) => {
  try {
    await sourceService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err.message || "Delete source failed"
    );
  }
});

const sourceSlice = createSlice({
  name: "source",
  initialState,
  reducers: {
    setDefaultTenantId(state, action: PayloadAction<number>) {
      state.defaultTenantId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Fetch sources failed";
      })
      // create
      .addCase(createSource.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // update
      .addCase(updateSource.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      // delete
      .addCase(deleteSource.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export const { setDefaultTenantId } = sourceSlice.actions;
export default sourceSlice.reducer;
