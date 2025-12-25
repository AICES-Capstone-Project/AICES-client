// src/pages/Resources/Blog/components/BlogCard.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import type { Blog } from "../../../../types/blog.types";
import { makeExcerpt, safeThumb } from "./blog.utils";

export default function BlogCard({ blog }: { blog: Blog }) {
  const navigate = useNavigate();

  const excerpt = useMemo(() => makeExcerpt(blog.content, 160), [blog.content]);
  const thumb = safeThumb(blog.thumbnailUrl);

  return (
    <button
      type="button"
      className="aices-blog-card"
      onClick={() => navigate(`/resources/blog/${blog.blogId}`)}
    >
      <div className="aices-blog-card-thumb">
        {thumb ? <img src={thumb} alt={blog.title} /> : <div className="aices-blog-card-thumb-fallback" />}
      </div>

      <div className="aices-blog-card-body">
        <div className="aices-blog-card-meta">
          <span className="aices-blog-card-date">
            {blog.createdAt ? dayjs(blog.createdAt).format("DD MMM YYYY") : "—"}
          </span>
          <span className="dot">•</span>
          <span className="aices-blog-card-author">{blog.authorName || "—"}</span>
        </div>

        <div className="aices-blog-card-title">{blog.title}</div>
        <div className="aices-blog-card-excerpt">{excerpt}</div>

        <div className="aices-blog-card-cta">
          <span className="aices-blog-card-cta-text">Read article</span>
          <span className="aices-blog-card-cta-arrow">→</span>
        </div>
      </div>
    </button>
  );
}
