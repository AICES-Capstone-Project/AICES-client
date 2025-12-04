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
  // Nếu backend sau này thêm field khác (updatedAt, status, ...) thì bổ sung thêm ở đây
}

export interface BlogListData {
  blogs: Blog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// GET /api/system/blogs/me
export interface GetMyBlogsResponse /* extends ApiResponse<BlogListData> */ {
  status: string;
  message: string;
  data: BlogListData;
}

// POST /api/system/blogs
export interface CreateBlogResponse /* extends ApiResponse<Blog> */ {
  status: string;
  message: string;
  data: Blog;
}

// Body khi tạo mới
export interface CreateBlogRequest {
  title: string;
  content: string;
  thumbnailUrl?: string | null;
}

// Body khi update
export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  thumbnailUrl?: string | null;
}
