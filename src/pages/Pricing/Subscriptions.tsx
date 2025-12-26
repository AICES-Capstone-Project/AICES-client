import React, { useEffect, useState } from "react";
import PricingHeader from "./components/PricingHeader";
import PlansGrid from "./components/PlansGrid";
import FAQSection from "./components/FAQSection";
import PricingCTA from "./components/PricingCTA";
import type { PlanType, FAQItem } from "../../types/subscription.types";
import { usePricingPlans } from "./usePricingPlans";
import { companySubscriptionService } from "../../services/companySubscriptionService";
import { useAppSelector } from "../../hooks/redux";

const faqs: FAQItem[] = [
	{
		question: "What is AI CV Screening?",
		answer:
			"AI CV Screening uses machine learning to evaluate and rank candidates based on job requirements, saving recruiters time.",
	},
	{
		question: "Can I upgrade or downgrade anytime?",
		answer:
			"Yes. You can change your plan anytime from your dashboard without losing data.",
	},
	{
		question: "Is my data secure?",
		answer:
			"Absolutely. We use industry-standard encryption and comply with GDPR regulations.",
	},
	{
		question: "Do you offer enterprise demos?",
		answer:
			"Yes. Our team can schedule a live demo and tailor the solution to your company's needs.",
	},
];

function mapApiPlanToPlanType(apiPlan: any): PlanType {
	const periodMap: Record<string, string> = {
		Daily: "/day",
		Monthly: "/month",
		Yearly: "/year",
	};

	return {
		title: apiPlan.name,
		price:
			apiPlan.price === 0
				? "Free"
				: `$${(apiPlan.price / 100).toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
				  })}`,
		period: periodMap[apiPlan.duration] || "/month",
		description: apiPlan.description,
		features: [
			`${apiPlan.resumeLimit} Resume Limit / ${apiPlan.hoursLimit} Hours`,
			`${apiPlan.compareLimit} Compare Limit / ${apiPlan.compareHoursLimit} Compare Hours`,
			`Export reports (PDF, Excel)`,
			`Batch screening`,
			`Advanced filtering & search`,
		],
		subscriptionId: apiPlan.subscriptionId,
		buttonType: "primary" as PlanType["buttonType"],
		link: "#",
	};
}

const PricingPage: React.FC = () => {
	const { plans, loading, error } = usePricingPlans();
	const { user } = useAppSelector((state) => state.auth);
	const isLoggedIn = !!user;
	const [currentSubscriptionName, setCurrentSubscriptionName] = useState<
		string | null
	>(null);

	useEffect(() => {
		const fetchCurrentSubscription = async () => {
			try {
				const response =
					await companySubscriptionService.getCurrentSubscription();
				if (response.status === "Success" && response.data) {
					setCurrentSubscriptionName(response.data.subscriptionName);
				}
			} catch (err) {
				// User might not have a subscription yet, which is fine
				console.log("No current subscription");
			}
		};
		fetchCurrentSubscription();
	}, []);

	// Map plans and filter based on current subscription
	const mappedPlans: PlanType[] = plans.map(mapApiPlanToPlanType);
	const filteredPlans: PlanType[] = mappedPlans.filter((plan) => {
		// If user has a non-Free subscription (Pro, Enterprise, etc.), hide Free plan
		if (
			currentSubscriptionName &&
			currentSubscriptionName.toLowerCase() !== "free"
		) {
			// Hide Free plan, but show current plan and other plans
			return plan.title.toLowerCase() !== "free";
		}
		// If user has Free subscription or no subscription, show all plans
		return true;
	});

	return (
		<div className="bg-gradient-to-br from-slate-50 via-white to-gray-50 text-slate-800 min-h-screen pt-20 pb-24 px-6 md:px-24">
			<PricingHeader />
			{loading ? (
				<div className="text-center py-12 text-slate-600 text-lg">
					Loading plans...
				</div>
			) : error ? (
				<div className="text-center py-12 text-red-600 font-medium">
					{error}
				</div>
			) : (
				<PlansGrid
					plans={filteredPlans}
					currentSubscriptionName={currentSubscriptionName}
					isLoggedIn={isLoggedIn}
				/>
			)}
			<FAQSection faqs={faqs} />
			<PricingCTA />
		</div>
	);
};

export default PricingPage;
