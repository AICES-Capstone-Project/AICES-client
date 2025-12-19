// src/pages/Resources/ContactUs/contactus.content.ts

export const CONTACT_US_LAST_UPDATED = "December 2025";

export const contactUsSections = [
  {
    id: "intro",
    title: "Contact Us",
    content: [
      "Have questions or need support with AICES? Our team is here to help you optimize your recruitment process.",
    ],
  },

  {
    id: "office",
    title: "📍 Our Office",
    content: [
      "FPT University Ho Chi Minh City",
      "Lot E2a-7, D1 Street, High-Tech Park, Long Thanh My Ward,",
      "Thu Duc City, Ho Chi Minh City, Vietnam.",
    ],
  },

  {
    id: "email",
    title: "📧 Email Support",
    content: [
      "For general inquiries, technical support, or privacy concerns:",
      "Email: aicesse074@gmail.com",
      "(We typically respond within 24 business hours)",
    ],
  },

  {
    id: "hotline",
    title: "📞 Hotline",
    content: [
      "Customer Service: (+84) 123 456 789",
      "(Available Monday - Friday, 8:30 AM - 5:30 PM ICT)",
    ],
  },

  {
    id: "departments",
    title: "💬 Get in Touch",
    content: [
      "Please select the department that best fits your needs:",
      "• Technical Support: Issues with CV parsing, AI scoring, or account access.",
      "• Billing & Subscriptions: Inquiries regarding Stripe payments, invoices, or upgrading your plan.",
      "• Partnership & Sales: For large organizations looking for custom enterprise solutions.",
      "• Data Privacy: Requests regarding your personal data or GDPR compliance.",
    ],
  },

  {
    id: "follow",
    title: "🚀 Follow Our Project",
    content: [
      "Stay updated with the latest AI recruitment trends and AICES feature releases:",
      "GitHub: Project GFA25SE53 - AICES",
      "LinkedIn: AICES - AI-Powered Recruitment System",
    ],
  },

  {
    id: "maps",
    title: "🗺️ Find Us on Maps",
    content: [
      "You can embed a Google Map here (optional) so users can quickly locate our office.",
    ],
  },

  {
    id: "about",
    title: "About Us",
    content: [
      "AICES is a Capstone Project developed by group GFA25SE53 from FPT University.",
      "Our mission is to bridge the gap between talented candidates and recruiters using the power of Generative AI.",
    ],
  },
] as const;
