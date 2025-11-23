// src/redux/slices/tagSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import tagService, { TagPayload } from "../../services/tagService";
import type { Tag } from "../../types/models";

interface TagState {
  items: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTags = createAsyncThunk("tag/fetchTags", async () => {
  return await tagService.getAll();
});

export const createTag = createAsyncThunk<Tag, TagPayload>(
  "tag/createTag",
  async (data, { rejectWithValue }) => {
    try {
      return await tagService.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Tạo tag thất bại");
    }
  }
);

export const upsertTag = createAsyncThunk<Tag, TagPayload>(
  "tag/upsertTag",
  async (data, { rejectWithValue }) => {
    try {
      return await tagService.upsert(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Upsert tag thất bại");
    }
  }
);

export const updateTag = createAsyncThunk<
  Tag,
  { id: number; data: Partial<TagPayload> }
>("tag/updateTag", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await tagService.update(id, data);
  } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Cập nhật tag thất bại");
  }
});

export const deleteTag = createAsyncThunk<void, number>(
  "tag/deleteTag",
  async (id, { rejectWithValue }) => {
    try {
      await tagService.delete(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Xóa tag thất bại");
    }
  }
);

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create / Upsert
      .addCase(createTag.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(upsertTag.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.name.toLowerCase() === action.payload.name.toLowerCase());
        if (idx !== -1) {
          state.items[idx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })

      // Update
      .addCase(updateTag.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // Delete
      .addCase(deleteTag.fulfilled, (state, action) => {
        // action.meta.arg là id
        state.items = state.items.filter((t) => t.id !== action.meta.arg);
      });
  },
});

export default tagSlice.reducer;