// src/pages/SystemPages/Content/Blogs/BlogList.tsx

import { useCallback, useEffect, useState } from "react";
import { Card, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import { blogService } from "../../../../services/blogService";
import type { Blog } from "../../../../types/blog.types";

import BlogToolbar from "./components/BlogToolbar";
import BlogCardList from "./components/BlogCardList";

import BlogModal from "./components/BlogModal";
import type { BlogFormValues } from "./components/BlogModal";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  const fetchBlogs = useCallback(
    async (page?: number, pageSize?: number) => {
      setLoading(true);
      try {
        const current = page ?? pagination.current ?? 1;
        const size = pageSize ?? pagination.pageSize ?? 10;

        const res = await blogService.getAllBlogs({
          page: current,
          pageSize: size,
        });

        const data = res.data.data;

        setBlogs(data.blogs);
        setPagination((prev) => ({
          ...prev,
          current: data.page,
          pageSize: data.pageSize,
          total: data.total,
        }));
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load blogs";
        message.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize]
  );

  useEffect(() => {
    fetchBlogs(1, pagination.pageSize ?? 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (pag: TablePaginationConfig) => {
    const current = pag.current ?? 1;
    const size = pag.pageSize ?? 10;

    setPagination((prev) => ({
      ...prev,
      current,
      pageSize: size,
    }));

    fetchBlogs(current, size);
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setCurrentBlog(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (blog: Blog) => {
    setModalMode("edit");
    setCurrentBlog(blog);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const res = await blogService.deleteBlog(id);
      message.success(res.data.message || "Blog deleted successfully");
      fetchBlogs(pagination.current ?? 1, pagination.pageSize ?? 10);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete blog";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: BlogFormValues) => {
    try {
      setModalSubmitting(true);

      if (modalMode === "create") {
        const res = await blogService.createBlog(values);
        message.success(res.data.message || "Blog created successfully");
      } else if (modalMode === "edit" && currentBlog) {
        const res = await blogService.updateBlog(currentBlog.blogId, values);
        message.success(res.data.message || "Blog updated successfully");
      }

      setModalOpen(false);
      setCurrentBlog(null);

      fetchBlogs(pagination.current ?? 1, pagination.pageSize ?? 10);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save blog";
      message.error(errMsg);
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleCancelModal = () => {
    setModalOpen(false);
    setCurrentBlog(null);
  };

  return (
    <div>
      <Card className="aices-card">
        {/* 🔥 TOP BAR CHUẨN AICES */}
        <div className="company-header-row">
          <div className="company-left">
            <BlogToolbar onCreate={handleOpenCreate} />
          </div>
        </div>

        {/* TABLE */}
        <div className="accounts-table-wrapper">
          <BlogCardList
            loading={loading}
            data={blogs}
            pagination={pagination}
            onChangePage={handleChangePage}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {/* MODAL */}
      <BlogModal
        open={modalOpen}
        mode={modalMode}
        loading={modalSubmitting}
        initialValues={
          currentBlog
            ? {
                title: currentBlog.title,
                content: currentBlog.content,
                thumbnailUrl: currentBlog.thumbnailUrl || undefined,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={handleCancelModal}
      />
    </div>
  );
}
