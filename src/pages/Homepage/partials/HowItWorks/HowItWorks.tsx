// src/pages/Homepage/partials/HowItWorks/HowItWorks.tsx


import "./HowItWorks.css";

import mainMockup from "../../../../assets/homepage/main.jpg";
import detailMockup from "../../../../assets/homepage/detail.jpg";
import pipelineMockup from "../../../../assets/homepage/pipeline.jpg";

const HowItWorks = () => {
  return (
    <section className="how-section">
      <div className="how-inner">
        {/* STEP 1 */}
        <div className="how-step">
          <div className="how-step-left">
            <p className="how-step-label">STEP 1</p>
            <h3 className="how-step-title">
              Import <span className="how-accent">Job</span> from your ATS
            </h3>

            <ul className="how-step-list">
              <li>
                Simply import the job description directly from your existing
                ATS.
              </li>
              <li>
                AICES analyzes and extracts key criteria such as experience,
                skills and education.
              </li>
              <li>
                The platform suggests which criteria should be{" "}
                <strong>mandatory</strong> or{" "}
                <strong>preferred</strong>.
              </li>
            </ul>
          </div>

          <div className="how-step-right">
            <div className="how-image-card">
              <img
                src={mainMockup}
                alt="Import job from ATS"
                className="how-image"
              />
              <span className="how-step-badge">1</span>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="how-step">
          <div className="how-step-left">
            <p className="how-step-label">STEP 2</p>
            <h3 className="how-step-title">
              Customize the{" "}
              <span className="how-accent">Criteria for the Role</span>
            </h3>

            <ul className="how-step-list">
              <li>
                Tailor the screening criteria to match your recruitment
                standards and methods.
              </li>
              <li>
                Modify or delete criteria suggested by AICES based on your
                hiring preferences.
              </li>
              <li>
                Add any additional criteria and mark them as{" "}
                <strong>mandatory</strong> or{" "}
                <strong>preferred</strong>.
              </li>
            </ul>
          </div>

          <div className="how-step-right">
            <div className="how-image-card">
              <img
                src={detailMockup}
                alt="Customize criteria"
                className="how-image"
              />
              <span className="how-step-badge">2</span>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="how-step">
          <div className="how-step-left">
            <p className="how-step-label">STEP 3</p>
            <h3 className="how-step-title">
              Analyze the Candidate&apos;s{" "}
              <span className="how-accent">Ranking</span> and Make Decisions
            </h3>

            <ul className="how-step-list">
              <li>
                AICES ranks candidates in real-time as they apply, filtering out
                low-fit profiles.
              </li>
              <li>
                Navigate a prioritized list with explanations for each
                assessment point.
              </li>
              <li>
                Advance, archive or put candidates on hold and instantly sync
                decisions back to your ATS.
              </li>
            </ul>
          </div>

          <div className="how-step-right">
            <div className="how-image-card">
              <img
                src={pipelineMockup}
                alt="Analyze ranking and decide"
                className="how-image"
              />
              <span className="how-step-badge">3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
