import React from "react";
import { Row, Col } from "antd";
import PlanCard from "./PlanCard";
import type { PlanType } from "../types";

type Props = {
  plans: PlanType[];
};

const PlansGrid: React.FC<Props> = ({ plans }) => {
  return (
    <div style={{ padding: "10px 20px" }}>
      <Row gutter={[32, 32]} justify="center" align="stretch">
        {plans.map((plan) => (
          <Col xs={24} sm={12} md={8} key={plan.title}>
            <PlanCard plan={plan} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PlansGrid;
