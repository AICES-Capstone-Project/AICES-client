import { Card, Button, Result, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { paymentService } from "../../../../services/paymentService";

interface PaymentInfo {
  amount: number;
  planName: string;
  duration: string;
  date: string;
  invoiceUrl?: string;
  currency?: string;
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const loadPaymentDetails = async () => {
    try {
      const response = await paymentService.getSessionDetails(sessionId!);
      if (response.status === "Success" && response.data) {
        const data = response.data;
        setPaymentInfo({
          amount: data.transaction?.amount || 0,
          planName: data.subscriptionName || "Unknown Plan",
          duration: "30 days", // You can calculate from subscription data if available
          date: data.transaction?.transactionTime 
            ? new Date(data.transaction.transactionTime).toLocaleString()
            : new Date().toLocaleString(),
          invoiceUrl: data.invoiceUrl,
          currency: data.transaction?.currency || "USD"
        });
      }
    } catch (error) {
      console.error("Failed to load payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f5f5f5"
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f5f5f5"
      }}>
        <Card style={{ maxWidth: 600, textAlign: "center" }}>
          <Result
            status="warning"
            title="Payment information not found"
            extra={
              <Button className="company-btn--filled" onClick={() => navigate("/company/subscriptions")}>
                Back to Subscriptions
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f5f5f5"
    }}>
      <Card
        style={{
          maxWidth: 600,
          width: "90%",
          textAlign: "center",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a", fontSize: 72 }} />}
          status="success"
          title={<span style={{ fontSize: 24, fontWeight: 600 }}>Payment Successful!</span>}
          subTitle="Your subscription has been activated successfully."
        />
        
        {/* Payment Summary */}
        <div style={{ 
          marginTop: 24, 
          padding: "20px 24px", 
          background: "#f0f9ff", 
          borderRadius: 8,
          border: "1px solid #bae7ff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "#666", fontSize: 15 }}>Subscription Plan:</span>
            <strong style={{ fontSize: 15 }}>{paymentInfo.planName}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "#666", fontSize: 15 }}>Payment Date:</span>
            <strong style={{ fontSize: 15 }}>{paymentInfo.date}</strong>
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            paddingTop: 16, 
            borderTop: "1px solid #d9d9d9"
          }}>
            <span style={{ color: "#666", fontSize: 16 }}>Amount Paid:</span>
            <strong style={{ fontSize: 22, color: "#52c41a" }}>
              {paymentInfo.amount === 0
                ? "Free"
                : `$${(paymentInfo.amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
          <Button 
            className="company-btn--filled" 
            size="large"
            onClick={() => navigate("/company/subscriptions")}
          >
            View My Subscription
          </Button>
          <Button 
            className="company-btn" 
            size="large"
            onClick={() => navigate("/company/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Invoice Download */}
        {paymentInfo.invoiceUrl && (
          <div style={{ marginTop: 20 }}>
            <Button 
              type="link" 
              href={paymentInfo.invoiceUrl} 
              target="_blank"
              size="large"
            >
              📄 Download Invoice
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
