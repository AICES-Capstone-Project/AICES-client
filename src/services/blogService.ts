// src/services/blogService.ts

import api from "./api";
import { API_ENDPOINTS } from "./config";

import type {
  Blog,
  BlogListData,
  GetMyBlogsResponse,
  CreateBlogResponse,
  GetPublicBlogsResponse,
  GetPublicBlogByIdResponse,
} from "../types/blog.types";

const BLOG = API_ENDPOINTS.BLOG;

const mapPublicToSystemListData = (
  d: GetPublicBlogsResponse["data"]
): BlogListData => ({
  blogs: d.blogs,
  total: d.totalCount,
  page: d.page,
  pageSize: d.pageSize,
  totalPages: d.totalPages,
});

export const blogService = {
  /**
   * ✅ SYSTEM LIST (Admin/Manager/Staff) -> DÙNG CHUNG PUBLIC LIST
   * UI cũ đang gọi getAllBlogs() và đọc res.data.data.blogs / total / page...
   * => Ta trả về y hệt GetMyBlogsResponse để KHÔNG ĐỤNG BlogList.tsx
   *
   * NOTE:
   * - search: public có thể chưa support => tạm ignore hoặc tự filter FE nếu muốn
   */
  async getAllBlogs(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) {
    // gọi public list
    const res = await api.get<GetPublicBlogsResponse>(BLOG.PUBLIC_GET_ALL, {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        // search: params?.search, // nếu BE public support thì mở dòng này
      },
    });

    const mapped: BlogListData = mapPublicToSystemListData(res.data.data);

    // wrap lại đúng format system response
    const wrapped: GetMyBlogsResponse = {
      status: res.data.status,
      message: res.data.message,
      data: mapped,
    };

    // trả về axios-like response để các nơi khác không bị lệch
    return { ...res, data: wrapped };
  },

  /**
   * ✅ PUBLIC LIST
   * (Nếu bạn dùng ở Homepage/Resources)
   * BE trả wrapper {status,message,data{ totalCount... }}
   * => map về BlogListData { total } cho đồng nhất
   */
  async getPublicBlogs(params?: { page?: number; pageSize?: number }) {
    const res = await api.get<GetPublicBlogsResponse>(BLOG.PUBLIC_GET_ALL, {
      params,
    });

    const mapped: BlogListData = mapPublicToSystemListData(res.data.data);

    // trả về axios-like response, data là BlogListData (giống bạn đang làm)
    return { ...res, data: mapped };
  },

  /** ✅ PUBLIC DETAIL: GET /public/blogs/{id} */
  getPublicBlogById(id: number) {
    return api.get<GetPublicBlogByIdResponse>(BLOG.PUBLIC_GET_BY_ID(id));
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
    if (payload.thumbnailFile)
      fd.append("ThumbnailFile", payload.thumbnailFile);

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
    if (payload.thumbnailFile)
      fd.append("ThumbnailFile", payload.thumbnailFile);

    return api.put<CreateBlogResponse>(BLOG.SYSTEM_UPDATE(id), fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** DELETE /system/blogs/{id} */
  deleteBlog(id: number) {
    return api.delete<{ status: string; message: string }>(
      BLOG.SYSTEM_DELETE(id)
    );
  },
};

export type { Blog, BlogListData };
