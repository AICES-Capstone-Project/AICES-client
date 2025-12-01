import React from "react";
import { Card, Button, Typography } from "antd";
import { CheckOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { paymentService } from "../../../services/paymentService";
import { Modal } from "antd";
import { useState } from "react";
import type { PlanType } from "../../../types/subscription.types";

const { Title, Paragraph, Text } = Typography;

type Props = {
  plan: PlanType;
  featured?: boolean;
};

const PlanCard: React.FC<Props> = ({ plan, featured = false }) => {
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
        backgroundColor: "var(--color-primary-light)",
        color: "var(--text-on-primary, #0f1724)",
        border: isPopular ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(0,0,0,0.03)",
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 24,
      }}
    >
      <div style={{ minHeight: 20, display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 12 }}>
        {isPopular ? (
          <span
            style={{
              backgroundColor: "var(--color-primary-dark)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}
          >
            Most Popular
          </span>
        ) : null}
      </div>
      <div className="flex-1 text-left">
        <Title level={4} className="!text-white !font-semibold !text-lg mb-1">
          {plan.title}
        </Title>
        <Paragraph className="!text-white text-sm mb-4">{plan.description}</Paragraph>

        <div className="mb-4">
          <Title level={2} className="!text-3xl !font-bold !text-white mb-0">
            {plan.price}
            <Text className="!text-white !text-base"> {plan.period}</Text>
          </Title>
        </div>

        <ul className="flex flex-col gap-5 mb-8 text-left mt-2">
          {plan.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-white text-sm">
              <CheckOutlined className="text-white mt-1" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className="company-btn--filled w-full rounded-full font-medium !bg-[var(--color-primary-dark)] hover:!bg-[var(--color-primary-medium)] text-white border-none"
        size="large"
        style={{ marginTop: 15 }}
        loading={loadingCheckout}
        onClick={async () => {
          if (!plan.subscriptionId) {
            Modal.error({ title: "Missing plan", content: "This plan cannot be purchased." });
            return;
          }

          setLoadingCheckout(true);
          try {
            const res = await paymentService.createCheckoutSession(plan.subscriptionId!);
            if (res.status === "Success" && res.data?.url) {
              window.location.href = res.data.url;
            } else {
              Modal.error({ title: "Checkout failed", content: res.message || "Failed to create checkout session" });
            }
          } catch (err: any) {
            Modal.error({ title: "Checkout error", content: err?.message || "Failed to create checkout session" });
          } finally {
            setLoadingCheckout(false);
          }
        }}
      >
        Get Plan <ArrowRightOutlined />
      </Button>
    </Card>
    </div>
  );
};

export default PlanCard;
