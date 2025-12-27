// src/pages/Product/HowItWorks/howitworks.content.ts

export const HOW_IT_WORKS_LAST_UPDATED = "December 2025";

export type HowItWorksSection = {
  id: string;
  title: string;
  voiceover?: string;
  paragraphs?: string[];
  bullets?: string[];
  notes?: string[];
  link?: { label: string; href: string };
};

export const howItWorksSections: HowItWorksSection[] = [
  {
    id: "step-1",
    title: "Step 1: Set Up Your Workspace (My Company)",
    voiceover:
      "Start your hiring journey by creating or joining a company. With just a few basic details, you’re ready to build your recruiting team.",
    paragraphs: [
      "1.1 Create a new company workspace from the My Company page (HR Manager).",
      "1.2 Request to join an existing company instead of creating a new one (Recruiter).",
      "1.3 After the company is created, invite recruiters by email or approve join requests (HR Manager).",
    ],
    bullets: [
      "1.1.1 Manager: Create a company in My Company (submit company account creation request).",
      "1.2.1 Recruiter: Join Company → select a company → send join request.",
      "1.3.1 Manager: Invite recruiter via email (send request) or approve requests.",
    ],
    link: {
      label: "Open screen: My Company",
      href: "https://aices.site/company/my-apartments",
    },
  },

  {
    id: "step-2",
    title: "Step 2: Create Jobs & Launch a Campaign",
    voiceover:
      "Create job positions and launch recruitment campaigns. AICES helps you manage each role in a structured and efficient way.",
    paragraphs: [
      "2.1 Create job positions first from the Jobs page.",
      "2.2 Create a campaign and set campaign-level requirements.",
      "2.3 Add existing jobs during campaign creation, or add jobs later after the campaign is created.",
    ],
    bullets: [
      "2.1.1 Jobs → Create jobs for the roles you need.",
      "2.2.1 Campaigns → Create a campaign → set campaign requirements.",
      "2.3.1 Add jobs while creating the campaign, or click Add Job later.",
    ],
  },

  {
    id: "step-3",
    title: "Step 3: Smart Candidate Screening with AI",
    voiceover:
      "Upload resumes and let AI handle the screening. In seconds, each resume is scored based on compatibility with the job description.",
    paragraphs: [
      "3.1 Open a campaign, then open a job that belongs to that campaign.",
      "3.2 Use Upload CV to upload one or multiple CVs at once.",
      "3.3 AI screening availability depends on your current subscription plan.",
      "3.4 After uploading, open the screening result to view details.",
    ],
    bullets: [
      "3.1.1 Campaign → open a job inside the campaign.",
      "3.2.1 Upload CV → upload one or many resumes in one batch.",
      "3.4.1 Open screening result → view AI scoring and matching details.",
      "3.4.2 Only resumes that match job requirements are screened.",
    ],
    notes: ["AI screening availability depends on the user's subscription plan."],
  },
];
