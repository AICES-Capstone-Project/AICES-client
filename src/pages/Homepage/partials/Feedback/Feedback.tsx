import "./Feedback.css";

const Feedback = () => {
  return (
    <section className="fb-section">
      <h2 className="fb-title">
        What teams say about <span className="fb-accent">AICES</span>
      </h2>

      <p className="fb-subtitle">
        Built to help HR teams and recruiters automate resume parsing, score and
        rank candidates, and make faster, more consistent hiring decisions.
      </p>

      <div className="fb-grid">
        {/* CARD 1 */}
        <div className="fb-card">
          <h3 className="fb-company">NovaHR</h3>
          <p className="fb-quote">
            “AICES helped us move from manual CV screening to a structured flow.
            Resume parsing is fast, and the scoring + ranking gives our team a
            clear starting point for shortlisting.”
          </p>

          <div className="fb-author">
            <div className="fb-avatar">MT</div>
            <div>
              <p className="fb-author-name">Minh Tran</p>
              <p className="fb-author-role">HR Specialist</p>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="fb-card">
          <h3 className="fb-company">HorizonWorks</h3>
          <p className="fb-quote">
            “The biggest win is consistency. With the same evaluation criteria,
            we avoid missing strong candidates and reduce subjective screening.
            It makes hiring discussions much more data-driven.”
          </p>

          <div className="fb-author">
            <div className="fb-avatar">LN</div>
            <div>
              <p className="fb-author-name">Linh Nguyen</p>
              <p className="fb-author-role">Recruitment Lead</p>
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="fb-card">
          <h3 className="fb-company">BluePeak Tech</h3>
          <p className="fb-quote">
            “We like how AICES centralizes candidates and highlights skills
            gaps. It saves time during initial screening so we can focus on
            interviews and final decisions.”
          </p>

          <div className="fb-author">
            <div className="fb-avatar">QP</div>
            <div>
              <p className="fb-author-name">Quang Pham</p>
              <p className="fb-author-role">Hiring Manager</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
