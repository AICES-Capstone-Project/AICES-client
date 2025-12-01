import React from "react";

interface SubscriptionStatsCardProps {
  subscriptionName: string;
  resumeLimit: number;
  hoursLimit: number;
  durationDays: number;
}

const SubscriptionStatsCard: React.FC<SubscriptionStatsCardProps> = ({
  subscriptionName,
  resumeLimit,
  hoursLimit,
  durationDays,
}) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 33%, var(--color-primary-medium) 66%, var(--color-primary-light) 100%)",
        padding: "32px",
        borderRadius: 12,
        marginBottom: 24,
        color: "white",
        boxShadow: "0 8px 24px rgba(9, 37, 22, 0.18)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            color: "rgba(255,255,255,0.8)",
            margin: "8px 0 0 0",
            fontSize: 14,
          }}
        >
          {subscriptionName || "Premium subscription plan"}
        </h2>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginTop: 24,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Resume Limit
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {resumeLimit}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Hours Limit
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {hoursLimit}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Days Left
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {durationDays}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatsCard;
