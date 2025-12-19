
export type LegalSectionItem = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default function LegalSection({ id, title, paragraphs, bullets }: LegalSectionItem) {
  return (
    <section id={id} className="legal-section">
      <h3 className="legal-h2">{title}</h3>

      {paragraphs?.map((p, idx) => (
        <p key={idx} className="legal-p">
          {p}
        </p>
      ))}

      {bullets?.length ? (
        <ul className="legal-ul">
          {bullets.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
