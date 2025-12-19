// src/pages/Resources/HelpCenter/helpcenter.content.ts

export const HELPCENTER_LAST_UPDATED = "December 2025";

export const helpCenterSections = [
  {
    id: "getting-started",
    title: "1. Getting Started",
    content: [
      "What is AICES? An AI-powered candidate evaluation system that automates resume screening and helps recruiters shortlist faster with greater consistency.",
      "Create an account: How HR Managers sign up and set up a company profile to start recruiting.",
      "Email verification: Activate your account to unlock full features and secure access.",
    ],
  },

  {
    id: "for-recruiters",
    title: "2. For Recruiters",
    content: [
      "Create a strong Job Description (JD): Tips for writing and entering job requirements so the AI can understand and analyze effectively.",
      "Set evaluation criteria: Choose core skills and define weights to reflect hiring priorities.",
      "Bulk resume upload: Upload PDF/DOCX resumes and track AI extraction status.",
      "Understanding Match Score: What a 0–100 score means and how AICES matches candidate skills to job requirements.",
    ],
  },

  {
    id: "management-billing",
    title: "3. Company Management & Billing",
    content: [
      "Team management: HR Managers can invite recruiters and manage company members.",
      "Upgrade subscription: Choose Basic / Standard / Premium plans via Stripe to increase CV processing limits and AI usage hours.",
      "Track limits: Check remaining CV quota and usage within your current plan.",
    ],
  },

  {
    id: "ai-security",
    title: "4. AI & Security",
    content: [
      "How does AI process data? AICES uses Google Gemini to analyze resumes more objectively and consistently.",
      "Manual score adjustment: Recruiters can override or fine-tune evaluation results when needed.",
      "Data security: Commitment to password hashing (bcrypt) and protecting candidate information.",
    ],
  },

  {
    id: "troubleshooting",
    title: "5. Troubleshooting",
    content: [
      "Why can’t I upload a resume? Verify file format (PDF/DOCX only) and check the maximum file size limit.",
      "AI extracted incorrect information: Use the “Edit Candidate” feature to correct fields that were parsed inaccurately.",
      "Payment issues: Steps to take if a Stripe transaction is declined or subscription status is not updated yet.",
    ],
  },

  {
    id: "contact-support",
    title: "Contact Support",
    content: [
      "If you can’t find an answer, feel free to contact us:",
      "Email: aicesse074@gmail.com",
      "Address: FPT University, District 9, Ho Chi Minh City.",
      "Response time: Within 24 business hours.",
    ],
  },

  {
    id: "tip",
    title: "Tip",
    content: [
      'Consider adding a search bar at the top of the Help Center so users can quickly find keywords like "payment", "scoring", "JD", or "criteria".',
    ],
  },
] as const;
