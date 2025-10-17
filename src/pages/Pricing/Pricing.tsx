import React from "react";
import PricingHeader from "./components/PricingHeader";
import PlansGrid from "./components/PlansGrid";
import FAQSection from "./components/FAQSection";
import PricingCTA from "./components/PricingCTA";
import type { PlanType, FAQItem } from "./types";

const plans: PlanType[] = [
  {
    title: "Pro",
    price: "$49",
    period: "/month",
    description: "Best for growing HR teams who want faster, smarter recruitment.",
    features: [
      "Advanced AI Resume Screening",
      "Up to 200 candidate analyses/month",
      "Priority Support",
      "Team Collaboration Tools",
    ],
    buttonType: "primary",
    link: "#",
  },
  {
    title: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations and enterprise-level needs.",
    features: [
      "Unlimited AI Screening",
      "Dedicated Account Manager",
      "Integration Support",
      "Custom Reports & Analytics",
    ],
    buttonType: "default",
    link: "#",
  },
];

const faqs: FAQItem[] = [
  {
    question: "What is AI CV Screening?",
    answer:
      "AI CV Screening uses machine learning to evaluate and rank candidates based on job requirements, saving recruiters time.",
  },
  {
    question: "Can I upgrade or downgrade anytime?",
    answer: "Yes. You can change your plan anytime from your dashboard without losing data.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption and comply with GDPR regulations.",
  },
  {
    question: "Do you offer enterprise demos?",
    answer: "Yes. Our team can schedule a live demo and tailor the solution to your company's needs.",
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20 pb-24 px-6 md:px-24">
      <PricingHeader />
      <PlansGrid plans={plans} />
      <FAQSection faqs={faqs} />
      <PricingCTA />
    </div>
  );
};

export default PricingPage;
