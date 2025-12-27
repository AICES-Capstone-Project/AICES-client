import "./Feedback.css";

const Feedback = () => {
  const items = [
    {
      company: "NovaHR",
      quote:
        "AICES helped us move from manual CV screening to a structured flow. Resume parsing is fast, and the scoring + ranking gives our team a clear starting point for shortlisting.",
      avatar: "MT",
      name: "Minh Tran",
      role: "HR Specialist",
    },
    {
      company: "HorizonWorks",
      quote:
        "The biggest win is consistency. With the same evaluation criteria, we avoid missing strong candidates and reduce subjective screening. It makes hiring discussions much more data-driven.",
      avatar: "LN",
      name: "Linh Nguyen",
      role: "Recruitment Lead",
    },
    {
      company: "BluePeak Tech",
      quote:
        "We like how AICES centralizes candidates and highlights skills gaps. It saves time during initial screening so we can focus on interviews and final decisions.",
      avatar: "QP",
      name: "Quang Pham",
      role: "Hiring Manager",
    },
  ];

  return (
    <section className="fb-section">
      <h2 className="fb-title">
        What teams say about <span className="fb-accent">AICES</span>
      </h2>

      <p className="fb-subtitle">
        Built to help HR teams and recruiters automate resume parsing, score and
        rank candidates, and make faster, more consistent hiring decisions.
      </p>

      {/* Carousel wrapper */}
      <div className="fb-carousel" aria-label="Feedback carousel">
        <div className="fb-track">
          {[...items, ...items].map((item, idx) => (
            <div className="fb-slide" key={`${item.company}-${idx}`}>
              <div className="fb-card">
                <h3 className="fb-company">{item.company}</h3>

                <p className="fb-quote">“{item.quote}”</p>

                <div className="fb-author">
                  <div className="fb-avatar">{item.avatar}</div>
                  <div>
                    <p className="fb-author-name">{item.name}</p>
                    <p className="fb-author-role">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;
