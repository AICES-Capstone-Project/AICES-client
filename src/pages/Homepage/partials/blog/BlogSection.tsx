import "./blog.css";

const blogList = [
  {
    id: 1,
    title: "Mẹo viết CV IT chuẩn giúp tăng 90% tỷ lệ đậu vòng CV",
    category: "CV IT",
    thumbnail:
      "https://itviec.com/blog/wp-content/uploads/2023/09/mau-cv-it-chuan.jpg",
    url: "https://itviec.com/blog/cv-gom-nhung-gi/?button_click=blog_clicked&locale=vi",
  },
  {
    id: 2,
    title: "CV gồm những gì? Cách trình bày CV đẹp và chuyên nghiệp",
    category: "Ứng dụng & Thông tin",
    thumbnail:
      "https://itviec.com/blog/wp-content/uploads/2023/09/cv-gom-nhung-gi-banner.jpg",
    url: "https://itviec.com/blog/cv-gom-nhung-gi/?button_click=blog_clicked&locale=vi",
  },
  {
    id: 3,
    title: "Top lỗi viết CV khiến ứng viên IT bị loại ngay lập tức",
    category: "Kinh nghiệm",
    thumbnail:
      "https://itviec.com/blog/wp-content/uploads/2023/09/cv-it-loi-pho-bien.jpg",
    url: "https://itviec.com/blog/cv-gom-nhung-gi/?button_click=blog_clicked&locale=vi",
  },
];

export default function BlogSection() {
  return (
    <section className="blog-wrapper">
      <div className="blog-header">
        <h2 className="blog-title">Mẹo viết CV IT từ AICES</h2>
        <a
          href="https://itviec.com/blog/cv-gom-nhung-gi/?button_click=blog_clicked&locale=vi"
          target="_blank"
          className="blog-view-all"
        >
          Xem tất cả →
        </a>
      </div>

      <div className="blog-list">
        {blogList.map((blog) => (
          <a
            key={blog.id}
            href={blog.url}
            target="_blank"
            className="blog-card"
          >
            <div className="card-thumbnail">
              <img src={blog.thumbnail} alt={blog.title} />
              <span className="card-tag">{blog.category}</span>
            </div>

            <div className="card-content">
              <h3 className="card-title">{blog.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
