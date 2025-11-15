// src/redux/slices/categorySlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { categoryApi, CategoryPayload } from "../../services/categoryService";
import type { Category } from "../../types/models";

type CategoryState = {
  items: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

// GET /api/admin/categories/tenant/{tenantId}
export const fetchCategories = createAsyncThunk<
  Category[],
  number | undefined
>("category/fetchCategories", async (tenantId, { rejectWithValue }) => {
  try {
    const res = await categoryApi.getByTenant(tenantId);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Fetch categories failed");
  }
});

// POST /api/admin/categories
export const createCategory = createAsyncThunk<
  Category,
  CategoryPayload
>("category/createCategory", async (payload, { rejectWithValue }) => {
  try {
    const res = await categoryApi.create(payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Create category failed");
  }
});

// PUT /api/admin/categories/{id}
export const updateCategory = createAsyncThunk<
  Category,
  { id: number; data: CategoryPayload }
>("category/updateCategory", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await categoryApi.update(id, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Update category failed");
  }
});

// DELETE /api/admin/categories/{id}
export const deleteCategory = createAsyncThunk<number, number>(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || "Delete category failed");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      });

    // create
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    // update
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    });

    // delete
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    });
  },
});

export default categorySlice.reducer;
