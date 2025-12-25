// src/pages/Resources/Blog/components/BlogDetailBody.tsx
export default function BlogDetailBody({ html }: { html: string }) {
  return (
    <div
      className="aices-blog-detail-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
