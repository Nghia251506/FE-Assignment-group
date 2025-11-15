import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageResponse, User } from "../../types/models";
import { userService, UserSearchParams } from "../../services/userService";

export interface UserState {
  items: User[];
  page?: PageResponse<User>;
  loading: boolean;
  error?: string | null;
}

const initialState: UserState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchUserPage = createAsyncThunk<
  PageResponse<User>,
  UserSearchParams | undefined
>("user/fetchPage", async (params, thunkAPI) => {
  try {
    return await userService.getPage(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Fetch users failed");
  }
});

export const createUser = createAsyncThunk<
  User,
  Partial<User>
>("user/create", async (payload, thunkAPI) => {
  try {
    return await userService.create(payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Create user failed");
  }
});

export const updateUser = createAsyncThunk<
  User,
  { id: number; data: Partial<User> }
>("user/update", async ({ id, data }, thunkAPI) => {
  try {
    return await userService.update(id, data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Update user failed");
  }
});

export const deleteUser = createAsyncThunk<
  number,
  number
>("user/delete", async (id, thunkAPI) => {
  try {
    await userService.delete(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Delete user failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchUserPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserPage.fulfilled,
        (state, action: PayloadAction<PageResponse<User>>) => {
          state.loading = false;
          state.page = action.payload;
          state.items = action.payload.content;
        }
      )
      .addCase(fetchUserPage.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Fetch users failed";
      });

    // create
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        const newUser = action.payload;
        state.items.unshift(newUser);
        if (state.page) {
          state.page.content.unshift(newUser);
          state.page.totalElements += 1;
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Create user failed";
      });

    // update
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.items = state.items.map((u) =>
          u.id === updated.id ? updated : u
        );
        if (state.page) {
          state.page.content = state.page.content.map((u) =>
            u.id === updated.id ? updated : u
          );
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Update user failed";
      });

    // delete
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.items = state.items.filter((u) => u.id !== deletedId);
        if (state.page) {
          state.page.content = state.page.content.filter(
            (u) => u.id !== deletedId
          );
          state.page.totalElements -= 1;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Delete user failed";
      });
  },
});

export default userSlice.reducer;
