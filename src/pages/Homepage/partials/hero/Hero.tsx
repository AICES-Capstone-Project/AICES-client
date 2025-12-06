// src/pages/Homepage/partials/hero/Hero.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hero.css";
import { cvTemplates } from "./cvTemplates";

export default function Hero() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = cvTemplates.length;

  const goToSlide = (newIndex: number) => {
    if (total === 0) return;
    const normalized = ((newIndex % total) + total) % total;
    setActiveIndex(normalized);
  };

  const handlePrev = () => goToSlide(activeIndex - 1);
  const handleNext = () => goToSlide(activeIndex + 1);

  const handleCardClick = () => {
    navigate("/login");
  };

  const handlePrimaryClick = () => {
    navigate("/login");
  };

  const handleSecondaryClick = () => {
    navigate("/login");
  };

  // Keyboard navigation (Accessibility)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, total]);

  const getItemState = (index: number) => {
    if (index === activeIndex) return "active";
    if (index === (activeIndex - 1 + total) % total) return "prev";
    if (index === (activeIndex + 1) % total) return "next";
    return "hidden";
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-content">
        <h1 className="hero-title">
          Xây dựng mẫu <span className="highlight">CV IT</span> chuẩn AI với{" "}
          <span className="aices">AICES</span>
        </h1>

        <p className="hero-subtext">
          90% lý do CV bị bỏ qua sớm vì trình bày chưa đúng cách. Dùng ngay CV AI
          được tối ưu bởi AICES để gây ấn tượng với nhà tuyển dụng.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={handlePrimaryClick}>
            Tạo CV ngay
          </button>

          <button className="btn-secondary" onClick={handleSecondaryClick}>
            Xem mẫu CV
          </button>
        </div>
      </div>

      {/* Slider container */}
      <div className="cv-slider" aria-label="AICES CV templates slider">
        <div className="cv-slider-wrapper">
          {cvTemplates.map((cv, index) => {
            const state = getItemState(index);
            return (
              <div
                key={cv.id}
                className={`slider-item slider-item--${state}`}
                onClick={handleCardClick}
                tabIndex={state === "active" ? 0 : -1}
              >
                <img src={cv.img} alt={`CV mẫu ${cv.id}`} />
              </div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button
          className="slider-arrow slider-arrow--left"
          onClick={handlePrev}
          aria-label="Trước"
        >
          ‹
        </button>

        <button
          className="slider-arrow slider-arrow--right"
          onClick={handleNext}
          aria-label="Sau"
        >
          ›
        </button>

        {/* Dots */}
        <div className="slider-dots" aria-hidden="true">
          {cvTemplates.map((cv, idx) => (
            <button
              key={cv.id}
              className={
                "slider-dot" +
                (idx === activeIndex ? " slider-dot--active" : "")
              }
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
