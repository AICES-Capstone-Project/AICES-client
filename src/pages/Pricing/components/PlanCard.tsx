import React from "react";
import { Card, Button, Typography } from "antd";
import {
	CheckOutlined,
	CheckCircleFilled,
	CloseCircleFilled,
} from "@ant-design/icons";
import { paymentService } from "../../../services/paymentService";
import { Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PlanType } from "../../../types/subscription.types";
import { APP_ROUTES } from "../../../services/config";

const { Title, Paragraph, Text } = Typography;

type Props = {
	plan: PlanType;
	featured?: boolean;
	isCurrentPlan?: boolean;
	isLoggedIn?: boolean;
};

const PlanCard: React.FC<Props> = ({
	plan,
	isCurrentPlan = false,
	isLoggedIn = false,
}) => {
	const [loadingCheckout, setLoadingCheckout] = useState(false);
	const navigate = useNavigate();

	// Determine card styling based on plan type
	const isFree = plan.title?.toLowerCase() === "free";
	const isPro = plan.title?.toLowerCase() === "pro";

	return (
		<div
			className={`relative transition-all duration-300 ${
				isPro ? "scale-[1.03]" : "hover:scale-[1.02]"
			}`}
			style={{ display: "flex", flexDirection: "column", width: "100%" }}
		>
			{/* Most Popular Badge - Only for Pro plan */}
			{isPro && (
				<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
					<span
						className="text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg"
						style={{
							background:
								"linear-gradient(to right, var(--color-primary-medium), var(--color-primary))",
						}}
					>
						⭐ Most Popular
					</span>
				</div>
			)}

			<Card
				className={`
          rounded-2xl transition-all duration-300 h-full flex flex-col justify-between
          ${isPro ? "shadow-2xl hover:shadow-2xl" : "shadow-md hover:shadow-xl"}
        `}
				style={{
					color: "#0f1724",
					background: isPro
						? "linear-gradient(to bottom right, rgba(var(--color-primary-light-rgb, 144, 238, 144), 0.1), white, rgba(var(--color-primary-rgb, 34, 197, 94), 0.05))"
						: isFree
						? "linear-gradient(to bottom right, rgb(248, 250, 252), rgb(241, 245, 249))"
						: "linear-gradient(to bottom right, rgb(248, 250, 252), white, rgb(238, 242, 255))",
					border: isPro
						? "2px solid var(--color-primary-medium)"
						: isFree
						? "2px solid rgb(203, 213, 225)"
						: "2px solid var(--color-primary-light)",
					boxShadow: isPro
						? "0 20px 25px -5px rgba(var(--color-primary-rgb, 34, 197, 94), 0.1), 0 8px 10px -6px rgba(var(--color-primary-rgb, 34, 197, 94), 0.1)"
						: undefined,
					minHeight: 420,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: 24,
				}}
			>
				<div className="flex-1 text-center">
					<Title
						level={4}
						className="!font-bold !text-2xl mb-1"
						style={{ color: isPro ? "var(--color-primary-dark)" : "#0f172a" }}
					>
						{plan.title}
					</Title>
					<Paragraph
						className="!text-slate-600 text-sm mb-6"
						style={{
							display: "-webkit-box",
							WebkitLineClamp: 3,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							minHeight: "3.6em",
							lineHeight: "1.2em",
						}}
					>
						{plan.description}
					</Paragraph>

					<div className="mb-8">
						<Title
							level={2}
							className="!text-5xl !font-extrabold mb-1"
							style={{ color: isPro ? "var(--color-primary-dark)" : "#0f172a" }}
						>
							{plan.price}
						</Title>
						<Text className="!text-slate-600 !text-lg !font-semibold">
							{plan.period}
						</Text>
					</div>

					{isCurrentPlan ? (
						<Button
							className="w-full rounded-xl font-semibold border-none !mb-6 shadow-sm"
							size="large"
							style={{
								backgroundColor: "rgb(203, 213, 225)",
								color: "rgb(100, 116, 139)",
								cursor: "default",
							}}
							disabled
						>
							<CheckOutlined /> Current Plan
						</Button>
					) : (
						<Button
							className="w-full rounded-xl font-semibold border-none !mb-6 transition-all duration-300 shadow-lg hover:shadow-xl !text-white"
							size="large"
							style={{
								background: isPro
									? "linear-gradient(to right, var(--color-primary-medium), var(--color-primary))"
									: isFree
									? "linear-gradient(to right, rgb(71, 85, 105), rgb(51, 65, 85))"
									: "linear-gradient(to right, var(--color-primary-light), var(--color-primary-medium))",
							}}
							onMouseEnter={(e) => {
								if (isPro) {
									e.currentTarget.style.background =
										"linear-gradient(to right, var(--color-primary), var(--color-primary-dark))";
								} else if (isFree) {
									e.currentTarget.style.background =
										"linear-gradient(to right, rgb(51, 65, 85), rgb(30, 41, 59))";
								} else {
									e.currentTarget.style.background =
										"linear-gradient(to right, var(--color-primary-medium), var(--color-primary-dark))";
								}
							}}
							onMouseLeave={(e) => {
								if (isPro) {
									e.currentTarget.style.background =
										"linear-gradient(to right, var(--color-primary-medium), var(--color-primary))";
								} else if (isFree) {
									e.currentTarget.style.background =
										"linear-gradient(to right, rgb(71, 85, 105), rgb(51, 65, 85))";
								} else {
									e.currentTarget.style.background =
										"linear-gradient(to right, var(--color-primary-light), var(--color-primary-medium))";
								}
							}}
							loading={loadingCheckout}
							onClick={async () => {
								// If user is not logged in and plan is Free, redirect to login
								if (!isLoggedIn && isFree) {
									navigate(APP_ROUTES.LOGIN);
									return;
								}

								if (!plan.subscriptionId) {
									Modal.error({
										title: "Missing plan",
										content: "This plan cannot be purchased.",
										width: 760,
										okButtonProps: {
											style: {
												backgroundColor: "var(--color-primary-light)",
												color: "#fff",
												borderColor: "var(--color-primary-medium)",
											},
										},
									});
									return;
								}

								setLoadingCheckout(true);
								try {
									const res = await paymentService.createCheckoutSession(
										plan.subscriptionId!
									);
									if (res.status === "Success" && res.data?.url) {
										window.location.href = res.data.url;
									} else {
										Modal.error({
											title: "Checkout failed",
											content:
												res.message || "Failed to create checkout session",
											width: 760,
											okButtonProps: {
												style: {
													backgroundColor: "var(--color-primary-light)",
													color: "#fff",
													borderColor: "var(--color-primary-medium)",
												},
											},
										});
									}
								} catch (err: any) {
									Modal.error({
										title: "Checkout error",
										content:
											err?.message || "Failed to create checkout session",
										width: 760,
										okButtonProps: {
											style: {
												backgroundColor: "var(--color-primary-light)",
												color: "#fff",
												borderColor: "var(--color-primary-medium)",
											},
										},
									});
								} finally {
									setLoadingCheckout(false);
								}
							}}
						>
							{!isLoggedIn && isFree ? "Get Free" : `Upgrade ${plan.title}`}
						</Button>
					)}

					<ul className="flex flex-col gap-3 mb-6 text-left mt-2">
						{plan.features.map((feature: string, i: number) => {
							// For Free plan: only "resume limit" gets tick icon, others get X icon
							// For other plans: all features get tick icon
							let icon;
							if (isFree) {
								const featureLower = feature.toLowerCase();
								if (featureLower.includes("resume limit")) {
									// Green check circle for resume limit in free plan
									icon = (
										<CheckCircleFilled
											className="text-lg flex-shrink-0"
											style={{ color: "#22c55e" }}
										/>
									);
								} else {
									// Red close circle for other features in free plan
									icon = (
										<CloseCircleFilled
											className="text-lg flex-shrink-0"
											style={{ color: "#ef4444" }}
										/>
									);
								}
							} else {
								// Green check circle for all features in Pro/Enterprise plans
								icon = (
									<CheckCircleFilled
										className="text-lg flex-shrink-0"
										style={{ color: "#22c55e" }}
									/>
								);
							}

							return (
								<li
									key={i}
									className="flex items-center gap-3 text-slate-700 text-sm leading-relaxed"
								>
									{icon}
									<span className="flex-1">{feature}</span>
								</li>
							);
						})}
					</ul>
				</div>
			</Card>
		</div>
	);
};

export default PlanCard;
