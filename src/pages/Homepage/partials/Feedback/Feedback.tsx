import "./Feedback.css";

const Feedback = () => {
  return (
    <section className="fb-section">

      <h2 className="fb-title">
        Trusted by <span className="fb-accent">Top Companies</span> Around the World
      </h2>

      <p className="fb-subtitle">
        HR professionals, hiring managers, and directors are using AICES to
        streamline their companies' recruitment processes.
      </p>

      <div className="fb-grid">
        {/* CARD 1 */}
        <div className="fb-card">
          <h3 className="fb-company">Quandri ●</h3>
          <p className="fb-quote">
            “The main benefit of AICES is being able to put in the core
            competencies that we need people to have, and then it basically sorts
            all applicants based on who best matches those criteria. The outcome
            I like most is that AICES helps us review applicants in the right
            order instead of missing great candidates simply because we never get
            to them.”
          </p>

          <div className="fb-author">
            <div className="fb-avatar">RW</div>
            <div>
              <p className="fb-author-name">Rachel Ward</p>
              <p className="fb-author-role">
                People & Talent Operations, Quandri
              </p>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="fb-card">
          <h3 className="fb-company">Pomelo</h3>
          <p className="fb-quote">
            “AICES replaced the one-by-one manual review of 180+ applications per
            role with real-time shortlists ordered by match score. It doesn't
            matter if a candidate applies last — if they’re the best match, they
            show up first.”
          </p>

          <div className="fb-author">
            <div className="fb-avatar">AD</div>
            <div>
              <p className="fb-author-name">Angeles Donelly</p>
              <p className="fb-author-role">
                Regional Talent Partner Manager
              </p>
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="fb-card">
          <h3 className="fb-company">Accelon</h3>
          <p className="fb-quote">
            “What we find most useful is the ability to fine-tune the analysis.
            It helps us look beyond strict job descriptions and consider
            candidates who might otherwise be missed. The ranking and gap
            analysis provide a solid starting point for focusing on the right
            profiles early on.”
          </p>

          <div className="fb-author">
            <div className="fb-avatar">PS</div>
            <div>
              <p className="fb-author-name">Puja Singla</p>
              <p className="fb-author-role">
                Talent & Tech Senior Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
