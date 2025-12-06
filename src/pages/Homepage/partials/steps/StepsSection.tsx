// src/pages/Homepage/partials/steps/StepsSection.tsx
import "./steps.css";

interface StepItem {
  id: number;
  label: string;
  title: string;
  description: string;
  icon: string;
}

const steps: StepItem[] = [
  {
    id: 1,
    label: "Bước 01",
    title: "Tạo tài khoản AICES",
    description:
      "Đăng ký hoặc đăng nhập vào AICES để đồng bộ dữ liệu ứng viên, job và lịch sử tuyển dụng.",
    icon: "⇥",
  },
  {
    id: 2,
    label: "Bước 02",
    title: "Hoàn thành hồ sơ & để AI phân tích",
    description:
      "Điền kỹ năng, kinh nghiệm, dự án, tech stack. AICES AI tự động phân tích điểm mạnh & khoảng trống.",
    icon: "👤",
  },
  {
    id: 3,
    label: "Bước 03",
    title: "Chọn mẫu CV AI",
    description:
      "Chọn template CV AI phù hợp thương hiệu công ty. Hệ thống tự căn chỉnh bố cục & highlight thông minh.",
    icon: "⬇",
  },
  {
    id: 4,
    label: "Bước 04",
    title: "Ứng tuyển với CV tối ưu bởi AICES",
    description:
      "Xuất CV, gửi cho ứng viên hoặc dùng trực tiếp trong pipeline tuyển dụng để tăng tỉ lệ được mời phỏng vấn.",
    icon: "✓",
  },
];

export default function StepsSection() {
  return (
    <section className="steps-wrapper">
      <div className="steps-inner">
        <h2 className="steps-title">Tạo CV AI hoàn chỉnh với 4 bước</h2>

        <div className="steps-grid">
          {steps.map((step) => (
            <article key={step.id} className="step-card">
              <div className="step-card-number">{step.id.toString().padStart(2, "0")}</div>

              <div className="step-card-icon emerald-glass">
                <span>{step.icon}</span>
              </div>

              <div className="step-card-content">
                <div className="step-card-label">{step.label}</div>
                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-card-description">{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="steps-cta">
          <button className="steps-cta-button">Bắt đầu tạo CV cùng AICES</button>
        </div>
      </div>
    </section>
  );
}
