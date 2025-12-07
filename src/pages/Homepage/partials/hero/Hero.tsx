// src/pages/Homepage/partials/Hero/Hero.tsx

import { Button } from "antd";
import "./Hero.css";

import mainMockup from "../../../../assets/homepage/main.jpg";
import detailMockup from "../../../../assets/homepage/detail.jpg";
import pipelineMockup from "../../../../assets/homepage/pipeline.jpg";




const Hero = () => {
  return (
    <section className="hero-section">
      {/* Soft Gradient Blobs */}
      <div className="hero-bg-blob hero-bg-blob-left" />
      <div className="hero-bg-blob hero-bg-blob-right" />

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-accent">10x Faster</span> Resume Screening
        </h1>

        <p className="hero-subtext">
          Connect your ATS and analyze hundreds of resumes in minutes.
          <br />
          Save Time, Hire Faster and Improve Accuracy.
        </p>

        {/* CTA */}
        <Button type="primary" className="hero-cta-btn">
          💼 Book a Demo Now
        </Button>

                {/* Product Preview Mockups */}
        <div className="hero-mockups">
          {/* Ảnh lớn bên trái */}
          <img
            src={mainMockup}
            alt="Candidate ranking table"
            className="hero-mockup-main"
          />

          {/* Cột 2 ảnh bên phải */}
          <div className="hero-mockup-column">
            <img
              src={detailMockup}
              alt="Candidate detail report"
              className="hero-mockup-small hero-mockup-top"
            />
            <img
              src={pipelineMockup}
              alt="Candidate pipeline"
              className="hero-mockup-small hero-mockup-bottom"
            />
          </div>
        </div>
    
      </div>
    </section>
  );
};

export default Hero;
