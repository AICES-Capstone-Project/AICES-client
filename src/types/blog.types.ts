// src/types/blog.types.ts

export interface Blog {
  blogId: number;
  userId: number;
  authorName: string | null;
  title: string;
  slug?: string;
  content: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

/** ✅ GIỮ NGUYÊN để không đụng code System cũ */
export interface BlogListData {
  blogs: Blog[];
  total: number; // system đang xài total
  page: number;
  pageSize: number;
  totalPages: number;
}

/** ✅ Public list BE trả totalCount */
export interface PublicBlogListData {
  blogs: Blog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** ===== SYSTEM WRAPPERS ===== */
export interface GetMyBlogsResponse {
  status: string;
  message: string;
  data: BlogListData;
}

export interface CreateBlogResponse {
  status: string;
  message: string;
  data: Blog;
}

/** ===== PUBLIC WRAPPERS (Swagger) ===== */
export interface GetPublicBlogsResponse {
  status: string;
  message: string;
  data: PublicBlogListData;
}

export interface GetPublicBlogByIdResponse {
  status: string;
  message: string;
  data: Blog;
}

// Body khi tạo mới (nếu cần dùng JSON body; hiện bạn dùng multipart nên có thể bỏ)
export interface CreateBlogRequest {
  title: string;
  content: string;
  thumbnailUrl?: string | null;
}

// Body khi update (multipart bạn đang dùng, type này vẫn ok để dành)
export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  thumbnailUrl?: string | null;
}
