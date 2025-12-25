// src/pages/Resources/Blog/components/BlogGrid.tsx
import { Spin } from "antd";
import type { Blog } from "../../../../types/blog.types";
import BlogCard from "./BlogCard";

export default function BlogGrid({
  blogs,
  loading,
}: {
  blogs: Blog[];
  loading?: boolean;
}) {
  return (
    <div className="aices-blog-grid-wrap">
      {loading ? (
        <div className="aices-blog-grid-loading">
          <Spin size="large" />
        </div>
      ) : (
        <div className="aices-blog-grid">
          {blogs.map((b) => (
            <BlogCard key={b.blogId} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
}
