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
      "Start your hiring journey by creating or joining a company. With just a few basic details, you’re ready to build your dream recruiting team.",
    paragraphs: [
      "HR Managers can create a new company workspace from the My Company page.",
      "Recruiters can request to join an existing company instead of creating a new one.",
      "Once the company is created, managers can invite recruiters by email or approve join requests.",
    ],
    bullets: [
      "Manager: create a company from My Company (Submit company account creation request).",
      "Recruiter: Join Company → select a company → send join request.",
      "Manager: invite recruiter via email (Send request) or approve requests.",
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
      "Create Job positions first from the Jobs page.",
      "Then create a Campaign with campaign-level requirements.",
      "You can add existing jobs during campaign creation, or add jobs later after the campaign is created.",
    ],
    bullets: [
      "Go to Jobs → create jobs for the roles you need.",
      "Go to Campaigns → create a campaign and set campaign requirements.",
      "Add jobs while creating the campaign, or click Add Job later.",
    ],
  },

  {
    id: "step-3",
    title: "Step 3: Smart Candidate Screening with AI",
    voiceover:
      "Upload received resumes and let AI handle the hardest part. In seconds, each resume is scored based on real compatibility with the job description.",
    paragraphs: [
      "Navigate to a Campaign, then open a Job that belongs to that campaign.",
      "Use Upload CV to upload one or multiple CVs at once.",
      "AI screening availability depends on your current subscription plan.",
      "After uploading, click the eye (👁) icon to view screening results.",
    ],
    bullets: [
      "Campaign → open a job inside the campaign → Upload CV.",
      "Upload 1 or many resumes in one batch.",
      "Click the eye icon to view screening results.",
      "Only resumes that match job requirements are screened.",
    ],
    notes: ["AI screening availability depends on the user's subscription plan."],
  },
];
