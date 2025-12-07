import { Button } from "antd";
import "./TimeSaving.css";
import clockIcon from "../../../../assets/homepage/clock.png";

const TimeSaving = () => {
  return (
    <section className="time-section">
      {/* LAYER 1 – SOCIAL PROOF */}
      <div className="time-social">
        <p className="time-eyebrow">
          Chosen by Large Enterprises, RPOs, and Startups
        </p>

        <div className="time-logos">
          <span className="time-logo">tether</span>
          <span className="time-logo">Adecco</span>
          <span className="time-logo">INSTRUCTURE</span>
          <span className="time-logo">pomelo</span>
          <span className="time-logo">exa</span>
          <span className="time-logo">Quantum</span>
          <span className="time-logo">Quandri</span>
        </div>
      </div>

      {/* LAYER 2 – GRADIENT SPOTLIGHT + CLOCK ICON */}
      <div className="time-spotlight-wrapper">
        <div className="time-spotlight" />
        <div className="time-icon">
          <span className="time-icon-glyph">
            <img src={clockIcon} alt="Clock Icon" />
          </span>
        </div>
      </div>

      {/* LAYER 3 – BENEFIT + COPY + CTA */}
      <div className="time-copy">
        <h2 className="time-title">
          Save up to <span className="time-title-accent">40 hours</span>{" "}
          <span className="time-title-accent-soft">per month</span>
        </h2>

        <p className="time-subtext">
          Instantly identify top applicants. Say goodbye to the tedious task of
          reviewing the bottom 90% who aren’t a good fit for the role.
        </p>

        <Button type="primary" className="time-cta-btn">
          Start Saving Time
        </Button>
      </div>
    </section>
  );
};

export default TimeSaving;
