import React from "react";
import { Descriptions } from "antd";

interface SubscriptionDetailsSectionProps {
  startDate: string;
  endDate: string;
  price: number;
}

const SubscriptionDetailsSection: React.FC<SubscriptionDetailsSectionProps> = ({
  startDate,
  endDate,
  price,
}) => {
  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "20px",
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: 16,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        Subscription Details
      </h3>
      <Descriptions
        bordered
        column={1}
        labelStyle={{
          background: "#fff",
          fontWeight: 500,
          color: "#6b7280",
          width: "180px",
        }}
        contentStyle={{
          background: "#fff",
          color: "#111827",
        }}
      >
        <Descriptions.Item label="Start Date">
          <strong>
            {new Date(startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          <strong>
            {new Date(endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label="Total Price">
          <strong style={{ fontSize: 16, color: "#667eea" }}>
            {price?.toLocaleString()} VND
          </strong>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default SubscriptionDetailsSection;
