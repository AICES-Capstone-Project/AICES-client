import React from "react";
import { Card, Button, Typography } from "antd";
import { CheckOutlined, ArrowRightOutlined } from "@ant-design/icons";
import type { PlanType } from "../types";

const { Title, Paragraph, Text } = Typography;

type Props = {
  plan: PlanType;
};

const PlanCard: React.FC<Props> = ({ plan }) => {
  const isPopular = plan.title === "Pro";

  return (
    <Card
      bordered={false}
      className={`rounded-2xl shadow-md transition-all duration-300 h-full flex flex-col justify-between ${isPopular
        ? "border-2 bg-white relative shadow-lg"
        : "bg-white hover:shadow-lg"
        }`}
      style={{
        borderColor: isPopular ? "var(--color-primary-dark)" : "rgba(0,0,0,0.05)",
        borderTop: isPopular ? "4px solid var(--color-primary-dark)" : "4px solid rgba(0,0,0,0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-semibold !px-5 !py-2 rounded-full shadow"
          style={{ backgroundColor: "var(--color-primary-dark)" }}
        >
          Most Popular
        </div>
      )}

      <div className="flex-1 text-center px-2">
        <Title level={3} className="!text-slate-900 !font-semibold !text-xl mb-1">
          {plan.title}
        </Title>
        <Paragraph className="!text-slate-500 text-base mb-4">{plan.description}</Paragraph>

        <Title level={1} className="!text-4xl !font-bold !text-slate-900 mb-2">
          {plan.price}
          <Text className="!text-[var(--color-primary-dark)] !text-lg"> {plan.period}</Text>
        </Title>

        <ul className="space-y-3 mb-8 text-left mt-6 inline-block">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
              <CheckOutlined className="text-[var(--color-primary-dark)] mt-1" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        type={isPopular ? "primary" : "default"}
        size="large"
        className={`w-full rounded-full font-medium ${isPopular
          ? "!bg-[var(--color-primary-dark)] hover:!bg-[var(--color-primary-light)] text-white border-none"
          : "!border-[var(--color-primary-dark)] !text-[var(--color-primary-dark)] hover:!bg-[var(--color-primary-light)] hover:!text-white"
          }`}
        href={plan.link}
      >
        {isPopular ? "Get Pro Plan" : "Contact Sales"} <ArrowRightOutlined />
      </Button>
    </Card>
  );
};

export default PlanCard;
