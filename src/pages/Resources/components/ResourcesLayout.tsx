import type { ReactNode } from "react";
import ResourcesSidebar from "./ResourcesSidebar";
import ResourcesFooter from "./ResourcesFooter";

export default function ResourcesLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
  renderSection,
  footerRight,
}: {
  title: ReactNode;
  subtitle?: string;
  lastUpdated?: string;
  sections: any[];
  renderSection: (section: any) => ReactNode;
  footerRight?: string;
}) {
  return (
    <div className="resources-page">
      <div className="resources-hero">
        <div className="resources-hero-inner">
          <h1 className="resources-title">{title}</h1>

          {subtitle ? (
            <p className="resources-subtitle">{subtitle}</p>
          ) : null}

          {lastUpdated ? (
            <div className="resources-meta">
              <span className="resources-meta-label">Last updated:</span>
              <span className="resources-meta-value">{lastUpdated}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="resources-body">
        <div className="resources-grid">
          <ResourcesSidebar
            sections={sections.map((s) => ({
              id: s.id,
              title: s.title,
            }))}
          />

          <div className="resources-content">
            <div className="resources-card">
              {sections.map((section) => renderSection(section))}
              <ResourcesFooter right={footerRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
