import type { ReactNode } from "react";
import ProductSidebar from "./ProductSidebar";
import ProductFooter from "./ProductFooter";

type ProductLayoutProps = {
  title: ReactNode;
  subtitle?: string;
  lastUpdated?: string;
  sections: any[];
  renderSection: (section: any) => ReactNode;
  footerRight?: string;

  /** ✅ Hide left sidebar (On this page) */
  hideSidebar?: boolean;

  /** ✅ Optional class to target page-specific styles */
  pageClassName?: string;
};

export default function ProductLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
  renderSection,
  footerRight,
  hideSidebar = false,
  pageClassName,
}: ProductLayoutProps) {
  return (
    <div className={`product-page ${pageClassName ?? ""}`}>
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
        <div
          className="product-grid"
          data-has-sidebar={hideSidebar ? "0" : "1"}
        >
          {!hideSidebar ? (
            <ProductSidebar
              sections={sections.map((s) => ({ id: s.id, title: s.title }))}
            />
          ) : null}

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
