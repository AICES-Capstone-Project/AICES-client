import React from "react";
import { Button, Tooltip } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

interface SubscriptionDetailsSectionProps {
  startDate: string;
  endDate: string;
  price: number;
  onCancel?: () => void;
  cancelling?: boolean;
}

const SubscriptionDetailsSection: React.FC<SubscriptionDetailsSectionProps> = ({
  startDate,
  endDate,
  price,
  onCancel,
  cancelling,
}) => {
  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "24px",
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <h3
        style={{
          margin: "0 0 24px 0",
          fontSize: 16,
          fontWeight: 600,
          color: "#374151",
          textAlign: 'center',
        }}
      >
        Subscription Details
      </h3>
      <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 220px', padding: '12px 16px', borderRight: '1px solid rgba(15,23,36,0.06)' }}>
            <div style={{ color: '#6b7280', fontWeight: 500, fontSize: 13 }}>Start Date</div>
            <div style={{ color: '#111827', fontWeight: 700, marginTop: 6 }}>
              {new Date(startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <div style={{ flex: '1 1 220px', padding: '12px 16px', borderRight: '1px solid rgba(15,23,36,0.06)' }}>
            <div style={{ color: '#6b7280', fontWeight: 500, fontSize: 13 }}>End Date</div>
            <div style={{ color: '#111827', fontWeight: 700, marginTop: 6 }}>
              {new Date(endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <div style={{ flex: '1 1 220px', padding: '12px 16px', borderRight: '1px solid rgba(15,23,36,0.06)'}}>
            <div style={{ color: '#6b7280', fontWeight: 500, fontSize: 13 }}>Total Price</div>
            <div style={{ color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: 16, marginTop: 6 }}>
              {price === 0
                ? 'Free'
                : `$${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
          </div>

          {/* cancel icon area */}
          {onCancel ? (
            <div style={{ flex: '0 0 56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title="Cancel subscription">
                <Button
                  onClick={onCancel}
                  loading={cancelling}
                  type="text"
                  aria-label="Cancel subscription"
                  style={{
                    width: 36,
                    height: 36,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  icon={<CloseCircleOutlined style={{ color: '#ef4444', fontSize: 22 }} />}
                />
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsSection;
