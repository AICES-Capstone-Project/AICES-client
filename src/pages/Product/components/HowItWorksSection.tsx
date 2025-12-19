import { Typography, Tag } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

type Section = {
  id: string;
  title: string;
  voiceover?: string;
  paragraphs?: string[];
  bullets?: string[];
  notes?: string[];
  link?: { label: string; href: string };
};

export default function HowItWorksSection({
  section,
  stepLabel,
  mediaSrc,
}: {
  section: Section;
  stepLabel: string;
  mediaSrc?: string;
}) {
  return (
    <section id={section.id} className="hiw-section">
      <header className="hiw-header">
        <Tag className="hiw-step">{stepLabel}</Tag>
        <Title level={3} className="hiw-heading">
          {section.title}
        </Title>
      </header>

      <div className={`hiw-row ${mediaSrc ? "has-media" : ""}`}>
        <div className="hiw-main">
          {section.voiceover ? (
            <div className="hiw-voice">
              <Text className="hiw-voice-text">{section.voiceover}</Text>
            </div>
          ) : null}

          {(section.paragraphs ?? []).map((p, idx) => (
            <Paragraph key={`${section.id}-p-${idx}`} className="hiw-paragraph">
              {p}
            </Paragraph>
          ))}

          {(section.bullets ?? []).length ? (
            <ul className="hiw-list">
              {(section.bullets ?? []).map((b, idx) => (
                <li key={`${section.id}-b-${idx}`} className="hiw-list-item">
                  {b}
                </li>
              ))}
            </ul>
          ) : null}

          {section.link ? (
            <div className="hiw-action">
              <Link href={section.link.href} target="_blank" rel="noreferrer">
                {section.link.label}
              </Link>
            </div>
          ) : null}

          {(section.notes ?? []).length ? (
            <div className="hiw-note">
              <Text className="hiw-note-label">Note</Text>
              <ul className="hiw-note-list">
                {(section.notes ?? []).map((n, idx) => (
                  <li key={`${section.id}-n-${idx}`}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {mediaSrc ? (
          <aside className="hiw-side">
            <div className="hiw-media-card">
              <img className="hiw-media-img" src={mediaSrc} alt={section.title} />
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
