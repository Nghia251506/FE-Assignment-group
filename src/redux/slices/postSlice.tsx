// src/redux/slices/postSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../types/models";
import type { PageResponse } from "../../types/models";
import postService, { FetchPostParams } from "../../services/postService";

interface PostState {
  items: Post[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk<
  { items: Post[]; total: number },         // <-- kiểu payload
  FetchPostParams | undefined
>("post/fetchPosts", async (params, thunkAPI) => {
  try {
    const data: PageResponse<Post> = await postService.getPage(params);
    return {
      items: data.content ?? [],
      total: data.totalElements ?? data.content.length,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message || "Fetch posts failed");
  }
});

export const updatePost = createAsyncThunk<
  Post,
  { id: number; data: Partial<Post> }
>("post/updatePost", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await postService.update(id, data);
  } catch (err: any) {
    return rejectWithValue(err.message || "Update post failed") as any;
  }
});

export const publishPost = createAsyncThunk<Post, number>(
  "post/publishPost",
  async (id, { rejectWithValue }) => {
    try {
      return await postService.publish(id);
    } catch (err: any) {
      return rejectWithValue(err.message || "Publish post failed") as any;
    }
  }
);

export const deletePost = createAsyncThunk<void, number>(
  "post/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await postService.delete(id);
    } catch (err: any) {
      return rejectWithValue(err.message || "Delete post failed") as any;
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPosts.fulfilled,
        (
          state,
          action: PayloadAction<{ items: Post[]; total: number }>
        ) => {
          state.loading = false;
          state.items = action.payload.items; // chỉ array -> không bị lỗi non-serializable
          state.total = action.payload.total;
        }
      )
      .addCase(fetchPosts.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Fetch posts failed";
      });

    // update
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    });

    // publish
    builder.addCase(publishPost.fulfilled, (state, action) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    });

    // delete
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const id = action.meta.arg;
      state.items = state.items.filter((p) => p.id !== id);
      state.total = Math.max(0, state.total - 1);
    });
  },
});

export default postSlice.reducer;
