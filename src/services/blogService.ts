// src/services/blogService.ts

import api from "./api";
import { API_ENDPOINTS } from "./config";

import type {
  Blog,
  BlogListData,
  CreateBlogRequest,
  UpdateBlogRequest,
  GetMyBlogsResponse,
  CreateBlogResponse,
} from "../types/blog.types";

const BLOG = API_ENDPOINTS.BLOG;

export const blogService = {
  // GET /system/blogs/me?page=&pageSize=&search=
  getAllBlogs(params?: { page?: number; pageSize?: number; search?: string }) {
    return api.get<GetMyBlogsResponse>(BLOG.SYSTEM_GET_ALL, { params });
  },

  // GET /public/blogs?page=&pageSize=
  getPublicBlogs(params?: { page?: number; pageSize?: number }) {
    return api.get<BlogListData>(BLOG.PUBLIC_GET_ALL, { params });
  },
  // POST /system/blogs
  createBlog(payload: CreateBlogRequest) {
    return api.post<CreateBlogResponse>(BLOG.SYSTEM_CREATE, payload);
  },

  // PUT /system/blogs/{id}
  updateBlog(id: number, payload: UpdateBlogRequest) {
    return api.put<CreateBlogResponse>(BLOG.SYSTEM_UPDATE(id), payload);
  },

  // DELETE /system/blogs/{id}
  deleteBlog(id: number) {
    return api.delete<{ status: string; message: string }>(
      BLOG.SYSTEM_DELETE(id)
    );
  },
};

export type { Blog, BlogListData };
