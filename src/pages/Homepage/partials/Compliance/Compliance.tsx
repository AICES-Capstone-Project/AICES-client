import "./Compliance.css";

const Compliance = () => {
  return (
    <section className="compliance-section">
      <div className="compliance-inner">
        {/* HEADING */}
        <h2 className="compliance-title">
          Compliant with{" "}
          <span className="compliance-title-accent">
            Global Data Protection Standards
          </span>
        </h2>

        <p className="compliance-subtitle">
          AICES ensures robust protection under GDPR, CCPA, and emerging AI
          regulations.
        </p>

        {/* CARDS */}
        <div className="compliance-cards">
          {/* GDPR */}
          <div className="compliance-card">
            <div className="compliance-icon">
              <span className="compliance-icon-label">EU</span>
            </div>
            <h3 className="compliance-card-title">GDPR Compliant</h3>
            <p className="compliance-card-text">
              EU General Data Protection Regulation.
            </p>
          </div>

          {/* CCPA */}
          <div className="compliance-card">
            <div className="compliance-icon">
              <span className="compliance-icon-label">CA</span>
            </div>
            <h3 className="compliance-card-title">CCPA Compliant</h3>
            <p className="compliance-card-text">
              California Consumer Privacy Act.
            </p>
          </div>

          {/* EU AI ACT */}
          <div className="compliance-card">
            <div className="compliance-icon">
              <span className="compliance-icon-label">AI</span>
            </div>
            <h3 className="compliance-card-title">EU AI Compliant</h3>
            <p className="compliance-card-text">
              EU Artificial Intelligence Act and upcoming AI regulations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compliance;
