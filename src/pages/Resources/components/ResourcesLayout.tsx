import type { ReactNode } from "react";
import ResourcesSidebar from "./ResourcesSidebar";
import ResourcesFooter from "./ResourcesFooter";

type ResourcesLayoutProps = {
  title: ReactNode;
  subtitle?: string;
  lastUpdated?: string;

  /** legacy */
  sections?: any[];
  renderSection?: (section: any) => ReactNode;

  /** new */
  children?: ReactNode;
  showSidebar?: boolean;

  footerRight?: string;
};

export default function ResourcesLayout({
  title,
  subtitle,
  lastUpdated,
  sections = [],
  renderSection,
  children,
  showSidebar,
  footerRight,
}: ResourcesLayoutProps) {
  const hasSections = Array.isArray(sections) && sections.length > 0;

  /**
   * default behavior:
   * - có sections => show sidebar
   * - không có sections => hide sidebar
   */
  const shouldShowSidebar = showSidebar ?? hasSections;

  return (
    <div className="resources-page">
      {/* ===== HERO ===== */}
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

      {/* ===== BODY ===== */}
      <div className="resources-body">
        <div
          className={`resources-grid ${
            shouldShowSidebar ? "" : "no-sidebar"
          }`}
        >
          {shouldShowSidebar ? (
            <ResourcesSidebar
              sections={sections.map((s) => ({
                id: s.id,
                title: s.title,
              }))}
            />
          ) : null}

          <div className="resources-content">
            <div className="resources-card">
              {/* Priority:
                  1) children
                  2) legacy sections
               */}
              {children
                ? children
                : renderSection
                ? sections.map((section) => renderSection(section))
                : null}

              <ResourcesFooter right={footerRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
