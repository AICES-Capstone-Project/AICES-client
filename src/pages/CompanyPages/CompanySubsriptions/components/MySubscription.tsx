import React, { useEffect, useState } from "react";
import { Card, Button, message, Spin, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SubscriptionStatsCard from "./SubscriptionStatsCard";
import SubscriptionDetailsSection from "./SubscriptionDetailsSection";
import { subscriptionService } from "../../../../services/subscriptionService";

const MySubscription: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getCurrentSubscription();
      if (response.status === "Success" && response.data) {
        const data = response.data;

        setCurrentSubscription({
          subscriptionName: data.subscriptionName,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.subscriptionStatus,
          resumeLimit: data.resumeLimit,
          price: data.price,
          hoursLimit: data.hoursLimit,
          durationDays: data.durationDays,
        });
      } else {
        message.error(response.message || "Failed to load current subscription");
      }
    } catch (error) {
      console.error("Failed to load current subscription:", error);
      message.error("Failed to load current subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    setConfirmVisible(true);
  };

  const handleConfirmCancel = async () => {
    setConfirmVisible(false);
    setCancelling(true);
    try {
      const response = await subscriptionService.cancelSubscription();
      if (response.status === "Success") {
        message.success("Your subscription has been cancelled");
        navigate("/company/subscriptions");
      } else {
        message.error(response.message || "Failed to cancel subscription");
      }
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      message.error(error?.response?.data?.message || "Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/company/subscriptions")}
            type="text"
          />
          <span>My Subscription</span>
        </div>
      }
      bordered={false}
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
      }}
      extra={
        currentSubscription && (
          <Button danger onClick={handleCancelSubscription} loading={cancelling}>
            Cancel Subscription
          </Button>
        )
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : currentSubscription ? (
        <div>
          <SubscriptionStatsCard
            subscriptionName={currentSubscription.subscriptionName}
            resumeLimit={currentSubscription.resumeLimit}
            hoursLimit={currentSubscription.hoursLimit}
            durationDays={currentSubscription.durationDays}
          />
          <SubscriptionDetailsSection
            startDate={currentSubscription.startDate}
            endDate={currentSubscription.endDate}
            price={currentSubscription.price}
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
          <Button
            className="company-btn--filled"
            style={{ marginTop: 24 }}
            onClick={() => navigate("/company/subscriptions")}
          >
            View Subscription Plans
          </Button>
        </div>
      )}

      <Modal
        title="Cancel Subscription"
        open={confirmVisible}
        onOk={handleConfirmCancel}
        onCancel={() => setConfirmVisible(false)}
        okText="Yes, Cancel"
        cancelText="No, Keep it"
        okButtonProps={{ danger: true }}
        confirmLoading={cancelling}
        centered
      >
        <p>Are you sure you want to cancel your subscription? This action cannot be undone.</p>
      </Modal>
    </Card>
  );
};

export default MySubscription;
