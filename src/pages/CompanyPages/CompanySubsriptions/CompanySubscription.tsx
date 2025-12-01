import React, { useEffect, useState } from "react";
import { Card, Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// paymentService not used on this page
import { companySubscriptionService } from "../../../services/companySubscriptionService";
import SubscriptionStatsCard from "./components/SubscriptionStatsCard";
import SubscriptionDetailsSection from "./components/SubscriptionDetailsSection";
import { toastError } from "../../../components/UI/Toast";

const CompanyClients: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

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

  const handleSearch = (value: string) => {
    setSearchText(value);
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
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
          <div style={{ flex: '0 0 auto' }}>
            <span className="font-semibold">My Subscription</span>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              style={{ width: 360 }}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <Space>
              <Button className="company-btn" onClick={() => navigate("/company/payment-history") }>
                Payment History
              </Button>
              <Button className="company-btn--filled" onClick={() => navigate("/pricing") }>
                View Plans
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
          />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>No active subscription found</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Choose a plan to get started</p>
          <Button className="company-btn--filled" style={{ marginTop: 24 }} onClick={() => navigate("/company/subscriptions")}>View Subscription Plans</Button>
        </div>
      )}



      {/* no error modal needed on this page */}
    </Card>
  );
};

export default CompanyClients;
