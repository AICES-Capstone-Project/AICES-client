// src/pages/Resources/Blog/components/BlogEmpty.tsx
import { useNavigate } from "react-router-dom";

export default function BlogEmpty() {
  const navigate = useNavigate();

  return (
    <div className="aices-blog-empty">
      <div className="aices-blog-empty-card">
        <div className="aices-blog-empty-title">No posts found</div>
        <div className="aices-blog-empty-desc">
          Try adjusting your search or check back later.
        </div>

        <button
          type="button"
          className="aices-blog-btn aices-blog-btn--ghost"
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}
