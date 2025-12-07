import { Button } from "antd";
import "./RecruiterDesigned.css";

// TODO: đổi path/image theo file thật của bạn
import recruiterVisual from "../../../../assets/homepage/pipeline.jpg";

const RecruiterDesigned = () => {
  return (
    <section className="recruit-section">
      <div className="recruit-inner">
        {/* LEFT – TEXT CONTENT */}
        <div className="recruit-left">
          <h2 className="recruit-title">
            <span className="recruit-title-accent">
              Designed by Recruiters
            </span>{" "}
            to Meet Recruiters&apos; Needs.
          </h2>

          <ul className="recruit-list">
            <li className="recruit-item">
              <span className="recruit-item-title">Human-based Screening:</span>{" "}
              No black box algorithms – our AI is trained to evaluate candidates
              based on your recruiters&apos; real requirements for the position.
            </li>
            <li className="recruit-item">
              <span className="recruit-item-title">Real-time Analysis:</span>{" "}
              Automatically extracts and analyzes key criteria from each resume
              as soon as candidates apply.
            </li>
            <li className="recruit-item">
              <span className="recruit-item-title">
                Dynamic and Visual Candidate Ranking:
              </span>{" "}
              Easily rank candidates based on how well they meet your criteria,
              giving more weight to mandatory qualifications and letting you
              navigate the list with dynamic filters.
            </li>
            <li className="recruit-item">
              <span className="recruit-item-title">
                Criteria Accomplishment Explanation:
              </span>{" "}
              Access detailed explanations from the AI on why candidates did or
              did not meet each criterion – full transparency, not a black box.
            </li>
            <li className="recruit-item">
              <span className="recruit-item-title">ATS Synchronization:</span>{" "}
              Make individual or bulk decisions (advance, archive, put on hold)
              and have those changes reflected directly in your ATS.
            </li>
          </ul>

          <Button type="primary" className="recruit-cta-btn">
            <span className="recruit-cta-icon">▢</span>
            Explore Features
          </Button>
        </div>

        {/* RIGHT – VISUAL / DIAGRAM */}
        <div className="recruit-right">
          <div className="recruit-visual-wrapper">
            <img
              src={recruiterVisual}
              alt="AI workflow designed for recruiters"
              className="recruit-visual-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterDesigned;
