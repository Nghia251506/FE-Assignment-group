import axiosClient from "../api/axiosClient";
import { CrawlLog, PageResponse } from "../types/models";

const BASE_URL = "/api/admin/crawl-logs";

export interface CrawlLogSearchParams {
  page?: number;
  size?: number;
  sourceId?: number;
  crawlType?: string;   // "LINK" | "CONTENT"
  status?: string;      // "SUCCESS" | "ERROR" | ...
}

export const crawlLogService = {
  async getPage(params: CrawlLogSearchParams = {}): Promise<PageResponse<CrawlLog>> {
    const response = await axiosClient.get<PageResponse<CrawlLog>>(BASE_URL, {
      params,
    });
    return response.data;
  },
};
