import React from "react";
import { Typography } from "antd";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const SECTION_ICON_MAP: Record<string, React.ReactNode> = {
  office: <EnvironmentOutlined />,
  email: <MailOutlined />,
  hotline: <PhoneOutlined />,
  departments: <MessageOutlined />,
  follow: <GlobalOutlined />,
  maps: <EnvironmentOutlined />,
  about: <InfoCircleOutlined />,
};

export default function ResourcesSection({ section }: { section: any }) {
  const id = String(section?.id ?? "");
  const icon = SECTION_ICON_MAP[id];

  return (
    <section id={section.id} className="resources-section">
      <Title level={3} className="resources-section-title">
        {icon ? <span className="resources-section-icon">{icon}</span> : null}
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
