import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function ResourcesSection({ section }: { section: any }) {
  return (
    <section id={section.id} className="resources-section">
      <Title level={3} className="resources-section-title">
        {section.title}
      </Title>

      {Array.isArray(section.content) &&
        section.content.map((c: string, idx: number) => (
          <Paragraph
            key={`${section.id}-p-${idx}`}
            className="resources-section-desc"
          >
            {c}
          </Paragraph>
        ))}

      {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
        <ul className="resources-section-list">
          {section.bullets.map((b: string, idx: number) => (
            <li key={`${section.id}-b-${idx}`}>{b}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
