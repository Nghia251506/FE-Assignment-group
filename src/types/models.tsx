// --- COMMON ---

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index (0-based)
  first: boolean;
  last: boolean;
}


// --- USER ---

export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

export interface Dashboard {
  totalPosts: number | 0;
  totalUsers7d: number | 0;
  todayUsers: number | 0;
  totalSources: number | 0;
  totalCategories: number | 0;
}

export interface User {
  id: number;
  username: string;
  passwordHash?: string; // BE không trả cũng được
  fullName?: string;
  email?: string;
  roleCode: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  roleName:string;
}

// --- CATEGORY ---

export interface Category {
  slug: string;
  id: number;
  parentId?:number | null;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- SOURCE ---

export interface Source {
  id?: number;

  categoryId?: number;
  categoryName?: string;   // nếu BE trả ra kèm tên category

  // Cấu hình crawler
  name?: string;
  baseUrl?: string;
  listUrl?: string;
  listItemSelector?: string;
  linkAttr?: string;
  titleSelector?: string;
  contentSelector?: string;
  thumbnailSelector?: string;
  authorSelector?: string;

  isActive?: boolean;
  note?: string;

  // Thống kê (nếu BE có)
  articleCount?: number;
}

// --- POST ---

export type PostStatus = "pending" | "draft" | "published" | "removed";
export type DeleteStatus = "Active" | "Deleted";

export interface Post {
  metaDescription: string;
  metaTitle: string;
  categoryId: number;
  id: number;
  source?: Source | null;
  category?: Category | null;
  originUrl: string;
  title?: string;
  slug?: string;
  summary?: string;
  content?: string | null;     // text
  contentRaw?: string | null;  // HTML
  thumbnail?: string;
  status: PostStatus;
  deleteStatus: DeleteStatus;
  publishedAt?: string;
  viewCount: number;
  createdBy?: number;
  updatedBy?: number;
  deletedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  baseUrl?: string;
  categoryName?: string;
  tagIds?: number[];        // ← THÊM DÒNG NÀY
  tags?: Tag[];
}

// --- TAG & POST_TAG (FE thường không quản lý trực tiếp PostTag) ---

export interface Tag {
  postCount: number;
  color: string;
  id: number;
  name: string;
  slug?: string;
  createdAt?: string;
}

export interface PostTag {
  id: number;
  post: Post;
  tag: Tag;
}

// --- CRAWL LOG ---

export type CrawlType = "LINK" | "CONTENT";
export type CrawlStatus = "SUCCESS" | "ERROR" | "PARTIAL";

export type TriggeredBy = "MANUAL" | "SCHEDULED";

export interface CrawlLog {
  id: number;
  source?: Source | null;
  crawlType: CrawlType;
  status: CrawlStatus;
  triggeredBy?: TriggeredBy;
  totalFound?: number;
  totalInserted?: number;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
}
