// src/pages/Resources/Blog/blog.content.ts

export const BLOG_LAST_UPDATED = "December 2025";

export const blogSections = [
  {
    id: "blog-1",
    title: 'Blog 1: Say Goodbye to the "Manual CV Screening Nightmare"',
    content: [
      "Title: Goodbye to the “Manual CV Screening Nightmare”: Why Businesses Need AI in Hiring Today",
      "Reality check: Recruiters often spend hours (or days) reading hundreds of resumes that don’t meet basic requirements.",
      "The problem: Human bias and fatigue lead to inconsistent screening, and teams can easily miss strong candidates simply because they’re overwhelmed.",
      "How AICES solves it: AICES automates resume information extraction (Parsing) and candidate scoring (Scoring) in seconds, helping teams cut preliminary screening time by up to 80%.",
      "Instead of drowning in PDFs, recruiters get a structured, ranked shortlist—ready for review and action.",
    ],
  },

  {
    id: "blog-2",
    title: "Blog 2: Inside AICES Scoring — What Does the AI Evaluate?",
    content: [
      "Title: Behind the AICES Score: What Criteria Does AI Use to Evaluate Candidates?",
      "Technology deep dive: AICES uses NLP (Natural Language Processing) to understand context in resumes—not just keyword matching.",
      "Transparency matters: AICES provides “AI Explanation” so recruiters can understand why a candidate scored 90/100 (e.g., relevant years of experience, strong skill alignment, education fit).",
      "The perfect balance: AI recommends, but humans decide. AICES is built with a human-in-the-loop approach to keep final hiring decisions in the hands of recruiters and HR managers.",
    ],
  },

  {
    id: "blog-3",
    title: "Blog 3: Best Practices — How to Build Strong Evaluation Criteria in AICES",
    content: [
      "Title: How to Build High-Quality Hiring Criteria on AICES (and Get Better Shortlists Faster)",
      "Why Job Descriptions matter: A clear JD is the foundation for accurate AI evaluation—garbage in, garbage out.",
      "How to set weights: Prioritize must-have skills (required) vs nice-to-have skills (bonus) by adjusting weighting to reflect hiring goals.",
      "Optimize your workflow: Use AICES candidate rankings to shortlist quickly and schedule interviews immediately—without waiting for manual screening to finish.",
    ],
  },

  {
    id: "sample-intro",
    title: "Sample Intro (Sapo) — AICES Style",
    content: [
      "In the digital era, data is gold—but in recruitment, too much data (resumes) can become a burden.",
      "Have you ever wondered how to turn a pile of dense PDF resumes into a prioritized shortlist of high-potential candidates?",
      "Let’s explore how AICES leverages Google Gemini AI to transform your hiring workflow—faster, smarter, and more transparent.",
    ],
  },

  {
    id: "tip",
    title: "Tip",
    content: [
      "To make your blog posts more engaging, consider adding screenshots of the AICES Dashboard or Skill Charts from your UI mockups (if available).",
    ],
  },
] as const;
