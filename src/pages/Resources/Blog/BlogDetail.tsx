// src/pages/Resources/Blog/BlogDetail.tsx
import "../resources.css";
import "./Blog.css";

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import ResourcesLayout from "../components/ResourcesLayout";
import { blogService } from "../../../services/blogService";
import type { Blog } from "../../../types/blog.types";

import BlogDetailHeader from "./components/BlogDetailHeader";
import BlogDetailBody from "./components/BlogDetailBody";
import BlogDetailSidebar from "./components/BlogDetailSidebar";
import BlogDetailSkeleton from "./components/BlogDetailSkeleton";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const blogId = useMemo(() => Number(id), [id]);

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);

  // optional: recent posts sidebar
  const [recent, setRecent] = useState<Blog[]>([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!blogId || Number.isNaN(blogId)) return;

      setLoading(true);
      try {
        const res = await blogService.getPublicBlogById(blogId);
        if (!mounted) return;
        setBlog(res.data.data);
      } catch {
        if (!mounted) return;
        setBlog(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [blogId]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await blogService.getPublicBlogs({ page: 1, pageSize: 6 });
        if (!mounted) return;
        setRecent((res.data.blogs ?? []).filter((b) => b.blogId !== blogId));
      } catch {
        if (!mounted) return;
        setRecent([]);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [blogId]);

  const lastUpdated = useMemo(() => {
    if (!blog?.createdAt) return "—";
    return dayjs(blog.createdAt).format("MMMM YYYY");
  }, [blog]);

  return (
    <ResourcesLayout
      title={
        <>
          AICES <span className="resources-title-accent">Blog</span>
        </>
      }
      subtitle="Insights, technology, and best practices for AI-powered recruitment"
      lastUpdated={lastUpdated}
      footerRight="Resources • Blog"
      showSidebar={false}
    >
      {loading ? (
        <BlogDetailSkeleton />
      ) : !blog ? (
        <div className="aices-blog-detail aices-blog-detail--notfound">
          <div className="aices-blog-detail-notfound-card">
            <div className="aices-blog-detail-notfound-title">
              Blog post not found
            </div>
            <div className="aices-blog-detail-notfound-desc">
              The post may have been removed or the link is incorrect.
            </div>

            <button
              className="aices-blog-btn aices-blog-btn--primary"
              onClick={() => navigate("/resources/blog")}
              type="button"
            >
              Back to Blog
            </button>
          </div>
        </div>
      ) : (
        <div className="aices-blog-detail">
          <div className="aices-blog-detail-grid">
            <div className="aices-blog-detail-main">
              <BlogDetailHeader blog={blog} />
              <BlogDetailBody html={blog.content || "<p>—</p>"} />
            </div>

            <div className="aices-blog-detail-side">
              <BlogDetailSidebar recent={recent} currentId={blog.blogId} />
            </div>
          </div>
        </div>
      )}
    </ResourcesLayout>
  );
}
