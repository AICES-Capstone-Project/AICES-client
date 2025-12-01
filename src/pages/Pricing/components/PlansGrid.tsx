import React from "react";
import { Row, Col } from "antd";
import PlanCard from "./PlanCard";
import type { PlanType } from "../../../types/subscription.types";

type Props = {
  plans: PlanType[];
};

const PlansGrid: React.FC<Props> = ({ plans }) => {
  const featuredIndex = Math.floor(plans.length / 2);

  return (
    <div style={{ padding: "10px 20px" }}>
      <Row gutter={[32, 32]} justify="center" align="stretch">
        {plans.map((plan, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} key={plan.title} style={{ display: "flex" }}>
            <PlanCard plan={plan} featured={idx === featuredIndex} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PlansGrid;
