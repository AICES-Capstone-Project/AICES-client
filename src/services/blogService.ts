// src/services/blogService.ts

import api from "./api";
import { API_ENDPOINTS } from "./config";

import type {
  Blog,
  BlogListData,
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

  /** ✅ POST /system/blogs (multipart/form-data) */
  createBlogForm(payload: {
    title: string;
    content: string;
    thumbnailFile?: File | null;
  }) {
    const fd = new FormData();
    fd.append("Title", payload.title);
    fd.append("Content", payload.content);
    if (payload.thumbnailFile) fd.append("ThumbnailFile", payload.thumbnailFile);

    return api.post<CreateBlogResponse>(BLOG.SYSTEM_CREATE, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** ✅ PUT /system/blogs/{id} (multipart/form-data) */
  updateBlogForm(
    id: number,
    payload: {
      title?: string;
      content?: string;
      thumbnailFile?: File | null;
    }
  ) {
    const fd = new FormData();
    if (payload.title !== undefined) fd.append("Title", payload.title);
    if (payload.content !== undefined) fd.append("Content", payload.content);
    if (payload.thumbnailFile) fd.append("ThumbnailFile", payload.thumbnailFile);

    return api.put<CreateBlogResponse>(BLOG.SYSTEM_UPDATE(id), fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // DELETE /system/blogs/{id}
  deleteBlog(id: number) {
    return api.delete<{ status: string; message: string }>(BLOG.SYSTEM_DELETE(id));
  },
};

export type { Blog, BlogListData };
