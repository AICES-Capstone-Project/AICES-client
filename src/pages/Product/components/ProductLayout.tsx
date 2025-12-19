import type { ReactNode } from "react";
import ProductSidebar from "./ProductSidebar";
import ProductFooter from "./ProductFooter";

export default function ProductLayout({
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
    <div className="product-page">
      <div className="product-hero">
        <div className="product-hero-inner">
          <h1 className="product-title">{title}</h1>
          {subtitle ? <p className="product-subtitle">{subtitle}</p> : null}
          {lastUpdated ? (
            <div className="product-meta">
              <span className="product-meta-label">Last updated:</span>
              <span className="product-meta-value">{lastUpdated}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="product-body">
        <div className="product-grid">
          <ProductSidebar
            sections={sections.map((s) => ({ id: s.id, title: s.title }))}
          />

          <div className="product-content">
            <div className="product-card">
              {sections.map((section) => renderSection(section))}
              <ProductFooter right={footerRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
