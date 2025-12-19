// src/pages/Resources/HelpCenter/HelpCenter.tsx

import "../resources.css";
import "./HelpCenter.css";

import ResourcesLayout from "../components/ResourcesLayout";
import ResourcesSection from "../components/ResourcesSection";
import {
  helpCenterSections,
  HELPCENTER_LAST_UPDATED,
} from "./helpcenter.content";

export default function HelpCenter() {
  return (
    <ResourcesLayout
      title={
        <>
          Help <span className="resources-title-accent">Center</span>
        </>
      }
      subtitle="Find guides, troubleshooting tips, and answers for using AICES effectively."
      lastUpdated={HELPCENTER_LAST_UPDATED}
      sections={helpCenterSections as any}
      footerRight="Resources • Help Center"
      renderSection={(section: any) => (
        <ResourcesSection key={section.id} section={section} />
      )}
    />
  );
}
