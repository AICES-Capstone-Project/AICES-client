import React, { useRef } from "react";
import { Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { CarouselRef } from "antd/es/carousel";
import PlanCard from "./PlanCard";
import type { PlanType } from "../../../types/subscription.types";

type Props = {
  plans: PlanType[];
  currentSubscriptionName?: string | null;
};

const PlansGrid: React.FC<Props> = ({ plans, currentSubscriptionName }) => {
  const carouselRef = useRef<CarouselRef>(null);
  const featuredIndex = Math.floor(plans.length / 2);

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  return (
    <div style={{ position: "relative", padding: "10px 60px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={handlePrev}
          className="transition-all duration-300 hover:shadow-lg"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-primary-light)';
            e.currentTarget.style.color = 'var(--color-primary-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '';
          }}
          style={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />

        <Carousel
          ref={carouselRef}
          dots={true}
          slidesToShow={3}
          slidesToScroll={1}
          infinite={true}
          className="pricing-carousel"
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
          style={{ width: "100%" }}
        >
        {plans.map((plan, idx) => (
          <div key={plan.title} style={{ padding: "0 10px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: 350, maxWidth: "100%" }}>
              <PlanCard 
                plan={plan} 
                featured={idx === featuredIndex} 
                isCurrentPlan={currentSubscriptionName ? plan.title.toLowerCase() === currentSubscriptionName.toLowerCase() : false}
              />
            </div>
          </div>
        ))}
        </Carousel>

        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={handleNext}
          className="transition-all duration-300 hover:shadow-lg"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-primary-light)';
            e.currentTarget.style.color = 'var(--color-primary-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '';
          }}
          style={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>
    </div>
  );
};

export default PlansGrid;
