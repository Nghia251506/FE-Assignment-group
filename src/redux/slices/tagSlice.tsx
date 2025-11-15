import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageResponse, Tag } from "../../types/models";
import { tagService, TagSearchParams } from "../../services/tagService";

export interface TagState {
  items: Tag[];
  page?: PageResponse<Tag>;
  loading: boolean;
  error?: string | null;
}

const initialState: TagState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTagPage = createAsyncThunk<
  PageResponse<Tag>,
  TagSearchParams | undefined
>("tag/fetchPage", async (params, thunkAPI) => {
  try {
    return await tagService.getPage(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Fetch tags failed");
  }
});

export const fetchAllTags = createAsyncThunk<Tag[]>(
  "tag/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await tagService.getAll();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Fetch all tags failed");
    }
  }
);

export const createTag = createAsyncThunk<
  Tag,
  Partial<Tag>
>("tag/create", async (payload, thunkAPI) => {
  try {
    return await tagService.create(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Create tag failed");
  }
});

export const deleteTag = createAsyncThunk<
  number,
  number
>("tag/delete", async (id, thunkAPI) => {
  try {
    await tagService.delete(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Delete tag failed");
  }
});

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch page
    builder
      .addCase(fetchTagPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTagPage.fulfilled,
        (state, action: PayloadAction<PageResponse<Tag>>) => {
          state.loading = false;
          state.page = action.payload;
          state.items = action.payload.content;
        }
      )
      .addCase(fetchTagPage.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Fetch tags failed";
      });

    // fetch all (cho chỗ select tags)
    builder
      .addCase(fetchAllTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllTags.fulfilled,
        (state, action: PayloadAction<Tag[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchAllTags.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Fetch all tags failed";
      });

    // create
    builder
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        const newTag = action.payload;
        state.items.unshift(newTag);
        if (state.page) {
          state.page.content.unshift(newTag);
          state.page.totalElements += 1;
        }
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Create tag failed";
      });

    // delete
    builder
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
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
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Delete tag failed";
      });
  },
});

export default tagSlice.reducer;
