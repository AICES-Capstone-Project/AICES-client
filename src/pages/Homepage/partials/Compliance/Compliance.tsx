import "./Compliance.css";

const Compliance = () => {
  return (
    <section className="compliance-section">
      <div className="compliance-inner">
        {/* HEADING */}
        <h2 className="compliance-title">
          Security &{" "}
          <span className="compliance-title-accent">Privacy by Design</span>
        </h2>

        <p className="compliance-subtitle">
          AICES protects candidate and company data with role-based access,
          controlled visibility, and secure handling throughout the recruitment
          workflow.
        </p>

        {/* CARDS */}
        <div className="compliance-cards">
          {/* RBAC */}
          <div className="compliance-card">
            <div className="compliance-icon">
              <span className="compliance-icon-label">RB</span>
            </div>
            <h3 className="compliance-card-title">Role-Based Access</h3>
            <p className="compliance-card-text">
              Clear permissions by user roles to ensure the right people access
              the right data.
            </p>
          </div>

          {/* Data Privacy */}
          <div className="compliance-card">
            <div className="compliance-icon">
              <span className="compliance-icon-label">PR</span>
            </div>
            <h3 className="compliance-card-title">Data Privacy</h3>
            <p className="compliance-card-text">
              Candidate information is managed with controlled sharing and
              minimized exposure.
            </p>
          </div>

          {/* Secure Storage */}
          <div className="compliance-card">
            <div className="compliance-icon">
              <span className="compliance-icon-label">SC</span>
            </div>
            <h3 className="compliance-card-title">Secure Handling</h3>
            <p className="compliance-card-text">
              Files and recruitment data are handled securely to support safe,
              reliable system operation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compliance;
