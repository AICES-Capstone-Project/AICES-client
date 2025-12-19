import "../../Legal/legal.css";
import "./TermsOfService.css";

import LegalLayout from "../components/LegalLayout";
import LegalSection from "../components/LegalSection";
import { termsSections, TERMS_LAST_UPDATED } from "./terms.content";

export default function TermsOfService() {
  return (
    <LegalLayout
      title={
        <>
          Terms of <span className="legal-title-accent">Service</span>
        </>
      }
      subtitle="These Terms govern your access to and use of AICES. By using the Service, you agree to these Terms."
      lastUpdated={TERMS_LAST_UPDATED}
      sections={termsSections}
      footerRight={
        <span>
          Legal & Trust • <span style={{ color: "rgba(15,32,39,0.45)" }}>Terms</span>
        </span>
      }
    >
      {termsSections.map((s) => (
        <LegalSection key={s.id} {...s} />
      ))}
    </LegalLayout>
  );
}
