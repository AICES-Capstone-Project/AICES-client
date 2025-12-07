import React from "react";
import { Card, Button, Typography } from "antd";
import { CheckOutlined, FileTextOutlined, FilePdfOutlined, ReloadOutlined, FilterOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { paymentService } from "../../../services/paymentService";
import { Modal } from "antd";
import { useState } from "react";
import type { PlanType } from "../../../types/subscription.types";

const { Title, Paragraph, Text } = Typography;

type Props = {
  plan: PlanType;
  featured?: boolean;
  isCurrentPlan?: boolean;
};

const PlanCard: React.FC<Props> = ({ plan, featured = false, isCurrentPlan = false }) => {
  const isPopular = featured || plan.title === "Pro";
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Card
      className={`rounded-2xl transition-all duration-300 h-full flex flex-col justify-between ${isPopular
        ? "relative shadow-lg"
        : "hover:shadow-lg"
        }`}
      style={{
        backgroundColor: "#fff",
        color: "#0f1724",
        border: isPopular ? "2px solid var(--color-primary-dark)" : "2px solid var(--color-primary-medium)",
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 24,
      }}
    >
      <div className="flex-1 text-center">
        <Title level={4} className="!text-slate-800 !font-semibold !text-2xl mb-1">
          {plan.title}
        </Title>
        <Paragraph 
          className="!text-slate-600 text-sm mb-4"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.6em',
            lineHeight: '1.2em'
          }}
        >
          {plan.description}
        </Paragraph>

        <div className="mb-6">
          <Title level={2} className="!text-3xl !font-bold !text-slate-800 mb-0">
            {plan.price}
            <Text className="!text-slate-600 !text-base"> {plan.period}</Text>
          </Title>
        </div>

        {isCurrentPlan ? (
          <Button
            className="w-full rounded-full font-medium text-white border-none !mb-5"
            size="large"
            style={{ backgroundColor:"gray", color: "white", cursor: "default" }}
            disabled
          >
            <CheckOutlined /> Current Plan
          </Button>
        ) : (
          <Button
            className="company-btn--filled w-full rounded-full font-medium !bg-[var(--color-primary-medium)] hover:!bg-[var(--color-primary-light)] text-white border-none !mb-5"
            size="large"
            loading={loadingCheckout}
            onClick={async () => {
              if (!plan.subscriptionId) {
                Modal.error({
                  title: "Missing plan",
                  content: "This plan cannot be purchased.",
                  width: 760,
                  okButtonProps: { style: { backgroundColor: "var(--color-primary-light)", color: "#fff", borderColor: "var(--color-primary-medium)" } },
                });
                return;
              }

              setLoadingCheckout(true);
              try {
                const res = await paymentService.createCheckoutSession(plan.subscriptionId!);
                if (res.status === "Success" && res.data?.url) {
                  window.location.href = res.data.url;
                } else {
                  Modal.error({
                    title: "Checkout failed",
                    content: res.message || "Failed to create checkout session",
                    width: 760,
                    okButtonProps: { style: { backgroundColor: "var(--color-primary-light)", color: "#fff", borderColor: "var(--color-primary-medium)" } },
                  });
                }
              } catch (err: any) {
                Modal.error({
                  title: "Checkout error",
                  content: err?.message || "Failed to create checkout session",
                  width: 760,
                  okButtonProps: { style: { backgroundColor: "var(--color-primary-light)", color: "#fff", borderColor: "var(--color-primary-medium)" } },
                });
              } finally {
                setLoadingCheckout(false);
              }
            }}
          >
              {`Upgrade ${plan.title}`}
          </Button>
        )}

        <ul className="flex flex-col gap-5 mb-8 text-left mt-2">
          {plan.features.map((feature: string, i: number) => {
            // If this is the Free plan card, hide Export and Advanced filter features
            if (plan.title?.toLowerCase() === "free") {
              const f = feature.toLowerCase();
              if (f.includes("export") || f.includes("filter")) {
                return null;
              }
            }
            // Select icon based on feature content
            let icon = <CheckOutlined className="text-slate-600 mt-1" />;
            if (feature.toLowerCase().includes('resume limit')) {
              icon = <FileTextOutlined className="text-slate-600 mt-1" />;
            } else if (feature.toLowerCase().includes('hours limit')) {
              icon = <ClockCircleOutlined className="text-slate-600 mt-1" />;
            } else if (feature.toLowerCase().includes('export') || feature.toLowerCase().includes('pdf') || feature.toLowerCase().includes('excel')) {
              icon = <FilePdfOutlined className="text-slate-600 mt-1" />;
            } else if (feature.toLowerCase().includes('retry')) {
              icon = <ReloadOutlined className="text-slate-600 mt-1" />;
            } else if (feature.toLowerCase().includes('filter')) {
              icon = <FilterOutlined className="text-slate-600 mt-1" />;
            }
            
            return (
              <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                {icon}
                <span>{feature}</span>
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
