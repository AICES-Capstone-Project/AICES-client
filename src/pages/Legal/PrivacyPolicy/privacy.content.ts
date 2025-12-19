// src/pages/Legal/PrivacyPolicy/privacy.content.ts

import type { LegalSectionItem } from "../components/LegalSection";

export const PRIVACY_LAST_UPDATED = "December 25, 2025";

export const privacySections: LegalSectionItem[] = [
  {
    id: "information-collection",
    title: "1. Information We Collect",
    paragraphs: [
      "AICES collects information from different system actors (Guest, HR Recruiter, HR Manager, System Admin) as part of recruitment workflows."
    ],
    bullets: [
      "Account information: full name, email address, password (securely hashed using bcrypt), phone number, and profile avatar.",
      "Company information: company name, tax code, address, website, verification documents, and company logo.",
      "Candidate data extracted from uploaded resumes (PDF/DOCX), including skills, work experience, education background, and contact information.",
      "Recruitment data such as job descriptions, screening criteria, AI Match Scores, and recruiter evaluation notes.",
      "Payment and subscription data including transaction history and Stripe payment notifications.",
      "System and usage data including audit logs, IP address, login timestamps, and API usage history."
    ],
  },
  {
    id: "data-usage",
    title: "2. How We Use Information",
    bullets: [
      "Automated resume parsing and candidate-job matching using NLP-based AI models.",
      "Account setup, role-based access control (RBAC), and company membership management.",
      "Sending system notifications such as account verification, company approval, AI screening results, and payment updates.",
      "Monitoring AI performance, system analytics, and recruitment reports."
    ],
  },
  {
    id: "automated-processing",
    title: "3. Automated Data Processing (AI Features)",
    bullets: [
      "Resume parsing using Google Gemini to convert unstructured CVs into structured JSON data.",
      "Automated candidate scoring on a scale of 0–100 based on weighted criteria defined by recruiters.",
      "AI-generated results are provided for decision support only and may be manually adjusted by recruiters."
    ],
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing and Retention",
    paragraphs: [
      "AICES only shares necessary data with trusted infrastructure and service providers to operate the system."
    ],
    bullets: [
      "Google Cloud – data storage and AI processing.",
      "Stripe – payment processing.",
      "Cloudinary – image storage.",
      "Google and GitHub – OAuth authentication.",
      "AICES does not sell personal or recruitment-related data."
    ],
  },
  {
    id: "data-retention",
    title: "5. Data Retention and Deletion",
    bullets: [
      "Audit logs and payment records are retained for a minimum of five (05) years.",
      "Recruitment data retention depends on organizational policies and applicable regulations.",
      "Account deletion uses a soft-delete mechanism (isDeleted = true) to preserve system integrity while preventing further access."
    ],
  },
  {
    id: "security",
    title: "6. Security Measures",
    bullets: [
      "All communications are secured using HTTPS/TLS 1.2+.",
      "Passwords are securely hashed using bcrypt.",
      "JWT-based authentication with refresh token rotation is applied.",
      "Role-Based Access Control (RBAC) restricts access based on user roles.",
      "Daily incremental backups and weekly full backups are maintained on Azure / Google Cloud Storage."
    ],
  },
  {
    id: "user-rights",
    title: "7. User Rights",
    bullets: [
      "Access and update personal or company profile information.",
      "Control visibility and privacy of candidate profiles where applicable.",
      "Request account deletion through a System Administrator.",
      "Export recruitment reports in PDF or Excel format."
    ],
  },
  {
    id: "contact",
    title: "8. Contact Information",
    paragraphs: [
      "For questions or concerns regarding this Privacy Policy, please contact the AICES project team:",
      "Organization: GFA25SE53 – AICES Project",
      "Address: FPT University, Ho Chi Minh City, Vietnam",
      "Support Email: aicesse074@gmail.com"
    ],
  },
];
