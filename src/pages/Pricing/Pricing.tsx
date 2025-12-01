
import React from "react";
import PricingHeader from "./components/PricingHeader";
import PlansGrid from "./components/PlansGrid";
import FAQSection from "./components/FAQSection";
import PricingCTA from "./components/PricingCTA";
import type { PlanType, FAQItem } from "../../types/subscription.types";
import { usePricingPlans } from "./usePricingPlans";

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

function mapApiPlanToPlanType(apiPlan: any): PlanType {
  return {
    title: apiPlan.name,
    price: apiPlan.price === 0
      ? "Free"
      : `$${(apiPlan.price / 100).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    period: apiPlan.durationDays >= 30 ? "/month" : `/day`,
    description: apiPlan.description,
    features: [
      `Resume Limit: ${apiPlan.resumeLimit}`,
      `Hours Limit: ${apiPlan.hoursLimit}`,
      `Duration: ${apiPlan.durationDays} days`,
    ],
    subscriptionId: apiPlan.subscriptionId,
    buttonType: "primary" as PlanType['buttonType'],
    link: "#",
  };
}


const PricingPage: React.FC = () => {
  const { plans, loading, error } = usePricingPlans();
  const mappedPlans: PlanType[] = plans.map(mapApiPlanToPlanType);

  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20 pb-24 px-6 md:px-24">
      <PricingHeader />
      {loading ? (
        <div className="text-center py-12">Loading plans...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <PlansGrid plans={mappedPlans} />
      )}
      <FAQSection faqs={faqs} />
      <PricingCTA />
    </div>
  );
};

export default PricingPage;
