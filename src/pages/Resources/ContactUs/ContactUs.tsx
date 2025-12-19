// src/pages/Resources/ContactUs/ContactUs.tsx

import "../resources.css";
import "./ContactUs.css";

import ResourcesLayout from "../components/ResourcesLayout";
import ResourcesSection from "../components/ResourcesSection";
import {
  contactUsSections,
  CONTACT_US_LAST_UPDATED,
} from "./contactus.content";

export default function ContactUs() {
  return (
    <ResourcesLayout
      title={
        <>
          Contact <span className="resources-title-accent">Us</span>
        </>
      }
      subtitle="Reach out for support, billing inquiries, partnerships, or privacy requests."
      lastUpdated={CONTACT_US_LAST_UPDATED}
      sections={contactUsSections as any}
      footerRight="Resources • Contact Us"
      renderSection={(section: any) => (
        <ResourcesSection key={section.id} section={section} />
      )}
    />
  );
}
