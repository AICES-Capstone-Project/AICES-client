import React from "react";
import { Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

const PricingCTA: React.FC = () => {
  return (
    <div className="text-center !mt-24  !mb-24">
      <Title level={2} className="!text-3xl !text-primary">
        Ready to make smarter hiring decisions?
      </Title>
      <Paragraph className="text-slate-500 mt-2 mb-6">
        Contact our team today for a personalized demo and pricing consultation.
      </Paragraph>
      <Button type="primary" size="large" className="rounded-full" style={{ backgroundColor: "var(--color-primary)" }} href="#">
        Contact Us for a Demo
      </Button>
    </div>
  );
};

export default PricingCTA;
