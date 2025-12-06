import { useState } from "react";
import "./articleExpand.css";

export default function ArticleExpand() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="article-section">
      <div className="article-container">
        <h2 className="article-title">
          Tạo CV IT chuyên nghiệp với AICES – Mẹo viết CV gây ấn tượng với nhà tuyển dụng
        </h2>

        <p className="article-intro">
          Một bản CV chuẩn chỉnh có thể là yếu tố giúp bạn nổi bật giữa hàng trăm ứng viên khác.
          Theo <span className="accent">báo cáo AI Scoring của AICES 2024</span>, nhà tuyển dụng chỉ dành
          <strong> 7–10 giây</strong> ở vòng lọc CV đầu tiên – vì vậy trình bày & dữ liệu là yếu tố cực quan trọng.
        </p>

        <button className="article-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Thu gọn" : "Xem thêm"}
          <span className={`toggle-icon ${expanded ? "open" : ""}`}>▾</span>
        </button>

        {expanded && (
          <div className="article-expanded">
            <h3>Sử dụng dữ liệu để làm nổi bật thành tựu trong CV</h3>
            <p>
              CV mạnh không phải liệt kê công việc bạn từng làm, mà là <strong>thành tựu được đo bằng số liệu</strong>.
              AICES gợi ý mô tả theo công thức:  
              <span className="accent"> Hành động → Tác động → Chỉ số đo được </span>
            </p>

            <ul className="article-list">
              <li>Tối ưu pipeline CI/CD giúp giảm thời gian deploy từ <span className="accent">30 phút còn 5 phút</span>.</li>
              <li>Xây lại kiến trúc FE tăng hiệu năng trang lên <span className="accent">+42%</span>.</li>
              <li>Huấn luyện AI CV Matching giúp tăng <span className="accent">tỉ lệ mời phỏng vấn +27%</span>.</li>
            </ul>

            <h3>Cá nhân hóa CV theo từng JD</h3>
            <p>
              AICES phân tích JD bạn dán vào, sau đó:
            </p>

            <ul className="article-list">
              <li>Highlight kỹ năng bắt buộc / ưu tiên.</li>
              <li>Phát hiện từ khóa kỹ thuật CV còn thiếu.</li>
              <li>Tính điểm phù hợp (Fit Score) và gợi ý cải thiện.</li>
            </ul>

            <label className="input-label">Dán thử JD để AICES phân tích (demo offline):</label>
            <textarea
              className="input-field"
              placeholder="Ví dụ: JD Backend/Frontend/QA… dán vào đây để xem AICES gợi ý cải thiện CV."
            />

            <h3>Tối ưu nhanh với AI nhưng vẫn giữ cá tính của bạn</h3>
            <p>
              Mục tiêu của AICES không phải biến mọi CV thành một khuôn mẫu giống nhau, mà là:
              <strong> Giữ chất riêng nhưng thể hiện đúng ngôn ngữ nhà tuyển dụng muốn thấy.</strong>
            </p>

            <ul className="article-list">
              <li>Tạo nhiều phiên bản CV phù hợp từng vị trí.</li>
              <li>AI sửa lỗi chính tả, format, cấu trúc.</li>
              <li>Xuất CV dạng PDF hoặc Link Profile chia sẻ.</li>
            </ul>

            <p>
              AICES giúp bạn <span className="accent">giảm 60–70% thời gian chỉnh CV</span> nhưng lại tăng mạnh
              tỉ lệ được mời phỏng vấn. Đây là tầm quan trọng của việc dùng CV AI hiện đại.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
