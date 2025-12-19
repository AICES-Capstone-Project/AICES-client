// src/pages/Legal/SecurityPrivacy/securityPrivacy.content.ts

import type { LegalSectionItem } from "../components/LegalSection";

export const SECURITY_PRIVACY_LAST_UPDATED = "December 25, 2025";

export const securityPrivacySections: LegalSectionItem[] = [
  {
    id: "system-security",
    title: "1. System Security Policy",
    bullets: [
      "JWT-based authentication with Access Token and Refresh Token validation.",
      "Role-Based Access Control (RBAC) with four main roles: Guest, HR Recruiter, HR Manager, and System Admin.",
      "Google and GitHub OAuth2 authentication to reduce direct password exposure.",
      "Passwords are securely hashed using bcrypt.",
      "All client-server communication is protected via HTTPS/TLS.",
      "Cloudinary is used for image storage; Google Cloud Storage / Azure is used for CV file storage.",
      "Payment processing is handled by Stripe without storing credit card data, ensuring PCI-DSS compliance."
    ],
  },
  {
    id: "data-privacy",
    title: "2. Data Privacy and Processing",
    bullets: [
      "Candidate CV data is processed only after voluntary upload by the candidate.",
      "Resume data is converted into structured JSON using AI (Gemini) for evaluation purposes.",
      "Only authorized recruiters and managers within the same company can access candidate data.",
      "Recruitment campaigns, job descriptions, and scoring criteria are isolated per company.",
      "Recruiters from one company cannot access data belonging to another company."
    ],
  },
  {
    id: "ai-transparency",
    title: "Transparency in AI Processing",
    paragraphs: [
      "AICES provides AI-generated Match Scores to support recruitment decisions.",
      "Recruiters can review and manually adjust scores to ensure fairness and prevent over-reliance on automated decision-making."
    ],
  },
  {
    id: "audit-management",
    title: "3. Audit and Management",
    bullets: [
      "Audit logs record user activities and workflows for monitoring and investigation.",
      "System Administrators can lock or disable accounts in case of policy violations or user requests.",
      "Soft-delete is applied to preserve reporting data while preventing further access.",
      "Permanent deletion is supported for expired subscription plans or data without legal retention requirements."
    ],
  },
  {
    id: "compliance",
    title: "4. Compliance Commitment",
    paragraphs: [
      "AICES is designed in alignment with GDPR principles such as the right to be informed and the right to erasure.",
      "The system follows ISO/IEC 27001 information security management principles.",
      "Security is implemented through .NET Core, SQL Server, and controlled cloud infrastructure environments."
    ],
  },
];
