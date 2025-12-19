// src/pages/Legal/SecurityPrivacy/SecurityPrivacy.tsx

import "../../Legal/legal.css";
import "./SecurityPrivacy.css";

import LegalLayout from "../components/LegalLayout";
import LegalSection from "../components/LegalSection";
import {
  securityPrivacySections,
  SECURITY_PRIVACY_LAST_UPDATED,
} from "./security.content";

export default function SecurityPrivacy() {
  return (
    <LegalLayout
      title={
        <>
          Security & <span className="legal-title-accent">Privacy</span>
        </>
      }
      subtitle="This page explains how AICES ensures system security, data privacy, and compliance through technical and organizational measures."
      lastUpdated={SECURITY_PRIVACY_LAST_UPDATED}
      sections={securityPrivacySections}
      footerRight="Legal & Trust • Security"
    >
      {securityPrivacySections.map((section) => (
        <LegalSection key={section.id} {...section} />
      ))}
    </LegalLayout>
  );
}
