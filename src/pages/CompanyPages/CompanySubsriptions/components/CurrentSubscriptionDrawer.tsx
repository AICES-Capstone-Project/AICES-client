import React, { useState } from "react";
import { Drawer, Button, message, Modal } from "antd";
import SubscriptionStatsCard from "./SubscriptionStatsCard";
import SubscriptionDetailsSection from "./SubscriptionDetailsSection";
import { companySubscriptionService } from "../../../../services/companySubscriptionService";

interface CurrentSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  subscription: {
    subscriptionName: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    resumeLimit: number;
    price: number;
    hoursLimit: number;
    durationDays: number;
  } | null;
  onCancelled?: () => void;
}

const CurrentSubscriptionModal: React.FC<CurrentSubscriptionModalProps> = ({
  visible,
  onClose,
  subscription,
  onCancelled,
}) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    Modal.confirm({
      title: "Cancel Subscription",
      content: "Are you sure you want to cancel your subscription? This action cannot be undone.",
      okText: "Yes, Cancel",
      cancelText: "No, Keep it",
      okButtonProps: { danger: true },
      centered: true,
      zIndex: 2000,
      getContainer: false,
      onOk: async () => {
        setCancelling(true);
        try {
          const response = await companySubscriptionService.cancelSubscription();
          if (response.status === "Success") {
            onCancelled?.();
          } else {
            message.error(response.message || "Failed to cancel subscription");
          }
        } catch (error: any) {
          console.error("Failed to cancel subscription:", error);
          message.error(error?.response?.data?.message || "Failed to cancel subscription");
        } finally {
          setCancelling(false);
        }
      },
      onCancel: () => {
        // User cancelled the confirmation
      },
    });
  };
  return (
    <Drawer
      title="My Subscription"
      placement="right"
      width={600}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {subscription && (
            <Button danger onClick={handleCancelSubscription} loading={cancelling}>
              Cancel Subscription
            </Button>
          )}
          <Button className="company-btn" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {subscription ? (
        <div>
          <SubscriptionStatsCard
            subscriptionName={subscription.subscriptionName}
            resumeLimit={subscription.resumeLimit}
            hoursLimit={subscription.hoursLimit}
            durationDays={subscription.durationDays}
          />
          <SubscriptionDetailsSection
            startDate={subscription.startDate}
            endDate={subscription.endDate}
            price={subscription.price}
          />
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#9ca3af",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
            No active subscription found
          </p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Choose a plan to get started
          </p>
        </div>
      )}
    </Drawer>
  );
};

export default CurrentSubscriptionModal;
