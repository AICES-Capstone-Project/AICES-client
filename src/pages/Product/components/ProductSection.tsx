import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function ProductSection({ section }: { section: any }) {
  return (
    <section id={section.id} className="product-section">
      <Title level={3} className="product-section-title">
        {section.title}
      </Title>

      {section.description ? (
        <Paragraph className="product-section-desc">{section.description}</Paragraph>
      ) : null}

      {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
        <ul className="product-section-list">
          {section.bullets.map((b: string, idx: number) => (
            <li key={`${section.id}-b-${idx}`}>{b}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
