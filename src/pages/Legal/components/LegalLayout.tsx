import React from "react";
import LegalSidebar from "./LegalSidebar";
import type { LegalSectionItem } from "./LegalSection";

type Props = {
  title: React.ReactNode;
  subtitle?: string;
  lastUpdated?: string;
  sections: LegalSectionItem[];
  children: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
};

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
  children,
  footerLeft,
  footerRight,
}: Props) {
  return (
    <div className="legal-page">
      <div className="legal-inner">
        <div className="legal-hero">
          <h1 className="legal-title">{title}</h1>
          {subtitle ? <p className="legal-subtitle">{subtitle}</p> : null}
          {lastUpdated ? <div className="legal-meta">Last updated: {lastUpdated}</div> : null}
        </div>

        <div className="legal-grid">
          <LegalSidebar sections={sections.map(({ id, title }) => ({ id, title }))} />
          <main className="legal-card legal-content">
            {children}

            <div className="legal-footer">
              <div>{footerLeft ?? "© 2025 AICES. All rights reserved."}</div>
              <div>{footerRight ?? "Legal & Trust"}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
