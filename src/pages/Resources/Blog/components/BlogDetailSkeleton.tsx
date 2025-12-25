// src/pages/Resources/Blog/components/BlogDetailSkeleton.tsx
import { Skeleton } from "antd";

export default function BlogDetailSkeleton() {
  return (
    <div className="aices-blog-detail aices-blog-detail--loading">
      <div className="aices-blog-detail-grid">
        <div className="aices-blog-detail-main">
          <Skeleton active title={{ width: "70%" }} paragraph={{ rows: 3 }} />
          <Skeleton.Image active style={{ width: "100%", height: 320 }} />
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>

        <div className="aices-blog-detail-side">
          <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 8 }} />
        </div>
      </div>
    </div>
  );
}
