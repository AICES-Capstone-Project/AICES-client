// src/pages/Homepage/partials/Integration/Integration.tsx

import { Button } from "antd";
import "./Integration.css";

import mainMockup from "../../../../assets/homepage/main.jpg";

const Integration = () => {
  return (
    <section className="integration-section">
      <div className="integration-inner">
        {/* LEFT — IMAGE */}
        <div className="integration-left">
          <img
            src={mainMockup}
            alt="ATS Integration"
            className="integration-img"
          />
        </div>

        {/* RIGHT — TEXT CONTENT */}
        <div className="integration-right">
          <h2 className="integration-title">
            <span className="accent">Easily Integrate</span> with your <br />
            ATS{" "}
            <span className="accent-soft">
              without Changing Current Processes
            </span>
          </h2>

          <ul className="integration-list">
            <li>Connect AICES with your ATS in one click.</li>
            <li>Automatically import jobs created within your ATS.</li>
            <li>Real-time screening as candidates apply.</li>
            <li>Make faster decisions and sync back to ATS instantly.</li>
          </ul>

          <Button type="primary" className="integration-btn">
            Integrate with AICES
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Integration;
