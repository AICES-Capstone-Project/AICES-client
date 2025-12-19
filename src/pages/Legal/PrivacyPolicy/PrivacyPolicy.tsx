// src/pages/Legal/PrivacyPolicy/PrivacyPolicy.tsx

import "../../Legal/legal.css";
import "./PrivacyPolicy.css";

import LegalLayout from "../components/LegalLayout";
import LegalSection from "../components/LegalSection";
import {
  privacySections,
  PRIVACY_LAST_UPDATED,
} from "./privacy.content";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title={
        <>
          Privacy <span className="legal-title-accent">Policy</span>
        </>
      }
      subtitle="This Privacy Policy explains how AICES collects, uses, stores, and protects personal and recruitment-related data."
      lastUpdated={PRIVACY_LAST_UPDATED}
      sections={privacySections}
      footerRight="Legal & Trust • Privacy"
    >
      {privacySections.map((section) => (
        <LegalSection key={section.id} {...section} />
      ))}
    </LegalLayout>
  );
}
