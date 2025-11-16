import axiosClient from "../api/axiosClient";

export type CrawlResult = {
  totalFound?: number;
  totalInserted?: number;
  totalUpdated?: number;
  startedAt?: string;
  finishedAt?: string;
  message?: string;
};

const crawlerService = {
  // Đã có
  runLinksAll(): Promise<CrawlResult> {
    return axiosClient.post("/admin/crawler/links/all");
  },

  // ➕ MỚI: crawl content cho 1 source
  runContentBySource: async (sourceId: number, limit = 200) => {
    const res = await axiosClient.post(
      "/admin/crawler/content/by-source",
      null,
      {
        params: {
          sourceId, // => ?sourceId=2
          limit,    // => &limit=200
        },
      }
    );
    return res.data;
  },
};

export default crawlerService;
