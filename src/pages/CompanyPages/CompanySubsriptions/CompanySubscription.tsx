import React, { useEffect, useState } from "react";
import { Card, Button, Space, Modal } from "antd";
import { useNavigate } from "react-router-dom";
// paymentService not used on this page
import { companySubscriptionService } from "../../../services/companySubscriptionService";
import SubscriptionStatsCard from "./components/SubscriptionStatsCard";
import SubscriptionDetailsSection from "./components/SubscriptionDetailsSection";
import { toastError, toastSuccess } from "../../../components/UI/Toast";

const CompanySubscription: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    const loadCurrent = async () => {
      setLoading(true);
      try {
        const response = await companySubscriptionService.getCurrentSubscription();
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
          setCurrentSubscription(null);
        }
      } catch (error) {
        console.error("Failed to load current subscription:", error);
        toastError("Failed to load current subscription");
      } finally {
        setLoading(false);
      }
    };

    loadCurrent();
  }, []);



  const handleCancelSubscription = () => {
    setConfirmVisible(true);
  };

  const handleConfirmCancel = async () => {
    setConfirmVisible(false);
    setCancelling(true);
    try {
      const response = await companySubscriptionService.cancelSubscription();
      if (response.status === "Success") {
        toastSuccess("Subscription cancelled successfully");
        // Reload current subscription
        const updatedResponse = await companySubscriptionService.getCurrentSubscription();
        if (updatedResponse.status === "Success" && updatedResponse.data) {
          const data = updatedResponse.data;
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
          setCurrentSubscription(null);
        }
      } else {
        toastError(response.message || "Failed to cancel subscription");
      }
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      toastError(error?.response?.data?.message || error?.message || "Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  // table/columns removed — this screen shows the company's current subscription instead

  return (
    <Card
      bordered={false}
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
        height: 'calc(100% - 25px)',
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: '0 0 auto' }}>
            <span className="font-semibold">My Subscription</span>
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <Space>
              <Button className="company-btn" onClick={() => navigate("/company/payment-history")}>
                Payment History
              </Button>
            </Space>
          </div>
        </div>
      }
    >

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>Loading...</div>
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
            onCancel={handleCancelSubscription}
            cancelling={cancelling}
          />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>No active subscription found</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Choose a plan to get started</p>
          <Button className="company-btn--filled" style={{ marginTop: 24 }} onClick={() => navigate("/subscriptions")}>View Subscription Plans</Button>
        </div>
      )}

      {/* Cancel Subscription Confirmation Modal */}
      <Modal
        
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        footer={null} // ❗Ẩn footer mặc định
        centered
      >
        <h1 style={{ textAlign: "center", fontSize: 16 }}>Are you sure you want to cancel your subscription?</h1>

        {/* Footer tự tạo */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between", 
            alignItems: "center",
          }}
        >
          <Button
            className="company-btn"
            onClick={() => setConfirmVisible(false)}
            style={{ minWidth: 110 }}
          >
            No, Keep it
          </Button>

          <Button
            className="company-btn--danger"
            danger
            onClick={handleConfirmCancel}
            loading={cancelling}
            style={{ minWidth: 110 }}
          >
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default CompanySubscription;
