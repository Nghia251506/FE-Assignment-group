import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CrawlLog, PageResponse } from "../../types/models";
import {
  crawlLogService,
  CrawlLogSearchParams,
} from "../../services/crawlLogService";

export interface CrawlLogState {
  page?: PageResponse<CrawlLog>;
  loading: boolean;
  error?: string | null;
}

const initialState: CrawlLogState = {
  loading: false,
  error: null,
};

export const fetchCrawlLogPage = createAsyncThunk<
  PageResponse<CrawlLog>,
  CrawlLogSearchParams | undefined
>("crawlLog/fetchPage", async (params, thunkAPI) => {
  try {
    return await crawlLogService.getPage(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Fetch crawl logs failed");
  }
});

const crawlLogSlice = createSlice({
  name: "crawlLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrawlLogPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCrawlLogPage.fulfilled,
        (state, action: PayloadAction<PageResponse<CrawlLog>>) => {
          state.loading = false;
          state.page = action.payload;
        }
      )
      .addCase(fetchCrawlLogPage.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Fetch crawl logs failed";
      });
  },
});

export default crawlLogSlice.reducer;
