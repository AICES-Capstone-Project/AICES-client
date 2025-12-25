// src/pages/Resources/Blog/components/BlogPager.tsx
import { Pagination } from "antd";

export default function BlogPager({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (ps: number) => void;
}) {
  if (!total) return null;

  return (
    <div className="aices-blog-pager">
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        pageSizeOptions={[6, 8, 12, 16, 24]}
        onChange={(p, ps) => {
          onPageChange(p);
          if (ps !== pageSize) onPageSizeChange(ps);
        }}
        showTotal={(t, range) => `${range[0]}–${range[1]} of ${t} posts`}
      />
    </div>
  );
}
