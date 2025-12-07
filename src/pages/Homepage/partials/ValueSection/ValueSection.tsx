// src/pages/Homepage/partials/ValueSection/ValueSection.tsx

import type { FC } from "react";
import "./ValueSection.css";

import clockIcon from "../../../../assets/homepage/clock.png";
import costIcon from "../../../../assets/homepage/cost.png";
import targetIcon from "../../../../assets/homepage/target.png";

const ValueSection: FC = () => {
  return (
    <section className="value-section">
      <div className="value-inner">
        {/* Heading + Subtext */}
        <h2 className="value-title">
          The{" "}
          <span className="value-title-accent">
            24/7 AI Resume Screening
          </span>{" "}
          Software
        </h2>

        <p className="value-subtext">
          AICES helps organizations save up to 90% on initial screening tasks
          while hiring the best talent in record time.
        </p>

        {/* Benefit Cards */}
        <div className="value-cards">
          {/* CARD 1 */}
          <div className="value-card">
            <div className="value-icon value-icon-1">
              <img src={costIcon} alt="Reduce Hiring Cost" />
            </div>
            <h3 className="value-card-title">Reduce Hiring Cost</h3>
            <p className="value-card-text">
              Forget about the hassle of manually opening and reviewing each
              resume. Automate repetitive tasks and reduce overall hiring cost.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="value-card">
            <div className="value-icon value-icon-2">
              <img src={clockIcon} alt="Reduce Time to Hire" />
            </div>
            <h3 className="value-card-title">Reduce Time To Hire / Fill</h3>
            <p className="value-card-text">
              Spend your time on meaningful interviews instead of initial
              screening. Shortlist the right candidates in minutes, not weeks.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="value-card">
            <div className="value-icon value-icon-3">
              <img src={targetIcon} alt="Improve Accuracy" />
            </div>
            <h3 className="value-card-title">Improve Accuracy</h3>
            <p className="value-card-text">
              Reduce human error and ensure that exceptional candidates are
              never overlooked thanks to consistent AI-powered evaluation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
