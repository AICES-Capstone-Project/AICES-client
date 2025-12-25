// src/pages/Resources/Blog/components/BlogDetailSidebar.tsx
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { Blog } from "../../../../types/blog.types";

export default function BlogDetailSidebar({
  recent,
  currentId,
}: {
  recent: Blog[];
  currentId: number;
}) {
  const navigate = useNavigate();

  return (
    <div className="aices-blog-detail-sidebar">
      <div className="aices-blog-detail-side-card">
        <div className="aices-blog-detail-side-title">Recent posts</div>

        <div className="aices-blog-detail-side-list">
          {(recent || []).slice(0, 5).map((b) => (
            <button
              key={b.blogId}
              type="button"
              className="aices-blog-detail-side-item"
              onClick={() => navigate(`/resources/blog/${b.blogId}`)}
              disabled={b.blogId === currentId}
            >
              <div className="aices-blog-detail-side-item-title">{b.title}</div>
              <div className="aices-blog-detail-side-item-meta">
                <span>
                  {b.createdAt ? dayjs(b.createdAt).format("DD MMM") : "—"}
                </span>
                <span className="dot">•</span>
                <span>{b.authorName || "—"}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="aices-blog-detail-side-card aices-blog-detail-side-cta">
        <div className="aices-blog-detail-side-title">Want more insights?</div>
        <div className="aices-blog-detail-side-desc">
          Explore best practices for AI-powered recruitment and smarter hiring workflows.
        </div>
        <button
          type="button"
          className="aices-blog-btn aices-blog-btn--primary"
          onClick={() => navigate("/resources/blog")}
        >
          Browse all posts
        </button>
      </div>
    </div>
  );
}
