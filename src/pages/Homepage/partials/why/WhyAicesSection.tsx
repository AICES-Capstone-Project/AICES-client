// src/pages/Homepage/partials/why/WhyAicesSection.tsx
import "./why.css";

export default function WhyAicesSection() {
  return (
    <section className="why-wrapper">
      {/* light sources emerald phía sau */}
      <div className="background-light-source background-light-source--left" />
      <div className="background-light-source background-light-source--right" />

      <div className="why-inner">
        <h2 className="why-title">Vì sao nên dùng CV AI từ AICES?</h2>

        <div className="why-grid">
          {/* Block 1 */}
          <div className="why-item why-item--top">
            <div className="why-icon glass-icon">
              <span className="why-icon-glyph">AI</span>
            </div>

            <div className="why-content">
              <h3 className="why-item-title">Dành riêng cho ngành IT</h3>
              <p className="why-item-text">
                CV AI của AICES được thiết kế cho các vị trí IT từ Fresher đến Senior:
                đọc hiểu kỹ năng, dự án, tech stack và kinh nghiệm thực tế. Hệ thống
                không chỉ quét từ khóa mà thật sự hiểu “profile kỹ thuật” của ứng viên.
              </p>
            </div>
          </div>

          {/* Block 2 */}
          <div className="why-item why-item--bottom">
            <div className="why-content">
              <h3 className="why-item-title">Thiết kế đúng gu nhà tuyển dụng</h3>
              <p className="why-item-text">
                AICES học từ feedback của HR &amp; Hiring Manager: bố cục rõ ràng,
                highlight đúng điểm mạnh, loại bỏ thông tin thừa và làm nổi bật những
                yếu tố giúp tăng tỉ lệ được mời phỏng vấn cho các vị trí IT.
              </p>
            </div>

            <div className="why-icon glass-icon neumorphic-button">
              <span className="why-icon-glyph">✓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
