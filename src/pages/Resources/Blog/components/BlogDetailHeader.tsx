// src/pages/Resources/Blog/components/BlogDetailHeader.tsx
import dayjs from "dayjs";
import type { Blog } from "../../../../types/blog.types";
import { safeThumb } from "./blog.utils";
import { useNavigate } from "react-router-dom";

export default function BlogDetailHeader({ blog }: { blog: Blog }) {
  const navigate = useNavigate();
  const thumb = safeThumb(blog.thumbnailUrl);

  return (
    <div className="aices-blog-detail-header">
      <div className="aices-blog-detail-topbar">
        <button
          type="button"
          className="aices-blog-btn aices-blog-btn--ghost"
          onClick={() => navigate("/resources/blog")}
        >
          ← Back to Blog
        </button>
      </div>

      <h1 className="aices-blog-detail-title">{blog.title}</h1>

      <div className="aices-blog-detail-meta">
        <span>
          {blog.createdAt ? dayjs(blog.createdAt).format("DD/MM/YYYY HH:mm") : "—"}
        </span>
        <span className="dot">•</span>
        <span>{blog.authorName || "—"}</span>
      </div>

      {thumb ? (
        <div className="aices-blog-detail-cover">
          <img src={thumb} alt={blog.title} />
        </div>
      ) : null}
    </div>
  );
}
